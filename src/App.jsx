import React, { useState, useEffect } from 'react';
import { useStorage } from './hooks/useStorage';
import AddForm from './components/AddForm';
import StockList from './components/StockList';
import { Plus, LayoutGrid } from 'lucide-react';

function App() {
  const { items, saveItem, deleteItem, exportItem } = useStorage();
  const [view, setView] = useState('list'); // 'list' | 'add'
  const [shareData, setShareData] = useState(null);

  // Handle Share Target Params & PWA Installed Mode params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    const text = params.get('text');
    const url = params.get('url') || (text && text.startsWith('http') ? text : null);

    if (url || title) {
      // If we have share data, switch to add mode immediately
      setShareData({
        title: title || '',
        url: url || '',
        text: text || ''
      });
      setView('add');
    }
  }, []);

  const handleSave = (item) => {
    saveItem(item);
    setView('list');
    setShareData(null);
    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleCancel = () => {
    setView('list');
    setShareData(null);
    window.history.replaceState({}, '', window.location.pathname);
  };

  return (
    <div className="container py-8 px-4 min-h-screen">
      <header className="flex justify-between items-center mb-8 sticky top-0 z-10 p-4 glass-panel bg-opacity-80 backdrop-blur-md transition-all">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setView('list')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center shadow-lg">
            <LayoutGrid className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">WebStock</h1>
        </div>

        {view === 'list' && (
          <button onClick={() => setView('add')} className="flex items-center gap-2 shadow-lg hover:shadow-accent/50">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">ページを追加</span>
          </button>
        )}
      </header>

      <main className="pb-20">
        {view === 'add' ? (
          <AddForm
            initialData={shareData}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <StockList
            items={items}
            onDelete={deleteItem}
            onExport={exportItem}
          />
        )}
      </main>
    </div>
  );
}

export default App;
