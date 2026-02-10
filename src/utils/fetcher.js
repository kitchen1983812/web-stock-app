import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import DOMPurify from 'dompurify';

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});

async function fetchWithProxy(url, proxyType) {
    let proxyUrl;
    if (proxyType === 'allorigins') {
        proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    } else if (proxyType === 'corsproxy') {
        proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
        const response = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`Proxy ${proxyType} failed`);

        if (proxyType === 'allorigins') {
            const data = await response.json();
            return data.contents;
        } else {
            return await response.text();
        }
    } catch (e) {
        clearTimeout(timeoutId);
        throw e;
    }
}

export async function fetchPageContent(url) {
    let html = null;
    let error = null;

    // Try Primary Proxy
    try {
        html = await fetchWithProxy(url, 'allorigins');
    } catch (e) {
        console.warn('Primary proxy failed, trying backup...', e);
        // Try Backup Proxy
        try {
            html = await fetchWithProxy(url, 'corsproxy');
        } catch (e2) {
            console.error('All proxies failed', e2);
            error = e2;
        }
    }

    if (!html) {
        // If we couldn't get HTML, return what we can (just URL)
        // allowing the user to manually enter title
        throw new Error('ページの取得に失敗しました。URLを確認するか、手動で入力してください。');
    }

    try {
        // Clean and Parse HTML
        const cleanHtml = DOMPurify.sanitize(html);
        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanHtml, 'text/html');

        // Fix relative links
        const base = new URL(url);
        doc.querySelectorAll('a').forEach(a => {
            try { a.href = new URL(a.getAttribute('href'), base).href; } catch (e) { }
        });
        doc.querySelectorAll('img').forEach(img => {
            try { img.src = new URL(img.getAttribute('src'), base).href; } catch (e) { }
        });

        const reader = new Readability(doc);
        const article = reader.parse();

        if (!article) {
            return {
                title: doc.title || 'No Title',
                markdown: '',
                excerpt: ''
            };
        }

        const markdown = turndownService.turndown(article.content);

        return {
            title: article.title,
            markdown: markdown,
            excerpt: article.excerpt,
            siteName: article.siteName
        };

    } catch (parseError) {
        console.error('Parsing error:', parseError);
        // Even if parsing fails, try to return title if possible
        return {
            title: 'Untitiled Page',
            markdown: '',
            excerpt: ''
        };
    }
}
