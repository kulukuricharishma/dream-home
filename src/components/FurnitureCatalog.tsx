import React, { useState } from 'react';
import { FURNITURE_CATALOG } from '../data/catalog';
import { FurnitureCategory, CatalogItem, Furniture } from '../types';
import { ItemGraphic } from './ItemGraphic';
import { Plus, Check, Trash2 } from 'lucide-react';

interface FurnitureCatalogProps {
  onAddFurniture: (item: {
    catalogId: string;
    name: string;
    type: string;
    color: string;
    position: { x: number; y: number };
  }) => void;
  placedFurniture?: Furniture[];
  onRemoveFurniture?: (id: string, kind: 'furniture' | 'decoration') => void;
}

const CATEGORIES: ('All' | FurnitureCategory)[] = [
  'All',
  'Sofa',
  'Bed',
  'Chair',
  'Table',
  'Desk',
  'Wardrobe',
  'Bookshelf',
  'Nightstand',
  'TV Stand',
  'Bench',
  'Ottoman',
  'Poufs',
];

export const FurnitureCatalog: React.FC<FurnitureCatalogProps> = ({
  onAddFurniture,
  placedFurniture = [],
  onRemoveFurniture,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | FurnitureCategory>('All');
  // Track selected color per catalog item id
  const [itemColors, setItemColors] = useState<Record<string, string>>({});
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const filteredItems = FURNITURE_CATALOG.filter((item) =>
    selectedCategory === 'All' ? true : item.category === selectedCategory
  );

  const handleColorChange = (itemId: string, hex: string) => {
    setItemColors((prev) => ({ ...prev, [itemId]: hex }));
  };

  const handleAdd = (item: CatalogItem) => {
    const chosenColor = itemColors[item.id] || item.defaultColor;
    onAddFurniture({
      catalogId: item.id,
      name: item.name,
      type: item.category,
      color: chosenColor,
      position: { ...item.defaultPosition },
    });

    setAddedItemNotice(item.id);
    setTimeout(() => {
      setAddedItemNotice((cur) => (cur === item.id ? null : cur));
    }, 1400);
  };

  const getPlacedCount = (item: CatalogItem) => {
    return placedFurniture.filter(
      (f) => f.catalogId === item.id || f.name.toLowerCase() === item.name.toLowerCase()
    ).length;
  };

  const handleRemoveOne = (item: CatalogItem) => {
    if (!onRemoveFurniture) return;
    const matching = placedFurniture.filter(
      (f) => f.catalogId === item.id || f.name.toLowerCase() === item.name.toLowerCase()
    );
    if (matching.length > 0) {
      // Remove the last added one
      const target = matching[matching.length - 1];
      onRemoveFurniture(target.id, 'furniture');
    }
  };

  return (
    <div className="space-y-4">
      {/* Category selector */}
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

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {filteredItems.map((item) => {
          const currentColor = itemColors[item.id] || item.defaultColor;
          const wasJustAdded = addedItemNotice === item.id;

          return (
            <div
              key={item.id}
              className="group bg-white rounded-xl border border-stone-200 p-3 flex flex-col justify-between hover:border-stone-300 hover:shadow-sm transition"
            >
              {/* Graphic Graphic Preview */}
              <div className="w-full h-24 bg-stone-50 rounded-lg p-2 flex items-center justify-center relative overflow-hidden">
                <ItemGraphic
                  type={item.category}
                  name={item.name}
                  color={currentColor}
                  className="max-h-20 w-auto object-contain"
                  isThumbnail
                />
              </div>

              {/* Item Info */}
              <div className="mt-2.5 space-y-1">
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900 leading-tight">{item.name}</h4>
                    <p className="text-[11px] text-stone-500 font-medium">Type: {item.category}</p>
                  </div>
                  {getPlacedCount(item) > 0 && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full">
                      {getPlacedCount(item)} in room
                    </span>
                  )}
                </div>

                {/* Color swatches */}
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

              {/* Action Buttons: Add & Remove */}
              <div className="mt-2.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAdd(item)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
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

                {getPlacedCount(item) > 0 && onRemoveFurniture && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOne(item)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 border border-stone-200 transition shrink-0"
                    title={`Remove one ${item.name} from room`}
                    aria-label={`Remove one ${item.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
