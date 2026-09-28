import React, { useState } from 'react';
import { RoomType, RoomSize, WallColorName, FloorType } from '../types';
import { WALL_COLORS, FLOOR_OPTIONS } from '../data/catalog';
import { Check } from 'lucide-react';

interface RoomDetailsFormProps {
  roomName: string;
  roomType: RoomType;
  roomSize: RoomSize;
  wallColor: WallColorName;
  floorType: FloorType;
  onUpdate: (data: {
    roomName: string;
    roomType: RoomType;
    roomSize: RoomSize;
    wallColor: WallColorName;
    floorType: FloorType;
  }) => void;
  isInitialSetup?: boolean;
  onCompleteInitialSetup?: () => void;
}

export const RoomDetailsForm: React.FC<RoomDetailsFormProps> = ({
  roomName,
  roomType,
  roomSize,
  wallColor,
  floorType,
  onUpdate,
  isInitialSetup = false,
  onCompleteInitialSetup,
}) => {
  const [name, setName] = useState(roomName);
  const [type, setType] = useState<RoomType>(roomType);
  const [size, setSize] = useState<RoomSize>(roomSize);
  const [wall, setWall] = useState<WallColorName>(wallColor);
  const [floor, setFloor] = useState<FloorType>(floorType);

  const [errors, setErrors] = useState<{ roomName?: string; roomType?: string; roomSize?: string }>({});

  const validate = () => {
    const newErrors: { roomName?: string; roomType?: string; roomSize?: string } = {};
    if (!name.trim()) {
      newErrors.roomName = 'Room name cannot be empty.';
    }
    if (!type) {
      newErrors.roomType = 'Room type must be selected.';
    }
    if (!size) {
      newErrors.roomSize = 'Room size must be selected.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onUpdate({
      roomName: name.trim(),
      roomType: type,
      roomSize: size,
      wallColor: wall,
      floorType: floor,
    });

    if (onCompleteInitialSetup) {
      onCompleteInitialSetup();
    }
  };

  const handleFieldChange = (field: 'wall' | 'floor', val: any) => {
    if (field === 'wall') {
      setWall(val);
      onUpdate({ roomName: name, roomType: type, roomSize: size, wallColor: val, floorType: floor });
    } else if (field === 'floor') {
      setFloor(val);
      onUpdate({ roomName: name, roomType: type, roomSize: size, wallColor: wall, floorType: val });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Room Name */}
      <div>
        <label htmlFor="roomName" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
          Room Name <span className="text-red-500">*</span>
        </label>
        <input
          id="roomName"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.roomName) setErrors({ ...errors, roomName: undefined });
            if (!isInitialSetup) {
              onUpdate({ roomName: e.target.value, roomType: type, roomSize: size, wallColor: wall, floorType: floor });
            }
          }}
          placeholder="e.g. Master Sanctuary, Sunlit Studio"
          className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 transition ${
            errors.roomName ? 'border-red-400 focus:ring-red-200' : 'border-stone-300 focus:ring-amber-500/20 focus:border-amber-700'
          }`}
        />
        {errors.roomName && <p className="text-xs text-red-600 mt-1 font-medium">{errors.roomName}</p>}
      </div>

      {/* Room Type & Room Size Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="roomType" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Room Type <span className="text-red-500">*</span>
          </label>
          <select
            id="roomType"
            value={type}
            onChange={(e) => {
              const val = e.target.value as RoomType;
              setType(val);
              if (errors.roomType) setErrors({ ...errors, roomType: undefined });
              if (!isInitialSetup) {
                onUpdate({ roomName: name, roomType: val, roomSize: size, wallColor: wall, floorType: floor });
              }
            }}
            className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700"
          >
            <option value="Bedroom">Bedroom</option>
            <option value="Living Room">Living Room</option>
            <option value="Workspace">Workspace</option>
            <option value="Dining Room">Dining Room</option>
          </select>
          {errors.roomType && <p className="text-xs text-red-600 mt-1">{errors.roomType}</p>}
        </div>

        <div>
          <label htmlFor="roomSize" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Room Size <span className="text-red-500">*</span>
          </label>
          <select
            id="roomSize"
            value={size}
            onChange={(e) => {
              const val = e.target.value as RoomSize;
              setSize(val);
              if (errors.roomSize) setErrors({ ...errors, roomSize: undefined });
              if (!isInitialSetup) {
                onUpdate({ roomName: name, roomType: type, roomSize: val, wallColor: wall, floorType: floor });
              }
            }}
            className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700"
          >
            <option value="Small">Small (Compact)</option>
            <option value="Medium">Medium (Standard)</option>
            <option value="Large">Large (Spacious)</option>
          </select>
          {errors.roomSize && <p className="text-xs text-red-600 mt-1">{errors.roomSize}</p>}
        </div>
      </div>

      {/* Wall Color Selection */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
          Wall Color: <span className="font-bold text-stone-900 normal-case">{wall}</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {WALL_COLORS.map((color) => {
            const isSelected = wall === color.name;
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => handleFieldChange('wall', color.name)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-stone-900 ring-2 ring-stone-900/10 shadow-sm bg-stone-50'
                    : 'border-stone-200 hover:border-stone-400 bg-white'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full border border-stone-300 shadow-inner flex items-center justify-center relative"
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-stone-800 drop-shadow" />}
                </div>
                <span className="text-[11px] font-medium text-stone-700 truncate w-full text-center">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floor Type Selection */}
      <div>
        <label htmlFor="floorType" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
          Floor Type: <span className="font-bold text-stone-900 normal-case">{floor}</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FLOOR_OPTIONS.map((item) => {
            const isSelected = floor === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleFieldChange('floor', item.id)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-stone-900 bg-stone-100 font-semibold text-stone-900 ring-1 ring-stone-900/10 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                }`}
              >
                <div className="text-xs">{item.name.replace(' Flooring', '')}</div>
                <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{item.id}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      {isInitialSetup && (
        <button
          type="submit"
          className="w-full mt-2 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-stone-100 font-medium text-sm rounded-xl shadow transition duration-150 flex items-center justify-center gap-2"
        >
          <span>Create Room</span>
          <span aria-hidden="true">→</span>
        </button>
      )}
    </form>
  );
};
