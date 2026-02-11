import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';

export interface ExtractedContent {
    title?: string;
    markdown?: string;
    excerpt?: string;
    byline?: string;
}

export const fetchAndParse = async (url: string): Promise<ExtractedContent | null> => {
    let html = '';
    let errorDetails = '';

    // Strategy 1: Direct Fetch
    try {
        const response = await fetch(url, { headers: { "User-Agent": "ObsidianClipper/1.0" } });
        if (response.ok) {
            html = await response.text();
            console.log('Fetched via Direct');
        } else {
            errorDetails += `Direct: ${response.status} ${response.statusText}; `;
        }
    } catch (e) {
        errorDetails += `Direct: ${e}; `;
    }

    // Strategy 2: AllOrigins (JSONP/CORS friendly)
    if (!html) {
        try {
            console.log('Trying AllOrigins...');
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            if (response.ok) {
                const data = await response.json();
                if (data.contents) {
                    html = data.contents;
                    console.log('Fetched via AllOrigins');
                }
            } else {
                errorDetails += `AllOrigins: ${response.status}; `;
            }
        } catch (e) {
            errorDetails += `AllOrigins: ${e}; `;
        }
    }

    // Strategy 3: CorsProxy.io (Backup)
    if (!html) {
        try {
            console.log('Trying CorsProxy.io...');
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            if (response.ok) {
                html = await response.text();
                console.log('Fetched via CorsProxy.io');
            } else {
                errorDetails += `CorsProxy.io: ${response.status}; `;
            }
        } catch (e) {
            errorDetails += `CorsProxy.io: ${e}; `;
        }
    }

    if (!html) {
        console.warn('All fetch strategies failed:', errorDetails);
        throw new Error(`Failed to fetch content. Details: ${errorDetails}`);
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // Fix relative links
        const base = doc.createElement('base');
        base.href = url;
        doc.head.appendChild(base);

        const reader = new Readability(doc);
        const article = reader.parse();

        if (!article) return null;

        const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced'
        });
        const markdown = turndownService.turndown(article.content || '');

        return {
            title: article.title || undefined,
            markdown: markdown,
            excerpt: article.excerpt || undefined,
            byline: article.byline || undefined,
        };
    } catch (error) {
        console.warn('Parsing error:', error);
        return null;
    }
};
