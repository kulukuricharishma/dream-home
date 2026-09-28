import React from 'react';

interface FooterProps {
  onNavigate: (page: 'home' | 'create' | 'designs' | 'inspiration') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-stone-200/80 bg-stone-100/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <div className="w-7 h-7 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-sm font-bold">
              D
            </div>
            <div>
              <span className="font-serif font-bold text-stone-900 text-sm">DreamHome</span>
              <span className="text-xs text-stone-500 block">Virtual room customization made simple.</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-stone-600 font-medium">
            <button onClick={() => onNavigate('home')} className="hover:text-stone-900 transition">
              Home
            </button>
            <button onClick={() => onNavigate('create')} className="hover:text-stone-900 transition">
              Create Room
            </button>
            <button onClick={() => onNavigate('designs')} className="hover:text-stone-900 transition">
              My Designs
            </button>
            <button onClick={() => onNavigate('inspiration')} className="hover:text-stone-900 transition">
              Inspiration
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-200 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} DreamHome. Design the space you dream of.</p>
        </div>
      </div>
    </footer>
  );
};
