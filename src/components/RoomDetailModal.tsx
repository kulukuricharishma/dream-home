import React from 'react';
import { Design } from '../types';
import { RoomPreview } from './RoomPreview';
import { X, Edit3, Trash2, Calendar, Sofa, Sparkles, Sun } from 'lucide-react';

interface RoomDetailModalProps {
  design: Design | null;
  onClose: () => void;
  onEdit: (design: Design) => void;
  onDelete: (id: string) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  design,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!design) return null;

  const formattedDate = new Date(design.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl border border-stone-200 shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 my-6"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-lg z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4 pr-8">
          <div>
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              {design.roomType} · {design.roomSize} Size
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-0.5">
              {design.designName}
            </h2>
            <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
              <span>Room: {design.roomName}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Created {formattedDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(design);
                onClose();
              }}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Design</span>
            </button>
            <button
              onClick={() => {
                onDelete(design.id);
                onClose();
              }}
              className="px-3 py-2 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl border border-red-200 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* 2D Room Preview Display */}
        <div className="mt-5 flex justify-center">
          <RoomPreview
            wallColor={design.wallColor}
            floorType={design.floorType}
            roomSize={design.roomSize}
            furniture={design.furniture}
            decorations={design.decorations}
            lighting={design.lighting}
            isInteractive={false}
            className="w-full"
          />
        </div>

        {/* Specifications summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block">Wall & Floor</span>
            <p className="font-semibold text-stone-900 mt-1">
              {design.wallColor} Wall · {design.floorType} Floor
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block flex items-center gap-1">
              <Sofa className="w-3 h-3 text-amber-700" /> Furniture ({design.furniture.length})
            </span>
            <p className="font-semibold text-stone-900 mt-1 truncate">
              {design.furniture.map((f) => f.name).join(', ') || 'None'}
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-700" /> Decorations ({design.decorations.length})
            </span>
            <p className="font-semibold text-stone-900 mt-1 truncate">
              {design.decorations.map((d) => d.name).join(', ') || 'None'}
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-700" /> Lighting
            </span>
            <p className="font-semibold text-stone-900 mt-1">
              {design.lighting.type} ({design.lighting.brightness}%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
