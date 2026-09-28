import React from 'react';
import { Lighting, LightType, LightColor } from '../types';
import { Sun, Lamp, Flame, Snowflake, Sparkles } from 'lucide-react';

interface LightingControlsProps {
  lighting: Lighting;
  onChange: (updated: Lighting) => void;
}

const LIGHT_TYPES: { id: LightType; label: string; desc: string }[] = [
  { id: 'Ceiling Light', label: 'Ceiling Light', desc: 'Center overhead pendant chandelier' },
  { id: 'Floor Lamp', label: 'Floor Lamp', desc: 'Sweeping architectural arc floor glow' },
  { id: 'Table Lamp', label: 'Table Lamp', desc: 'Cozy ceramic ambient side illumination' },
];

const LIGHT_COLORS: { id: LightColor; label: string; icon: React.ReactNode; colorHex: string; desc: string }[] = [
  {
    id: 'Warm',
    label: 'Warm Glow',
    icon: <Flame className="w-3.5 h-3.5 text-amber-500" />,
    colorHex: '#F59E0B',
    desc: 'Golden amber 2700K',
  },
  {
    id: 'Neutral',
    label: 'Neutral Daylight',
    icon: <Sparkles className="w-3.5 h-3.5 text-stone-500" />,
    colorHex: '#E2E8F0',
    desc: 'Balanced natural 4000K',
  },
  {
    id: 'Cool',
    label: 'Cool Crisp',
    icon: <Snowflake className="w-3.5 h-3.5 text-blue-400" />,
    colorHex: '#60A5FA',
    desc: 'Refreshing ice 6000K',
  },
];

export const LightingControls: React.FC<LightingControlsProps> = ({ lighting, onChange }) => {
  const handleTypeChange = (type: LightType) => {
    onChange({ ...lighting, type });
  };

  const handleColorChange = (color: LightColor) => {
    onChange({ ...lighting, color });
  };

  const handleBrightnessChange = (val: number) => {
    // Keep strictly between 0 and 100
    const clamped = Math.min(Math.max(val, 0), 100);
    onChange({ ...lighting, brightness: clamped });
  };

  return (
    <div className="space-y-4">
      {/* Light Type */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
          Light Fixture Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {LIGHT_TYPES.map((lt) => {
            const isSelected = lighting.type === lt.id;
            return (
              <button
                key={lt.id}
                type="button"
                onClick={() => handleTypeChange(lt.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-stone-900 bg-stone-100 font-semibold text-stone-900 ring-1 ring-stone-900/10 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Lamp className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-600' : 'text-stone-400'}`} />
                  <span className="text-xs">{lt.label}</span>
                </div>
                <p className="text-[10px] text-stone-500 mt-1 line-clamp-1">{lt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Light Color warmth */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
          Light Color Temperature
        </label>
        <div className="grid grid-cols-3 gap-2">
          {LIGHT_COLORS.map((lc) => {
            const isSelected = lighting.color === lc.id;
            return (
              <button
                key={lc.id}
                type="button"
                onClick={() => handleColorChange(lc.id)}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                  isSelected
                    ? 'border-stone-900 bg-stone-50 font-semibold text-stone-900 ring-1 ring-stone-900/10 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                }`}
              >
                <div className="flex items-center gap-1">
                  {lc.icon}
                  <span className="text-xs">{lc.label.split(' ')[0]}</span>
                </div>
                <div
                  className="w-full h-1.5 rounded-full"
                  style={{ backgroundColor: lc.colorHex }}
                />
                <span className="text-[10px] text-stone-500">{lc.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brightness Slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="brightness-slider" className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            Brightness Slider
          </label>
          <span className="text-xs font-mono font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
            {lighting.brightness}%
          </span>
        </div>

        <input
          id="brightness-slider"
          type="range"
          min="0"
          max="100"
          value={lighting.brightness}
          onChange={(e) => handleBrightnessChange(Number(e.target.value))}
          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900 focus:outline-none"
        />

        <div className="flex justify-between text-[10px] text-stone-400 mt-1">
          <span>0% (Night / Ambient)</span>
          <span>50% (Soft Evening)</span>
          <span>100% (Full Daylight)</span>
        </div>
      </div>
    </div>
  );
};
