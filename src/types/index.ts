export type RoomType = 'Bedroom' | 'Living Room' | 'Workspace' | 'Dining Room';
export type RoomSize = 'Small' | 'Medium' | 'Large';

export type WallColorName = 'White' | 'Beige' | 'Light Grey' | 'Blue' | 'Green' | 'Pink';

export interface WallColorOption {
  name: WallColorName;
  hex: string;
  tailwindClass?: string;
}

export type FloorType = 'Wooden' | 'Marble' | 'Tile' | 'Carpet';

export type FurnitureCategory =
  | 'Sofa'
  | 'Bed'
  | 'Chair'
  | 'Table'
  | 'Desk'
  | 'Wardrobe'
  | 'Bookshelf'
  | 'Nightstand'
  | 'TV Stand'
  | 'Bench'
  | 'Ottoman'
  | 'Poufs';
export type DecorationCategory = 'Plant' | 'Lamp' | 'Mirror' | 'Rug' | 'Wall Art' | 'Clock';

export type LightType = 'Ceiling Light' | 'Floor Lamp' | 'Table Lamp';
export type LightColor = 'Warm' | 'Neutral' | 'Cool';

export interface Lighting {
  type: LightType;
  color: LightColor;
  brightness: number; // 0 to 100
}

export interface Furniture {
  id: string;
  catalogId?: string;
  name: string;
  type: FurnitureCategory | string;
  color: string;
  position: { x: number; y: number };
}

export interface Decoration {
  id: string;
  catalogId?: string;
  name: string;
  type: DecorationCategory | string;
  color: string;
  position: { x: number; y: number };
}

export interface Design {
  id: string;
  designName: string;
  roomName: string;
  roomType: RoomType;
  roomSize: RoomSize;
  wallColor: WallColorName;
  floorType: FloorType;
  furniture: Furniture[];
  decorations: Decoration[];
  lighting: Lighting;
  preview?: string;
  createdAt: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  category: FurnitureCategory | DecorationCategory;
  kind: 'furniture' | 'decoration';
  defaultColor: string;
  availableColors: { name: string; hex: string }[];
  defaultPosition: { x: number; y: number };
  width: number;
  height: number;
  description?: string;
}

export interface InspirationItem {
  id: string;
  designName: string;
  roomType: RoomType;
  style: 'Minimal' | 'Cozy' | 'Modern' | 'Classic';
  colorTheme: string;
  imageUrl: string;
  description: string;
  config: {
    roomName: string;
    roomType: RoomType;
    roomSize: RoomSize;
    wallColor: WallColorName;
    floorType: FloorType;
    furniture: Array<Omit<Furniture, 'id'> & { id?: string }>;
    decorations: Array<Omit<Decoration, 'id'> & { id?: string }>;
    lighting: Lighting;
  };
}
