import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch, loading, history, onSelectHistory }) {
  const [city, setCity] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = city.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    setCity('');
  }

  return (
    <div className='w-full max-w-lg mx-auto flex flex-col gap-3'>
      <form onSubmit={handleSubmit} className='flex gap-2 w-full relative'>
        <div className='relative flex-1'>
          <input
            type='text'
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder='Search for a city...'
            className='w-full px-5 py-3.5 pl-12 rounded-2xl border border-white/20
                       bg-white/10 text-white placeholder-white/60 backdrop-blur-md
                       focus:outline-none focus:ring-2 focus:ring-white/40
                       transition duration-300 ease-in-out text-base shadow-lg'
          />
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5' />
        </div>
        <button
          type='submit'
          disabled={loading}
          className='px-6 py-3.5 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-semibold rounded-2xl
                     border border-white/20 backdrop-blur-md transition-all duration-300 disabled:opacity-50 shadow-lg flex items-center gap-2'
        >
          {loading ? (
            <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
          ) : (
            'Search'
          )}
        </button>
      </form>

      {/* Recent Searches */}
      {history && history.length > 0 && (
        <div className='flex flex-wrap gap-2 items-center justify-center mt-1 animate-fade-in'>
          <span className='text-white/60 text-xs font-semibold uppercase tracking-wider mr-1'>Recent:</span>
          {history.map((item, idx) => (
            <button
              key={`${item}-${idx}`}
              onClick={() => onSelectHistory(item)}
              className='px-3.5 py-1 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold rounded-full
                         border border-white/10 backdrop-blur-md transition duration-200 shadow-sm'
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

