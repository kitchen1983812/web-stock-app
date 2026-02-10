export function suggestTags(url, title) {
    const tags = new Set();

    try {
        const hostname = new URL(url).hostname;

        // Domain based suggestions
        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) tags.add('video');
        if (hostname.includes('github.com')) tags.add('dev');
        if (hostname.includes('stackoverflow.com')) tags.add('dev');
        if (hostname.includes('twitter.com') || hostname.includes('x.com')) tags.add('social');
        if (hostname.includes('medium.com') || hostname.includes('zenn.dev') || hostname.includes('qiita.com')) tags.add('blog');
        if (hostname.includes('amazon')) tags.add('shopping');
        if (hostname.includes('wikipedia')) tags.add('wiki');

        // Title based suggestions (Simple keyword matching)
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('recipe') || lowerTitle.includes('cook')) tags.add('recipe');
        if (lowerTitle.includes('news')) tags.add('news');
        if (lowerTitle.includes('tutorial') || lowerTitle.includes('howto') || lowerTitle.includes('guide')) tags.add('guide');
        if (lowerTitle.includes('review')) tags.add('review');

    } catch (e) {
        // Invalid URL, ignore
    }

    return Array.from(tags);
}
