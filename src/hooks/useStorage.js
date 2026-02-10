import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'web-stock-app-data';

export function useStorage() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse storage', e);
            }
        }
    }, []);

    const saveItem = (item) => {
        const newItem = {
            ...item,
            id: uuidv4(),
            createdAt: new Date().toISOString()
        };
        const updated = [newItem, ...items];
        setItems(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return newItem;
    };

    const deleteItem = (id) => {
        const updated = items.filter(i => i.id !== id);
        setItems(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const updateItem = (id, updates) => {
        const updated = items.map(i => i.id === id ? { ...i, ...updates } : i);
        setItems(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const exportItem = (item) => {
        const { title, url, tags, content, excerpt, createdAt } = item;
        const dateStr = new Date(createdAt).toISOString().split('T')[0];
        const safeTitle = title.replace(/[\\/:*?"<>|]/g, '_');
        const filename = `${dateStr}_${safeTitle}.md`;

        const tagStr = tags && tags.length > 0 ? `\n  - ${tags.join('\n  - ')}` : ' []';

        const fileContent = `---
created: ${createdAt}
url: ${url}
tags:${tagStr}
---
# ${title}

[Original Link](${url})

> ${excerpt || 'No excerpt'}

${content}
`;

        // Trigger download
        const blob = new Blob([fileContent], { type: 'text/markdown' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    return {
        items,
        saveItem,
        deleteItem,
        updateItem,
        exportItem
    };
}
