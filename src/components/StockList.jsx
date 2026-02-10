import React, { useState } from 'react';
import { Download, ExternalLink, Trash2, Search, FileText } from 'lucide-react';

export default function StockList({ items, onDelete, onExport }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.url.includes(searchTerm) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (items.length === 0) {
        return (
            <div className="text-center py-20 text-white/60">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>保存されたページはありません。</p>
                <p className="text-sm">ブラウザからURLを共有するか、手動で追加してください。</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                    type="text"
                    placeholder="タイトル、URL、タグで検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="!pl-10 !bg-white/5 backdrop-blur-sm border-white/10"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map(item => (
                    <div key={item.id} className="glass-panel p-5 hover:bg-white/10 transition-colors group relative">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg leading-tight line-clamp-2 pr-8" title={item.title}>
                                {item.title}
                            </h3>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 bg-black/20 p-1 rounded backdrop-blur">
                                <button
                                    onClick={() => onExport(item)}
                                    className="!p-1.5 !text-xs !bg-transparent hover:!text-green-400 border-none"
                                    title="Markdownをダウンロード"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="!p-1.5 !text-xs !bg-transparent hover:!text-red-400 border-none"
                                    title="削除"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-white/60 hover:text-accent truncate block mb-3 flex items-center gap-1"
                        >
                            <ExternalLink className="w-3 h-3" />
                            {item.url}
                        </a>

                        {item.excerpt && (
                            <p className="text-sm text-white/80 line-clamp-3 mb-3 font-light">
                                {item.excerpt}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-auto pt-2">
                            {item.tags?.map(tag => (
                                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                                    #{tag}
                                </span>
                            ))}
                            <span className="text-xs ml-auto text-white/40 self-center">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
