import React, { useState, useEffect } from 'react';
import { RoomType, RoomSize, WallColorName, FloorType, Furniture, Decoration, Lighting, Design } from '../types';
import { RoomDetailsForm } from '../components/RoomDetailsForm';
import { RoomPreview } from '../components/RoomPreview';
import { FurnitureCatalog } from '../components/FurnitureCatalog';
import { DecorationCatalog } from '../components/DecorationCatalog';
import { LightingControls } from '../components/LightingControls';
import { DesignSummary } from '../components/DesignSummary';
import { SaveDesignModal } from '../components/SaveDesignModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  SlidersHorizontal,
  Sofa,
  Sparkles,
  Sun,
  ClipboardList,
  CheckCircle2,
  Bookmark,
  RotateCcw,
} from 'lucide-react';

interface CreateRoomPageProps {
  initialDesign?: Design | null;
  onSaveDesign: (design: Design) => void;
  onNavigateToDesigns: () => void;
}

type TabType = 'details' | 'furniture' | 'decorations' | 'lighting' | 'summary';

export const CreateRoomPage: React.FC<CreateRoomPageProps> = ({
  initialDesign,
  onSaveDesign,
  onNavigateToDesigns,
}) => {
  // If an initial design is provided (from Edit or Inspiration), start with room created
  const [hasCreatedRoom, setHasCreatedRoom] = useState<boolean>(Boolean(initialDesign));

  // Room state
  const [roomName, setRoomName] = useState<string>(initialDesign?.roomName || '');
  const [roomType, setRoomType] = useState<RoomType>(initialDesign?.roomType || 'Living Room');
  const [roomSize, setRoomSize] = useState<RoomSize>(initialDesign?.roomSize || 'Medium');
  const [wallColor, setWallColor] = useState<WallColorName>(initialDesign?.wallColor || 'Beige');
  const [floorType, setFloorType] = useState<FloorType>(initialDesign?.floorType || 'Wooden');

  // Items state
  const [furniture, setFurniture] = useState<Furniture[]>(initialDesign?.furniture || []);
  const [decorations, setDecorations] = useState<Decoration[]>(initialDesign?.decorations || []);
  const [lighting, setLighting] = useState<Lighting>(
    initialDesign?.lighting || {
      type: 'Ceiling Light',
      color: 'Warm',
      brightness: 80,
    }
  );

  // Active control tab
  const [activeTab, setActiveTab] = useState<TabType>('details');

  // Modals & alerts
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Sync if initialDesign changes
  useEffect(() => {
    if (initialDesign) {
      setHasCreatedRoom(true);
      setRoomName(initialDesign.roomName);
      setRoomType(initialDesign.roomType);
      setRoomSize(initialDesign.roomSize);
      setWallColor(initialDesign.wallColor);
      setFloorType(initialDesign.floorType);
      setFurniture(initialDesign.furniture);
      setDecorations(initialDesign.decorations);
      setLighting(initialDesign.lighting);
      setActiveTab('furniture');
    }
  }, [initialDesign]);

  // Initial creation submission handler
  const handleInitialCreate = () => {
    setHasCreatedRoom(true);
    setActiveTab('furniture');
    showNotification('Room created! Start styling with furniture & lighting.');
  };

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast((cur) => (cur === msg ? null : cur));
    }, 3200);
  };

  // Add furniture
  const handleAddFurniture = (item: {
    catalogId: string;
    name: string;
    type: string;
    color: string;
    position: { x: number; y: number };
  }) => {
    // Add slight random offset so multiple additions don't completely overlap
    const jitterX = Math.floor(Math.random() * 8) - 4;
    const jitterY = Math.floor(Math.random() * 6) - 3;
    const newFurniture: Furniture = {
      id: `furn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      catalogId: item.catalogId,
      name: item.name,
      type: item.type,
      color: item.color,
      position: {
        x: Math.min(Math.max(item.position.x + jitterX, 15), 85),
        y: Math.min(Math.max(item.position.y + jitterY, 45), 82),
      },
    };
    setFurniture((prev) => [...prev, newFurniture]);
  };

  // Add decoration
  const handleAddDecoration = (item: {
    catalogId: string;
    name: string;
    type: string;
    color: string;
    position: { x: number; y: number };
  }) => {
    const jitterX = Math.floor(Math.random() * 8) - 4;
    const jitterY = Math.floor(Math.random() * 6) - 3;
    const newDeco: Decoration = {
      id: `deco-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      catalogId: item.catalogId,
      name: item.name,
      type: item.type,
      color: item.color,
      position: {
        x: Math.min(Math.max(item.position.x + jitterX, 15), 85),
        y: Math.min(Math.max(item.position.y + jitterY, 20), 85),
      },
    };
    setDecorations((prev) => [...prev, newDeco]);
  };

  // Remove item
  const handleRemoveItem = (id: string, kind: 'furniture' | 'decoration') => {
    if (kind === 'furniture') {
      setFurniture((prev) => prev.filter((f) => f.id !== id));
    } else {
      setDecorations((prev) => prev.filter((d) => d.id !== id));
    }
  };

  // Update item position
  const handleUpdatePosition = (id: string, kind: 'furniture' | 'decoration', pos: { x: number; y: number }) => {
    if (kind === 'furniture') {
      setFurniture((prev) => prev.map((f) => (f.id === id ? { ...f, position: pos } : f)));
    } else {
      setDecorations((prev) => prev.map((d) => (d.id === id ? { ...d, position: pos } : d)));
    }
  };

  // Clear room
  const handleClearRoom = () => {
    setFurniture([]);
    setDecorations([]);
    setLighting({
      type: 'Ceiling Light',
      color: 'Warm',
      brightness: 80,
    });
    setIsClearModalOpen(false);
    showNotification('Room cleared successfully.');
  };

  // Save design completed
  const handleSaveSuccess = (savedDesign: Design) => {
    onSaveDesign(savedDesign);
    showNotification('Design saved successfully ✓');
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'details', label: 'Room Details', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
    { id: 'furniture', label: 'Furniture', icon: <Sofa className="w-3.5 h-3.5" /> },
    { id: 'decorations', label: 'Decorations', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'lighting', label: 'Lighting', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'summary', label: 'Summary', icon: <ClipboardList className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast notification banner */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl shadow-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => onNavigateToDesigns()}
            className="text-xs underline font-bold text-emerald-800 hover:text-emerald-950 shrink-0"
          >
            View in My Designs →
          </button>
        </div>
      )}

      {/* Top Header bar with quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {initialDesign ? `Editing: ${initialDesign.designName}` : 'Create & Customize Room'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {roomName ? `${roomName} · ` : ''}{roomType} ({roomSize}) · {wallColor} Wall · {floorType} Floor
          </p>
        </div>

        {hasCreatedRoom && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="py-2 px-3.5 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Save Design</span>
            </button>
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="py-2 px-3 bg-white hover:bg-stone-100 text-stone-700 font-semibold text-xs rounded-xl border border-stone-300 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {/* INITIAL SETUP FORM VIEW (if user hasn't created the room yet) */}
      {!hasCreatedRoom ? (
        <div className="max-w-2xl mx-auto py-8">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Step 1 of 2</span>
              <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">Set Up Your Room</h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Define the baseline space dimensions, paint color, and floor surface. You can customize them anytime later.
              </p>
            </div>

            <RoomDetailsForm
              roomName={roomName}
              roomType={roomType}
              roomSize={roomSize}
              wallColor={wallColor}
              floorType={floorType}
              onUpdate={(data) => {
                setRoomName(data.roomName);
                setRoomType(data.roomType);
                setRoomSize(data.roomSize);
                setWallColor(data.wallColor);
                setFloorType(data.floorType);
              }}
              isInitialSetup={true}
              onCompleteInitialSetup={handleInitialCreate}
            />
          </div>
        </div>
      ) : (
        /* TWO-PANEL INTERACTIVE CUSTOMIZER */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANEL: Customization Controls */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 space-y-5 order-2 lg:order-1">
            {/* Customization Navigation Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-stone-100 scrollbar-none">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-stone-900 text-stone-100 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT */}
            <div>
              {/* 1. Room Details */}
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div className="border-b border-stone-100 pb-2">
                    <h3 className="text-sm font-semibold text-stone-900">Room Specifications</h3>
                    <p className="text-xs text-stone-500">Modify room dimensions, wall paint, and floor texture</p>
                  </div>
                  <RoomDetailsForm
                    roomName={roomName}
                    roomType={roomType}
                    roomSize={roomSize}
                    wallColor={wallColor}
                    floorType={floorType}
                    onUpdate={(data) => {
                      setRoomName(data.roomName);
                      setRoomType(data.roomType);
                      setRoomSize(data.roomSize);
                      setWallColor(data.wallColor);
                      setFloorType(data.floorType);
                    }}
                    isInitialSetup={false}
                  />
                </div>
              )}

              {/* 2. Furniture Catalog */}
              {activeTab === 'furniture' && (
                <div className="space-y-3">
                  <div className="border-b border-stone-100 pb-2">
                    <h3 className="text-sm font-semibold text-stone-900">Add Furniture</h3>
                    <p className="text-xs text-stone-500">Pick from sofas, beds, desks, ottomans, poufs, and dining pieces</p>
                  </div>
                  <FurnitureCatalog
                    onAddFurniture={handleAddFurniture}
                    placedFurniture={furniture}
                    onRemoveFurniture={handleRemoveItem}
                  />
                </div>
              )}

              {/* 3. Decoration Catalog */}
              {activeTab === 'decorations' && (
                <div className="space-y-3">
                  <div className="border-b border-stone-100 pb-2">
                    <h3 className="text-sm font-semibold text-stone-900">Add Decorations</h3>
                    <p className="text-xs text-stone-500">Add indoor greenery, ambient lamps, mirrors, rugs & art</p>
                  </div>
                  <DecorationCatalog onAddDecoration={handleAddDecoration} />
                </div>
              )}

              {/* 4. Lighting Controls */}
              {activeTab === 'lighting' && (
                <div className="space-y-3">
                  <div className="border-b border-stone-100 pb-2">
                    <h3 className="text-sm font-semibold text-stone-900">Adjust Lighting</h3>
                    <p className="text-xs text-stone-500">Control fixtures, color temperature, and ambient brightness</p>
                  </div>
                  <LightingControls lighting={lighting} onChange={setLighting} />
                </div>
              )}

              {/* 5. Summary */}
              {activeTab === 'summary' && (
                <DesignSummary
                  roomName={roomName}
                  roomType={roomType}
                  roomSize={roomSize}
                  wallColor={wallColor}
                  floorType={floorType}
                  furniture={furniture}
                  decorations={decorations}
                  lighting={lighting}
                  onSaveDesign={() => setIsSaveModalOpen(true)}
                  onClearRoom={() => setIsClearModalOpen(true)}
                  onRemoveItem={handleRemoveItem}
                />
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Live Room Preview */}
          <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-semibold text-stone-900">Live Room Preview</h3>
                </div>
                <span className="text-xs text-stone-500">
                  {furniture.length + decorations.length} object{furniture.length + decorations.length === 1 ? '' : 's'} placed
                </span>
              </div>

              <RoomPreview
                wallColor={wallColor}
                floorType={floorType}
                roomSize={roomSize}
                furniture={furniture}
                decorations={decorations}
                lighting={lighting}
                onRemoveItem={handleRemoveItem}
                onUpdatePosition={handleUpdatePosition}
                isInteractive={true}
              />
            </div>

            {/* Quick Summary Pill Bar under preview */}
            <div className="bg-white/80 rounded-xl border border-stone-200 p-3 flex items-center justify-between text-xs text-stone-600">
              <div className="flex items-center gap-3">
                <span>Wall: <strong className="text-stone-900">{wallColor}</strong></span>
                <span>·</span>
                <span>Floor: <strong className="text-stone-900">{floorType}</strong></span>
                <span>·</span>
                <span>Lighting: <strong className="text-stone-900">{lighting.brightness}%</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(true)}
                className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Design</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Design Modal */}
      <SaveDesignModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSaveSuccess={handleSaveSuccess}
        defaultDesignName={initialDesign?.designName}
        roomName={roomName}
        roomType={roomType}
        roomSize={roomSize}
        wallColor={wallColor}
        floorType={floorType}
        furniture={furniture}
        decorations={decorations}
        lighting={lighting}
        existingId={initialDesign?.id}
      />

      {/* Clear Room Confirmation Modal */}
      <ConfirmationModal
        isOpen={isClearModalOpen}
        title="Clear Room"
        message="Are you sure you want to remove all furniture and decorations from the room? This will reset all placed items."
        confirmLabel="Clear Room"
        isDestructive
        onConfirm={handleClearRoom}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </div>
  );
};
