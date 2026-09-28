import React, { useState } from 'react';
import { INSPIRATION_ITEMS } from '../data/inspiration';
import { InspirationItem } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface InspirationPageProps {
  onUseDesign: (item: InspirationItem) => void;
}

const STYLES = ['All', 'Minimal', 'Cozy', 'Modern', 'Classic'] as const;

export const InspirationPage: React.FC<InspirationPageProps> = ({ onUseDesign }) => {
  const [selectedStyle, setSelectedStyle] = useState<(typeof STYLES)[number]>('All');

  const filtered = INSPIRATION_ITEMS.filter((item) =>
    selectedStyle === 'All' ? true : item.style === selectedStyle
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Architectural Galleries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
          Room Inspiration
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
          Browse professionally styled interior presets. Select any room to jump straight into the editor with pre-configured walls, flooring, lighting, and furniture.
        </p>
      </div>

      {/* Interactive Category Filter Tabs */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {STYLES.map((style) => {
          const isSelected = selectedStyle === style;
          return (
            <button
              key={style}
              type="button"
              onClick={() => setSelectedStyle(style)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-stone-900 text-stone-100 shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {style === 'All' ? 'All Styles' : style}
            </button>
          );
        })}
      </div>

      {/* Grid of designs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={item.imageUrl}
                  alt={item.designName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-stone-100 text-[10px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {item.style}
                </div>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-stone-900 text-[11px] font-medium px-2.5 py-0.5 rounded-md shadow-xs">
                  {item.roomType}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="text-[11px] text-stone-500 font-medium">
                  Theme: <span className="text-stone-700 font-semibold">{item.colorTheme}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900 leading-snug">
                  {item.designName}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                type="button"
                onClick={() => onUseDesign(item)}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-2 group-hover:bg-amber-900"
              >
                <span>Use This Design</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
