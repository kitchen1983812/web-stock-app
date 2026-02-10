import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';

export interface ExtractedContent {
    title?: string;
    markdown?: string;
    excerpt?: string;
    byline?: string;
}

export const fetchAndParse = async (url: string): Promise<ExtractedContent | null> => {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; ObsidianClipper/1.0)",
            },
        });

        if (!response.ok) {
            console.warn('Fetch failed:', response.statusText);
            return null;
        }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

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
        console.warn('CORS or network error:', error);
        return null;
    }
};
