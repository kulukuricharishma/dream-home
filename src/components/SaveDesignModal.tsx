import React, { useState } from 'react';
import { Furniture, Decoration, Lighting, WallColorName, FloorType, RoomType, RoomSize, Design } from '../types';
import { Bookmark, Check, X } from 'lucide-react';

interface SaveDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (design: Design) => void;
  defaultDesignName?: string;
  roomName: string;
  roomType: RoomType;
  roomSize: RoomSize;
  wallColor: WallColorName;
  floorType: FloorType;
  furniture: Furniture[];
  decorations: Decoration[];
  lighting: Lighting;
  existingId?: string;
}

export const SaveDesignModal: React.FC<SaveDesignModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
  defaultDesignName = '',
  roomName,
  roomType,
  roomSize,
  wallColor,
  floorType,
  furniture,
  decorations,
  lighting,
  existingId,
}) => {
  const [designName, setDesignName] = useState(
    defaultDesignName || (roomName ? `${roomName} Design` : 'My Dream Room')
  );
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designName.trim()) {
      setError('Design Name cannot be empty when saving.');
      return;
    }

    const design: Design = {
      id: existingId || `design-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      designName: designName.trim(),
      roomName: roomName || 'My Room',
      roomType,
      roomSize,
      wallColor,
      floorType,
      furniture: [...furniture],
      decorations: [...decorations],
      lighting: { ...lighting },
      createdAt: new Date().toISOString(),
    };

    setSavedSuccess(true);
    setTimeout(() => {
      onSaveSuccess(design);
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-2xl p-6 relative animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {savedSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-in zoom-in">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Design saved successfully ✓</h3>
            <p className="text-xs text-stone-500">Your custom room has been added to My Designs.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-stone-900">Save Your Room Design</h3>
                <p className="text-xs text-stone-500">Store this layout to view or edit anytime</p>
              </div>
            </div>

            <div>
              <label htmlFor="design-name-input" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Design Name <span className="text-red-500">*</span>
              </label>
              <input
                id="design-name-input"
                type="text"
                value={designName}
                onChange={(e) => {
                  setDesignName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. My Cozy Bedroom, Nordic Atelier"
                className={`w-full px-3.5 py-2 text-sm bg-stone-50 border rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 transition ${
                  error ? 'border-red-400 focus:ring-red-200' : 'border-stone-300 focus:ring-amber-500/20 focus:border-amber-700'
                }`}
                autoFocus
              />
              {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
            </div>

            {/* Design overview recap */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs space-y-1 text-stone-600">
              <div className="flex justify-between">
                <span>Room:</span>
                <span className="font-medium text-stone-900">{roomName} ({roomType})</span>
              </div>
              <div className="flex justify-between">
                <span>Wall & Floor:</span>
                <span className="font-medium text-stone-900">{wallColor} Wall · {floorType}</span>
              </div>
              <div className="flex justify-between">
                <span>Contents:</span>
                <span className="font-medium text-stone-900">
                  {furniture.length} Furniture · {decorations.length} Decor
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>Save Design</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
