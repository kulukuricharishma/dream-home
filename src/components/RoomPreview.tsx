import React, { useState, useRef } from 'react';
import { Furniture, Decoration, Lighting, WallColorName, FloorType, RoomSize } from '../types';
import { WALL_COLORS } from '../data/catalog';
import { ItemGraphic } from './ItemGraphic';
import { Trash2, Move, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface RoomPreviewProps {
  wallColor: WallColorName;
  floorType: FloorType;
  roomSize: RoomSize;
  furniture: Furniture[];
  decorations: Decoration[];
  lighting: Lighting;
  onRemoveItem?: (id: string, kind: 'furniture' | 'decoration') => void;
  onUpdatePosition?: (id: string, kind: 'furniture' | 'decoration', pos: { x: number; y: number }) => void;
  isInteractive?: boolean;
  className?: string;
}

export const RoomPreview: React.FC<RoomPreviewProps> = ({
  wallColor,
  floorType,
  roomSize,
  furniture,
  decorations,
  lighting,
  onRemoveItem,
  onUpdatePosition,
  isInteractive = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedKind, setSelectedKind] = useState<'furniture' | 'decoration' | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Get wall hex color
  const wallHex = WALL_COLORS.find((w) => w.name === wallColor)?.hex || '#EADBCE';

  // Room size factors
  const sizeScale = roomSize === 'Small' ? 0.95 : roomSize === 'Large' ? 1.05 : 1.0;

  // Handle selecting an item
  const handleSelectItem = (id: string, kind: 'furniture' | 'decoration', e: React.MouseEvent) => {
    if (!isInteractive) return;
    e.stopPropagation();
    setSelectedItemId(id);
    setSelectedKind(kind);
  };

  // Dragging logic
  const handleMouseDown = (id: string, kind: 'furniture' | 'decoration', e: React.MouseEvent) => {
    if (!isInteractive || !onUpdatePosition) return;
    e.stopPropagation();
    setSelectedItemId(id);
    setSelectedKind(kind);
    setIsDragging(true);

    const container = containerRef.current;
    if (!container) return;

    const startRect = container.getBoundingClientRect();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const xPercent = Math.min(Math.max(((moveEvent.clientX - startRect.left) / startRect.width) * 100, 10), 90);
      const yPercent = Math.min(Math.max(((moveEvent.clientY - startRect.top) / startRect.height) * 100, 15), 88);
      onUpdatePosition(id, kind, { x: Math.round(xPercent), y: Math.round(yPercent) });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Nudge selected item position
  const nudgeSelected = (dx: number, dy: number) => {
    if (!selectedItemId || !selectedKind || !onUpdatePosition) return;
    const item =
      selectedKind === 'furniture'
        ? furniture.find((f) => f.id === selectedItemId)
        : decorations.find((d) => d.id === selectedItemId);
    if (!item) return;

    const newX = Math.min(Math.max(item.position.x + dx, 5), 95);
    const newY = Math.min(Math.max(item.position.y + dy, 15), 88);
    onUpdatePosition(selectedItemId, selectedKind, { x: newX, y: newY });
  };

  // Determine light tint color
  const getLightingHue = () => {
    switch (lighting.color) {
      case 'Warm':
        return {
          glow: 'rgba(251, 191, 36, 0.4)',
          beam: 'rgba(251, 191, 36, 0.18)',
          ambient: 'rgba(254, 243, 199, 0.12)',
          colorName: '#F59E0B',
        };
      case 'Cool':
        return {
          glow: 'rgba(147, 197, 253, 0.35)',
          beam: 'rgba(191, 219, 254, 0.16)',
          ambient: 'rgba(239, 246, 255, 0.12)',
          colorName: '#60A5FA',
        };
      case 'Neutral':
      default:
        return {
          glow: 'rgba(255, 255, 255, 0.45)',
          beam: 'rgba(255, 255, 255, 0.18)',
          ambient: 'rgba(255, 255, 255, 0.1)',
          colorName: '#E2E8F0',
        };
    }
  };

  const lightTheme = getLightingHue();
  // Darkness overlay opacity (0% brightness => heavy dusk darkness ~0.65; 100% brightness => 0 darkness)
  const darknessOpacity = Math.max(0, (100 - lighting.brightness) / 100) * 0.72;
  // Lamp beam intensity multiplier
  const beamOpacity = (lighting.brightness / 100) * 0.85;

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Canvas container with room frame */}
      <div
        ref={containerRef}
        onClick={() => {
          setSelectedItemId(null);
          setSelectedKind(null);
        }}
        className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-w-3xl overflow-hidden rounded-2xl border border-stone-200 shadow-xl bg-stone-900 transition-all duration-300"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
        }}
      >
        {/* BACK WALL */}
        <div
          className="absolute inset-0 bottom-[36%] transition-colors duration-500 ease-in-out"
          style={{ backgroundColor: wallHex }}
        >
          {/* Subtle Wall Ambient Vignette & Shadow gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/10 via-transparent to-stone-900/15" />
          
          {/* Top Crown Molding Trim */}
          <div className="absolute top-0 inset-x-0 h-4 bg-white/70 border-b border-stone-300/60 shadow-sm flex items-center px-4">
            <div className="w-full h-0.5 bg-stone-300/40" />
          </div>

          {/* Wall Corners for depth */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-stone-900/15 to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-stone-900/15 to-transparent pointer-events-none" />

          {/* Sunlit Architectural Window */}
          <div className="absolute top-10 right-10 sm:right-16 w-24 sm:w-36 h-36 sm:h-48 rounded-t-full border-4 border-stone-100/90 shadow-md overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 pointer-events-none">
            {/* Outdoor horizon & clouds */}
            <div className="absolute bottom-6 inset-x-0 h-10 bg-emerald-700/20 rounded-t-full filter blur-[1px]" />
            <div className="absolute top-6 left-4 w-12 h-6 bg-white/70 rounded-full filter blur-[2px]" />
            {/* Window mullion grid */}
            <div className="absolute inset-x-0 top-1/2 h-1 bg-stone-100/90" />
            <div className="absolute inset-y-0 left-1/2 w-1 bg-stone-100/90" />
            {/* Window Sill */}
            <div className="absolute bottom-0 inset-x-0 h-3 bg-stone-200 border-t border-stone-300 shadow-sm" />
            {/* Sheer curtain drape left & right */}
            <div className="absolute top-0 bottom-0 left-0 w-4 bg-white/40 backdrop-blur-[1px]" />
            <div className="absolute top-0 bottom-0 right-0 w-4 bg-white/40 backdrop-blur-[1px]" />
          </div>

          {/* Baseboard Trim molding */}
          <div className="absolute bottom-0 inset-x-0 h-5 bg-white border-t border-stone-200/90 shadow-sm flex flex-col justify-between py-0.5">
            <div className="h-0.5 bg-stone-200/60" />
            <div className="h-1 bg-stone-300/40" />
          </div>
        </div>

        {/* FLOOR */}
        <div className="absolute inset-x-0 bottom-0 h-[36%] overflow-hidden transition-all duration-300">
          {/* Wooden Flooring */}
          {floorType === 'Wooden' && (
            <div className="absolute inset-0 bg-[#C89B6A]">
              {/* Floorboard planks perspective simulation */}
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(74, 44, 23, 0.22) 40px, rgba(74, 44, 23, 0.22) 42px),
                    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08) 2px, transparent 2px, transparent 16px)
                  `,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-stone-900/10 pointer-events-none" />
            </div>
          )}

          {/* Marble Flooring */}
          {floorType === 'Marble' && (
            <div className="absolute inset-0 bg-[#E8EAE6]">
              {/* Subtle Marble veining */}
              <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 30 Q 120 70 250 20 T 550 80 T 800 30" stroke="#717A84" strokeWidth="1.5" fill="none" />
                <path d="M 100 120 Q 300 40 500 110 T 800 70" stroke="#8A929A" strokeWidth="1" fill="none" />
                <path d="M 20 90 Q 200 110 400 30 T 700 100" stroke="#A0A7AE" strokeWidth="0.8" fill="none" />
              </svg>
              {/* Gloss sheen highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-stone-900/10 pointer-events-none" />
            </div>
          )}

          {/* Tile Flooring */}
          {floorType === 'Tile' && (
            <div className="absolute inset-0 bg-[#D4D9DE]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(90, 100, 110, 0.3) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(90, 100, 110, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '48px 28px',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/25 via-transparent to-stone-900/10 pointer-events-none" />
            </div>
          )}

          {/* Carpet Flooring */}
          {floorType === 'Carpet' && (
            <div className="absolute inset-0 bg-[#D1C7BA]">
              {/* Cozy woven stipple texture */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `radial-gradient(circle, #8A7B69 1px, transparent 1px)`,
                  backgroundSize: '8px 8px',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/35 via-stone-800/10 to-stone-900/10 pointer-events-none" />
            </div>
          )}

          {/* Floor Reflection of Wall Base */}
          <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-stone-900/25 to-transparent pointer-events-none" />
        </div>

        {/* LIGHTING FIXTURE LAYER */}
        {/* Ceiling Light Fixture */}
        {lighting.type === 'Ceiling Light' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
            {/* Cord */}
            <div className="w-0.5 h-8 sm:h-12 bg-stone-800" />
            {/* Canopy & Pendant Shade */}
            <div className="w-14 sm:w-20 h-6 sm:h-8 rounded-b-full bg-stone-800 shadow-md relative flex items-center justify-center">
              {/* Light bulb */}
              <div
                className="w-4 h-4 rounded-full -bottom-1 absolute transition-all duration-300"
                style={{
                  backgroundColor: lightTheme.colorName,
                  boxShadow: `0 0 ${16 * (lighting.brightness / 100)}px ${8 * (lighting.brightness / 100)}px ${lightTheme.glow}`,
                }}
              />
            </div>
            {/* Conic light beam shining down */}
            <div
              className="w-72 sm:w-[480px] h-96 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: beamOpacity,
                background: `radial-gradient(ellipse at top, ${lightTheme.beam} 0%, rgba(255,255,255,0.02) 65%, transparent 80%)`,
              }}
            />
          </div>
        )}

        {/* Floor Lamp Fixture Glow (Ambient on right corner) */}
        {lighting.type === 'Floor Lamp' && (
          <div
            className="absolute top-1/4 right-12 w-64 h-64 rounded-full pointer-events-none transition-opacity duration-300 filter blur-2xl"
            style={{
              opacity: beamOpacity * 0.9,
              background: `radial-gradient(circle, ${lightTheme.glow} 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Table Lamp Glow */}
        {lighting.type === 'Table Lamp' && (
          <div
            className="absolute top-1/2 left-28 w-56 h-56 rounded-full pointer-events-none transition-opacity duration-300 filter blur-xl"
            style={{
              opacity: beamOpacity * 0.85,
              background: `radial-gradient(circle, ${lightTheme.glow} 0%, transparent 65%)`,
            }}
          />
        )}

        {/* ITEMS RENDERING (Rug Layer first, then Wall items, then Furniture & Floor Decors) */}
        {/* 1. Rugs (always lie flat on floor) */}
        {decorations
          .filter((d) => d.type.toLowerCase() === 'rug')
          .map((rug) => {
            const isSelected = selectedItemId === rug.id;
            return (
              <div
                key={rug.id}
                onClick={(e) => handleSelectItem(rug.id, 'decoration', e)}
                onMouseDown={(e) => handleMouseDown(rug.id, 'decoration', e)}
                className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-transform ${
                  isSelected ? 'ring-2 ring-amber-500 rounded-xl' : 'hover:scale-[1.01]'
                }`}
                style={{
                  left: `${rug.position.x}%`,
                  top: `${rug.position.y}%`,
                  width: `${210 * sizeScale}px`,
                }}
              >
                <ItemGraphic type="rug" name={rug.name} color={rug.color} />
              </div>
            );
          })}

        {/* 2. Wall Mounted Items (Mirror, Wall Art, Clock) */}
        {decorations
          .filter((d) => ['mirror', 'wall art', 'clock'].includes(d.type.toLowerCase()))
          .map((item) => {
            const isSelected = selectedItemId === item.id;
            const width =
              item.type.toLowerCase() === 'wall art'
                ? 64 * sizeScale
                : item.type.toLowerCase() === 'mirror'
                ? 68 * sizeScale
                : 46 * sizeScale;

            return (
              <div
                key={item.id}
                onClick={(e) => handleSelectItem(item.id, 'decoration', e)}
                onMouseDown={(e) => handleMouseDown(item.id, 'decoration', e)}
                className={`absolute z-12 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-transform ${
                  isSelected ? 'ring-2 ring-amber-500 rounded-lg p-0.5' : 'hover:scale-105'
                }`}
                style={{
                  left: `${item.position.x}%`,
                  top: `${Math.min(item.position.y, 50)}%`, // Keep on wall
                  width: `${width}px`,
                }}
              >
                <ItemGraphic type={item.type} name={item.name} color={item.color} />
              </div>
            );
          })}

        {/* 3. Furniture Items */}
        {furniture.map((item) => {
          const isSelected = selectedItemId === item.id;
          let width = 160;
          const normType = item.type.toLowerCase();
          if (normType === 'sofa') width = item.name.toLowerCase().includes('sectional') ? 220 : item.name.toLowerCase().includes('loveseat') ? 160 : 190;
          if (normType === 'bed') width = 205;
          if (normType === 'chair') width = 85;
          if (normType === 'table') width = item.name.toLowerCase().includes('coffee') ? 115 : 155;
          if (normType === 'desk') width = 145;
          if (normType === 'wardrobe') width = item.name.toLowerCase().includes('open') ? 115 : 100;
          if (normType === 'bookshelf') width = item.name.toLowerCase().includes('arch') ? 95 : 115;
          if (normType === 'nightstand') width = 60;
          if (normType === 'tv stand' || normType === 'tvstand') width = 165;
          if (normType === 'bench') width = 135;
          if (normType === 'ottoman') width = item.name.toLowerCase().includes('round') ? 85 : 105;
          if (normType === 'poufs' || normType === 'pouf') width = 68;

          const scaledWidth = width * sizeScale;

          return (
            <div
              key={item.id}
              onClick={(e) => handleSelectItem(item.id, 'furniture', e)}
              onMouseDown={(e) => handleMouseDown(item.id, 'furniture', e)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-transform group ${
                isSelected ? 'ring-2 ring-amber-600 rounded-xl' : 'hover:scale-[1.02]'
              }`}
              style={{
                left: `${item.position.x}%`,
                top: `${item.position.y}%`,
                width: `${scaledWidth}px`,
                zIndex: Math.round(15 + item.position.y),
              }}
            >
              <ItemGraphic type={item.type} name={item.name} color={item.color} />

              {/* Item Hover / Selected Label */}
              {isInteractive && (
                <div
                  className={`absolute -top-7 left-1/2 -translate-x-1/2 bg-stone-900/90 text-stone-100 text-[11px] font-medium px-2 py-0.5 rounded shadow pointer-events-none transition-opacity whitespace-nowrap ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {item.name}
                </div>
              )}
            </div>
          );
        })}

        {/* 4. Floor Decorations (Plants, Lamps) */}
        {decorations
          .filter((d) => ['plant', 'lamp'].includes(d.type.toLowerCase()))
          .map((item) => {
            const isSelected = selectedItemId === item.id;
            const normType = item.type.toLowerCase();
            const width = normType === 'lamp' ? 75 * sizeScale : 70 * sizeScale;

            return (
              <div
                key={item.id}
                onClick={(e) => handleSelectItem(item.id, 'decoration', e)}
                onMouseDown={(e) => handleMouseDown(item.id, 'decoration', e)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-transform group ${
                  isSelected ? 'ring-2 ring-amber-600 rounded-xl' : 'hover:scale-105'
                }`}
                style={{
                  left: `${item.position.x}%`,
                  top: `${item.position.y}%`,
                  width: `${width}px`,
                  zIndex: Math.round(15 + item.position.y),
                }}
              >
                <ItemGraphic type={item.type} name={item.name} color={item.color} />

                {isInteractive && (
                  <div
                    className={`absolute -top-7 left-1/2 -translate-x-1/2 bg-stone-900/90 text-stone-100 text-[11px] font-medium px-2 py-0.5 rounded shadow pointer-events-none transition-opacity whitespace-nowrap ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}

        {/* DYNAMIC LIGHTING / DARKNESS AMBIENCE OVERLAY */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            backgroundColor: '#0F172A',
            opacity: darknessOpacity,
          }}
        />

        {/* AMBIENT LIGHT WASH (COLOR WARMTH) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen"
          style={{
            backgroundColor: lightTheme.ambient,
            opacity: lighting.brightness / 100,
          }}
        />

        {/* Empty state hint inside room if nothing placed */}
        {furniture.length === 0 && decorations.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-stone-200/80 shadow-sm text-center max-w-xs">
              <p className="text-xs font-semibold text-stone-800">Your room canvas is ready</p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Add furniture & decorations from the left panel to begin styling.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ITEM CONTROLS BAR (Active when an item is selected in interactive mode) */}
      {isInteractive && selectedItemId && selectedKind && (
        <div className="mt-3 flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm text-xs text-stone-700 animate-in fade-in slide-in-from-top-1">
          <span className="font-medium text-stone-900 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-amber-700" />
            Position item:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => nudgeSelected(-4, 0)}
              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-semibold"
              title="Move Left"
            >
              ←
            </button>
            <button
              onClick={() => nudgeSelected(4, 0)}
              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-semibold"
              title="Move Right"
            >
              →
            </button>
            <button
              onClick={() => nudgeSelected(0, -4)}
              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-semibold"
              title="Move Up"
            >
              ↑
            </button>
            <button
              onClick={() => nudgeSelected(0, 4)}
              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-semibold"
              title="Move Down"
            >
              ↓
            </button>
          </div>
          <span className="text-stone-300">|</span>
          <button
            onClick={() => {
              if (onRemoveItem) onRemoveItem(selectedItemId, selectedKind);
              setSelectedItemId(null);
              setSelectedKind(null);
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-red-700 hover:bg-red-50 rounded transition-colors font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      )}

      {/* Zoom / View controls */}
      {isInteractive && (
        <div className="mt-2 flex items-center justify-between w-full max-w-3xl px-1 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            Live 2D Room Preview · Drag or click items to move
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.05))}
              className="p-1 hover:text-stone-900 rounded"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.2, z + 0.05))}
              className="p-1 hover:text-stone-900 rounded"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 1 && (
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 hover:text-stone-900 rounded ml-1"
                title="Reset zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
