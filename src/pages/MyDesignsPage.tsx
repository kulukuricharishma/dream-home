import React, { useState } from 'react';
import { Design } from '../types';
import { RoomPreview } from '../components/RoomPreview';
import { RoomDetailModal } from '../components/RoomDetailModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Bookmark, PlusCircle, Eye, Edit3, Trash2, Calendar, Sparkles } from 'lucide-react';

interface MyDesignsPageProps {
  designs: Design[];
  onOpenCreate: () => void;
  onEditDesign: (design: Design) => void;
  onDeleteDesign: (id: string) => void;
}

export const MyDesignsPage: React.FC<MyDesignsPageProps> = ({
  designs,
  onOpenCreate,
  onEditDesign,
  onDeleteDesign,
}) => {
  const [activeModalDesign, setActiveModalDesign] = useState<Design | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (deleteTargetId) {
      onDeleteDesign(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-0.5 rounded-full mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Spaces</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">My Designs</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Browse, reopen, edit, or manage your customized virtual rooms.
          </p>
        </div>

        {designs.length > 0 && (
          <button
            onClick={onOpenCreate}
            className="py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Create New Room</span>
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {designs.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Your dream room starts here ✨
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            You haven't saved any room concepts yet. Pick your favorite colors, place furniture, and shape your sanctuary.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenCreate}
              className="py-3 px-6 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-xs rounded-xl shadow-md transition inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Create Your First Design</span>
            </button>
          </div>
        </div>
      ) : (
        /* SAVED DESIGNS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => {
            const formattedDate = new Date(design.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={design.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Visual Preview */}
                <div
                  onClick={() => setActiveModalDesign(design)}
                  className="cursor-pointer relative overflow-hidden bg-stone-100 p-2.5 flex items-center justify-center"
                >
                  <RoomPreview
                    wallColor={design.wallColor}
                    floorType={design.floorType}
                    roomSize={design.roomSize}
                    furniture={design.furniture}
                    decorations={design.decorations}
                    lighting={design.lighting}
                    isInteractive={false}
                    className="w-full pointer-events-none scale-95"
                  />
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/95 text-stone-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      View Full Details
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
                    <span className="uppercase tracking-wider font-semibold text-amber-800">
                      {design.roomType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {formattedDate}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-stone-900 truncate">
                    {design.designName}
                  </h3>

                  <div className="text-xs text-stone-500 flex items-center gap-2">
                    <span>{design.furniture.length} Furniture</span>
                    <span>·</span>
                    <span>{design.decorations.length} Decor</span>
                    <span>·</span>
                    <span>{design.wallColor}</span>
                  </div>
                </div>

                {/* Action Buttons: Open, Edit, Delete */}
                <div className="p-4 pt-0 border-t border-stone-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalDesign(design)}
                    className="flex-1 py-2 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditDesign(design)}
                    className="flex-1 py-2 px-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(design.id)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Delete Design"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <RoomDetailModal
        design={activeModalDesign}
        onClose={() => setActiveModalDesign(null)}
        onEdit={onEditDesign}
        onDelete={(id) => {
          setActiveModalDesign(null);
          setDeleteTargetId(id);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Design"
        message="Are you sure you want to delete this saved room design? This action cannot be undone."
        confirmLabel="Delete Design"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
