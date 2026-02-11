import React, { useState, useEffect } from 'react';
import { generateMarkdown } from '../utils/formatter';
import type { ClipData } from '../utils/formatter';
import { fetchAndParse } from '../utils/fetcher';
import './ClipperForm.css';

interface ClipperFormProps {
    initialUrl?: string;
    initialTitle?: string;
    initialText?: string;
}

const ClipperForm: React.FC<ClipperFormProps> = ({ initialUrl, initialTitle, initialText }) => {
    const [url, setUrl] = useState(initialUrl || '');
    const [title, setTitle] = useState(initialTitle || '');
    const [content, setContent] = useState(initialText || '');
    const [tags, setTags] = useState('clippings');
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        if (initialUrl && !content) {
            handleFetch(initialUrl);
        }
    }, [initialUrl]);

    const handleFetch = async (targetUrl: string) => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const data = await fetchAndParse(targetUrl);
            if (data) {
                if (data.title) setTitle(data.title);
                if (data.markdown) setContent(data.markdown);
            } else {
                setFetchError('Could not fetch content automatically (likely CORS). Please paste content manually.');
            }
        } catch (e) {
            setFetchError('Error fetching content.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        // Sanitize title for filename
        // Remove illegal chars: * " \ / < > : | ?
        const safeFilename = title.replace(/[\\/:*?"<>|]/g, '-').trim();

        const clipData: ClipData = {
            title, // Frontmatter keeps original title
            url,
            tags: tags.split(',').map(t => t.trim()),
            content,
        };
        const markdown = generateMarkdown(clipData);

        // Construct Obsidian URI
        // Use 'file' parameter to specify folder path: Clippings/Filename
        const filePath = `Clippings/${safeFilename}`;
        const encodedFilePath = encodeURIComponent(filePath);
        const encodedContent = encodeURIComponent(markdown);

        // obsidian://new?file=Path%2FTo%2FFile&content=...
        const obsidianUri = `obsidian://new?file=${encodedFilePath}&content=${encodedContent}`;

        window.location.href = obsidianUri;
    };

    return (
        <div className="clipper-form">
            <h1>Obsidian Clipper</h1>

            <div className="form-group">
                <label>URL</label>
                <input
                    type="text"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className="form-control"
                />
                <button
                    onClick={() => handleFetch(url)}
                    className="btn-link"
                    disabled={!url || isLoading}
                >
                    {isLoading ? 'Fetching...' : 'Re-fetch Content'}
                </button>
            </div>

            {fetchError && (
                <div className="alert-warning">
                    {fetchError}
                </div>
            )}

            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                    type="text"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label>Content (Markdown)</label>
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="form-control"
                />
            </div>

            <button
                onClick={handleSave}
                className="btn-primary"
            >
                Save to Obsidian
            </button>
        </div>
    );
};

export default ClipperForm;
