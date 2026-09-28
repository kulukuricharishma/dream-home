import React from 'react';
import { Furniture, Decoration, Lighting, WallColorName, FloorType, RoomType, RoomSize } from '../types';
import { Bookmark, RotateCcw, Trash2, Sofa, Sparkles, Sliders } from 'lucide-react';

interface DesignSummaryProps {
  roomName: string;
  roomType: RoomType;
  roomSize: RoomSize;
  wallColor: WallColorName;
  floorType: FloorType;
  furniture: Furniture[];
  decorations: Decoration[];
  lighting: Lighting;
  onSaveDesign: () => void;
  onClearRoom: () => void;
  onRemoveItem: (id: string, kind: 'furniture' | 'decoration') => void;
}

export const DesignSummary: React.FC<DesignSummaryProps> = ({
  roomName,
  roomType,
  roomSize,
  wallColor,
  floorType,
  furniture,
  decorations,
  lighting,
  onSaveDesign,
  onClearRoom,
  onRemoveItem,
}) => {
  const totalItems = furniture.length + decorations.length;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-stone-900">Design Summary</h3>
          <p className="text-xs text-stone-500">Live specifications of your space</p>
        </div>
        <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md">
          {totalItems} item{totalItems === 1 ? '' : 's'} placed
        </span>
      </div>

      {/* Grid of specs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">Room Name</span>
          <span className="font-semibold text-stone-900 truncate block mt-0.5">{roomName || 'Untitled'}</span>
        </div>

        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">Room Type</span>
          <span className="font-semibold text-stone-900 block mt-0.5">{roomType}</span>
        </div>

        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">Room Size</span>
          <span className="font-semibold text-stone-900 block mt-0.5">{roomSize}</span>
        </div>

        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">Wall Color</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-semibold text-stone-900">{wallColor}</span>
          </div>
        </div>

        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">Floor Type</span>
          <span className="font-semibold text-stone-900 block mt-0.5">{floorType}</span>
        </div>

        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">Lighting</span>
          <span className="font-semibold text-stone-900 block mt-0.5 truncate">
            {lighting.type} ({lighting.color}, {lighting.brightness}%)
          </span>
        </div>
      </div>

      {/* Counts breakdown */}
      <div className="flex items-center justify-between text-xs py-2 px-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-stone-700">
        <span className="flex items-center gap-1.5">
          <Sofa className="w-3.5 h-3.5 text-amber-800" />
          Furniture Items: <strong className="text-stone-900">{furniture.length}</strong>
        </span>
        <span className="text-stone-300">·</span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-800" />
          Decorations: <strong className="text-stone-900">{decorations.length}</strong>
        </span>
        <span className="text-stone-300">·</span>
        <span className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-amber-800" />
          Light: <strong className="text-stone-900">{lighting.brightness}%</strong>
        </span>
      </div>

      {/* Placed Items List with individual Delete controls */}
      {totalItems > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block">
            Placed Items ({totalItems})
          </span>
          <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
            {furniture.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-xs transition"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 border border-stone-300"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-stone-800 truncate">{item.name}</span>
                  <span className="text-[10px] text-stone-400 shrink-0">({item.type})</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id, 'furniture')}
                  className="text-stone-400 hover:text-red-600 p-1 rounded transition"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {decorations.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-xs transition"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 border border-stone-300"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-stone-800 truncate">{item.name}</span>
                  <span className="text-[10px] text-stone-400 shrink-0">({item.type})</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id, 'decoration')}
                  className="text-stone-400 hover:text-red-600 p-1 rounded transition"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons: Save Design & Clear Room */}
      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <button
          type="button"
          onClick={onSaveDesign}
          className="flex-1 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-100 font-medium text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-400" />
          <span>Save Design</span>
        </button>

        <button
          type="button"
          onClick={onClearRoom}
          className="py-2.5 px-3 bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-600 font-medium text-xs rounded-xl border border-stone-200 transition flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Room</span>
        </button>
      </div>
    </div>
  );
};
