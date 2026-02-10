import React, { useState, useEffect } from 'react';
import { fetchPageContent } from '../utils/fetcher';
import { suggestTags } from '../utils/tagUtils';
import { Loader2, Plus, X, Save, Globe, Tag } from 'lucide-react';

export default function AddForm({ initialData, onSave, onCancel }) {
    const [url, setUrl] = useState(initialData?.url || '');
    const [title, setTitle] = useState(initialData?.title || '');
    const [tags, setTags] = useState(initialData?.tags || []);
    const [newTag, setNewTag] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);
    const [error, setError] = useState(null);

    // Auto-fetch if initial URL is present (from Share Target)
    useEffect(() => {
        if (initialData?.url && !fetched) {
            handleFetch(initialData.url);
        }
    }, [initialData]);

    // Auto-fetch when user types URL (with debounce)
    useEffect(() => {
        const isValidUrl = (string) => {
            try { return Boolean(new URL(string)); } catch (e) { return false; }
        };

        const timer = setTimeout(() => {
            if (url && isValidUrl(url) && !fetched && !loading && !content) {
                handleFetch(url);
            }
        }, 800); // 0.8s debounce

        return () => clearTimeout(timer);
    }, [url, fetched, loading, content]);

    const handleFetch = async (fetchUrl) => {
        if (!fetchUrl) return;
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPageContent(fetchUrl);
            setTitle(prev => prev || data.title); // Keep existing title if user typed one
            setContent(data.markdown);
            setExcerpt(data.excerpt);

            const suggested = suggestTags(fetchUrl, data.title);
            setTags(prev => [...new Set([...prev, ...suggested])]);
            setFetched(true);
        } catch (err) {
            // Don't show error on auto-fetch to avoid annoying user while typing
            // setError('コンテンツの取得に失敗しました。手動で保存してください。');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && newTag.trim()) {
            e.preventDefault();
            setTags(prev => [...new Set([...prev, newTag.trim()])]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            url,
            title: title || 'Untitled',
            tags,
            content,
            excerpt
        });
    };

    return (
        <div className="glass-panel p-6 w-full max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-accent" />
                新規ページ追加
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">URL</label>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            required
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onBlur={() => !fetched && handleFetch(url)}
                            placeholder="https://example.com"
                            className="flex-1"
                        />
                        <button
                            type="button"
                            onClick={() => handleFetch(url)}
                            disabled={loading || !url}
                            className="min-w-[100px] flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '取得'}
                        </button>
                    </div>
                    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">タイトル</label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="ページタイトル"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">タグ</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-sm flex items-center gap-1 border border-white/20">
                                #{tag}
                                <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => removeTag(tag)} />
                            </span>
                        ))}
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="タグを追加 (Enter)"
                            className="!w-32 !mb-0 !p-1 !h-8 text-sm !bg-transparent !border-none focus:!ring-0 placeholder:text-white/30"
                        />
                    </div>
                </div>

                {content && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg max-h-40 overflow-y-auto custom-scrollbar">
                        <h3 className="text-xs font-uppercase text-white/50 mb-2">プレビュー</h3>
                        <pre className="whitespace-pre-wrap text-xs text-white/80 font-mono">
                            {content.slice(0, 300)}...
                        </pre>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="!bg-transparent border !border-white/20 hover:!bg-white/5"
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        保存する
                    </button>
                </div>
            </form>
        </div>
    );
}
