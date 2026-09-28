import React, { useState } from 'react';
import { DECORATION_CATALOG } from '../data/catalog';
import { DecorationCategory, CatalogItem } from '../types';
import { ItemGraphic } from './ItemGraphic';
import { Plus, Check } from 'lucide-react';

interface DecorationCatalogProps {
  onAddDecoration: (item: {
    catalogId: string;
    name: string;
    type: string;
    color: string;
    position: { x: number; y: number };
  }) => void;
}

const CATEGORIES: ('All' | DecorationCategory)[] = ['All', 'Plant', 'Lamp', 'Mirror', 'Rug', 'Wall Art', 'Clock'];

export const DecorationCatalog: React.FC<DecorationCatalogProps> = ({ onAddDecoration }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | DecorationCategory>('All');
  const [itemColors, setItemColors] = useState<Record<string, string>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const filteredItems = DECORATION_CATALOG.filter((item) =>
    selectedCategory === 'All' ? true : item.category === selectedCategory
  );

  const handleColorChange = (itemId: string, hex: string) => {
    setItemColors((prev) => ({ ...prev, [itemId]: hex }));
  };

  const handleAdd = (item: CatalogItem) => {
    const chosenColor = itemColors[item.id] || item.defaultColor;
    onAddDecoration({
      catalogId: item.id,
      name: item.name,
      type: item.category,
      color: chosenColor,
      position: { ...item.defaultPosition },
    });

    setAddedNotice(item.id);
    setTimeout(() => {
      setAddedNotice((cur) => (cur === item.id ? null : cur));
    }, 1400);
  };

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-stone-900 text-stone-100 shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {filteredItems.map((item) => {
          const currentColor = itemColors[item.id] || item.defaultColor;
          const wasJustAdded = addedNotice === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200 p-3 flex flex-col justify-between hover:border-stone-300 hover:shadow-sm transition"
            >
              <div className="w-full h-24 bg-stone-50 rounded-lg p-2 flex items-center justify-center relative overflow-hidden">
                <ItemGraphic
                  type={item.category}
                  name={item.name}
                  color={currentColor}
                  className="max-h-20 w-auto object-contain"
                  isThumbnail
                />
              </div>

              <div className="mt-2.5 space-y-1">
                <div>
                  <h4 className="text-xs font-semibold text-stone-900 leading-tight">{item.name}</h4>
                  <p className="text-[11px] text-stone-500 font-medium">Type: {item.category}</p>
                </div>

                {item.availableColors.length > 0 && (
                  <div className="pt-1 flex items-center gap-1.5">
                    <span className="text-[10px] text-stone-400">Color:</span>
                    <div className="flex items-center gap-1">
                      {item.availableColors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleColorChange(item.id, c.hex)}
                          title={c.name}
                          className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                            currentColor === c.hex
                              ? 'ring-2 ring-stone-800 scale-110 border-white'
                              : 'border-stone-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleAdd(item)}
                className={`mt-2.5 w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  wasJustAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-800'
                }`}
              >
                {wasJustAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
