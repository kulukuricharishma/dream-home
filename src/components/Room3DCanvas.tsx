import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Furniture, Decoration, Lighting, WallColorName, FloorType, RoomSize } from '../types';
import { WALL_COLORS } from '../data/catalog';
import { create3DItemMesh } from '../utils/threeItemBuilder';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Sun,
  Eye,
  Camera,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Room3DCanvasProps {
  wallColor: WallColorName;
  floorType: FloorType;
  roomSize: RoomSize;
  furniture: Furniture[];
  decorations: Decoration[];
  lighting: Lighting;
  onSelectItem?: (id: string, kind: 'furniture' | 'decoration') => void;
  selectedItemId?: string | null;
  className?: string;
  isInteractive?: boolean;
}

export const Room3DCanvas: React.FC<Room3DCanvasProps> = ({
  wallColor,
  floorType,
  roomSize,
  furniture,
  decorations,
  lighting,
  onSelectItem,
  selectedItemId,
  className = '',
  isInteractive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [cameraPreset, setCameraPreset] = useState<'isometric' | 'front' | 'top' | 'corner'>('isometric');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const itemsGroupRef = useRef<THREE.Group | null>(null);
  const roomShellGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const ceilingLightFixtureRef = useRef<THREE.Group | null>(null);
  const requestAnimationIdRef = useRef<number | null>(null);

  // Orbit navigation variables
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const sphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 9.0,
    theta: Math.PI / 4,
    phi: Math.PI / 3.4,
  });

  // Convert room size to room dimensions in 3D units
  const roomDim = roomSize === 'Small' ? { w: 5.5, d: 5.5, h: 3.2 } : roomSize === 'Large' ? { w: 7.5, d: 7.5, h: 3.4 } : { w: 6.5, d: 6.5, h: 3.2 };

  // Wall color hex
  const wallHex = WALL_COLORS.find((w) => w.name === wallColor)?.hex || '#EADBCE';

  // 1. Initial Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x18181b); // Dark sleek backdrop for contrast
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Groups
    const roomShell = new THREE.Group();
    scene.add(roomShell);
    roomShellGroupRef.current = roomShell;

    const itemsGroup = new THREE.Group();
    scene.add(itemsGroup);
    itemsGroupRef.current = itemsGroup;

    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // Render loop
    const animate = () => {
      if (autoRotate && !isDraggingRef.current) {
        sphericalRef.current.theta += 0.005;
        updateCameraPosition();
      }
      renderer.render(scene, camera);
      requestAnimationIdRef.current = requestAnimationFrame(animate);
    };
    requestAnimationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestAnimationIdRef.current) {
        cancelAnimationFrame(requestAnimationIdRef.current);
      }
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update camera position from spherical coords
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = sphericalRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, Math.max(y, 1.2), z);
    cameraRef.current.lookAt(0, 1.2, 0);
  };

  // Switch camera angle presets
  const handlePresetChange = (preset: 'isometric' | 'front' | 'top' | 'corner') => {
    setCameraPreset(preset);
    if (preset === 'isometric') {
      sphericalRef.current = { radius: 9.0, theta: Math.PI / 4, phi: Math.PI / 3.4 };
    } else if (preset === 'front') {
      sphericalRef.current = { radius: 8.5, theta: 0.01, phi: Math.PI / 2.3 };
    } else if (preset === 'top') {
      sphericalRef.current = { radius: 9.5, theta: 0.01, phi: 0.15 };
    } else if (preset === 'corner') {
      sphericalRef.current = { radius: 8.8, theta: Math.PI / 2.2, phi: Math.PI / 3.2 };
    }
    updateCameraPosition();
  };

  // 2. Build / Update 3D Room Shell (Walls, Flooring, Window, Molding)
  useEffect(() => {
    const roomShell = roomShellGroupRef.current;
    if (!roomShell) return;

    // Clear previous shell meshes
    while (roomShell.children.length > 0) {
      const obj = roomShell.children[0];
      roomShell.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    }

    const { w, d, h } = roomDim;
    const wallCol = new THREE.Color(wallHex).getHex();

    // Wall Material
    const wallMat = new THREE.MeshStandardMaterial({
      color: wallCol,
      roughness: 0.85,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    // Floor Material by FloorType
    let floorMat: THREE.MeshStandardMaterial;
    if (floorType === 'Wooden') {
      floorMat = new THREE.MeshStandardMaterial({
        color: 0xc89b6a,
        roughness: 0.45,
        metalness: 0.08,
      });
    } else if (floorType === 'Marble') {
      floorMat = new THREE.MeshStandardMaterial({
        color: 0xe8eae6,
        roughness: 0.18,
        metalness: 0.12,
      });
    } else if (floorType === 'Tile') {
      floorMat = new THREE.MeshStandardMaterial({
        color: 0xd4d9de,
        roughness: 0.35,
        metalness: 0.05,
      });
    } else {
      // Carpet
      floorMat = new THREE.MeshStandardMaterial({
        color: 0xd1c7ba,
        roughness: 0.95,
        metalness: 0.0,
      });
    }

    // Floor Mesh
    const floorGeo = new THREE.BoxGeometry(w, 0.1, d);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.05;
    floorMesh.receiveShadow = true;
    roomShell.add(floorMesh);

    // Subtle floor perimeter trim
    const trimGeo = new THREE.BoxGeometry(w + 0.1, 0.05, d + 0.1);
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.y = -0.08;
    roomShell.add(trimMesh);

    // Back Wall (at -d / 2)
    const backWallGeo = new THREE.BoxGeometry(w, h, 0.1);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, h / 2, -d / 2);
    backWall.receiveShadow = true;
    roomShell.add(backWall);

    // Left Wall (at -w / 2)
    const leftWallGeo = new THREE.BoxGeometry(0.1, h, d);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-w / 2, h / 2, 0);
    leftWall.receiveShadow = true;
    roomShell.add(leftWall);

    // Baseboard moldings (white trim)
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0xfdfdfd, roughness: 0.4 });
    const backBaseboard = new THREE.Mesh(new THREE.BoxGeometry(w, 0.14, 0.06), baseboardMat);
    backBaseboard.position.set(0, 0.07, -d / 2 + 0.05);
    roomShell.add(backBaseboard);

    const leftBaseboard = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, d), baseboardMat);
    leftBaseboard.position.set(-w / 2 + 0.05, 0.07, 0);
    roomShell.add(leftBaseboard);

    // Crown molding at top
    const crownMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const backCrown = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, 0.08), crownMat);
    backCrown.position.set(0, h - 0.05, -d / 2 + 0.06);
    roomShell.add(backCrown);

    const leftCrown = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, d), crownMat);
    leftCrown.position.set(-w / 2 + 0.06, h - 0.05, 0);
    roomShell.add(leftCrown);

    // Architectural Window on Left Wall
    const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const windowGlassMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.65,
    });

    const windowGroup = new THREE.Group();
    // Glass
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.6, 1.4), windowGlassMat);
    windowGroup.add(glass);
    // Frame
    const wFrame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.68, 1.48), windowFrameMat);
    windowGroup.add(wFrame);
    // Center divider
    const divider = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.6, 0.05), windowFrameMat);
    windowGroup.add(divider);

    windowGroup.position.set(-w / 2 + 0.04, 1.8, -0.4);
    roomShell.add(windowGroup);

    // Natural Sunlight through Window
    const sunLight = new THREE.DirectionalLight(0xfff5e6, 0.9);
    sunLight.position.set(-w / 2 - 4, 4, -0.4);
    sunLight.target.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.001;
    roomShell.add(sunLight);
    roomShell.add(sunLight.target);
  }, [wallColor, floorType, roomSize]);

  // 3. Update Dynamic Lighting
  useEffect(() => {
    const lightsGroup = lightsGroupRef.current;
    if (!lightsGroup) return;

    while (lightsGroup.children.length > 0) {
      lightsGroup.remove(lightsGroup.children[0]);
    }

    const { brightness, color: lightColorName, type: fixtureType } = lighting;
    const brightnessRatio = Math.max(0.1, brightness / 100);

    // Color tone
    let lightColorHex = 0xffffff;
    if (lightColorName === 'Warm') lightColorHex = 0xffe2b8;
    else if (lightColorName === 'Cool') lightColorHex = 0xd8eeff;
    else lightColorHex = 0xfcfcfc;

    // Ambient fill
    const ambientLight = new THREE.AmbientLight(lightColorHex, 0.45 * brightnessRatio);
    lightsGroup.add(ambientLight);

    // Main Room Fixture
    const { w, d, h } = roomDim;

    if (fixtureType === 'Ceiling Light') {
      const ceilingPoint = new THREE.PointLight(lightColorHex, 1.4 * brightnessRatio, 10, 1.2);
      ceilingPoint.position.set(0, h - 0.4, 0);
      ceilingPoint.castShadow = true;
      ceilingPoint.shadow.mapSize.width = 1024;
      ceilingPoint.shadow.mapSize.height = 1024;
      ceilingPoint.shadow.bias = -0.002;
      lightsGroup.add(ceilingPoint);

      // 3D Pendant ceiling fixture geometry
      const fixtureGroup = new THREE.Group();
      const cord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.6, 8),
        new THREE.MeshStandardMaterial({ color: 0x111111 })
      );
      cord.position.y = h - 0.3;
      fixtureGroup.add(cord);

      const shade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.28, 0.22, 24, 1, true),
        new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4 })
      );
      shade.position.y = h - 0.55;
      fixtureGroup.add(shade);

      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 16, 16),
        new THREE.MeshBasicMaterial({ color: lightColorHex })
      );
      bulb.position.y = h - 0.55;
      fixtureGroup.add(bulb);

      lightsGroup.add(fixtureGroup);
      ceilingLightFixtureRef.current = fixtureGroup;
    } else if (fixtureType === 'Floor Lamp') {
      const lampPoint = new THREE.PointLight(lightColorHex, 1.5 * brightnessRatio, 8, 1.4);
      lampPoint.position.set(w / 2 - 1.0, 1.6, -d / 2 + 1.2);
      lampPoint.castShadow = true;
      lightsGroup.add(lampPoint);
    } else {
      // Table Lamp
      const tablePoint = new THREE.PointLight(lightColorHex, 1.3 * brightnessRatio, 7, 1.5);
      tablePoint.position.set(-w / 2 + 1.2, 1.1, -d / 2 + 1.2);
      tablePoint.castShadow = true;
      lightsGroup.add(tablePoint);
    }
  }, [lighting, roomSize]);

  // 4. Place 3D Items (Furniture & Decorations)
  useEffect(() => {
    const itemsGroup = itemsGroupRef.current;
    if (!itemsGroup) return;

    // Clear previous items
    while (itemsGroup.children.length > 0) {
      itemsGroup.remove(itemsGroup.children[0]);
    }

    const { w, d, h } = roomDim;

    // Helper: convert 2D percentages (10% to 90%) into 3D coordinates
    // In 2D: x: 0% is left, 100% is right. y: 0% is top wall, 100% is bottom front.
    const mapPos = (pos: { x: number; y: number }) => {
      const x3D = ((pos.x - 50) / 100) * (w * 0.85);
      const z3D = ((pos.y - 50) / 100) * (d * 0.85);
      return { x: x3D, z: z3D };
    };

    // Render Furniture
    furniture.forEach((f) => {
      const meshGroup = create3DItemMesh(f.type, f.name, f.color);
      const { x, z } = mapPos(f.position);
      meshGroup.position.set(x, 0, z);
      meshGroup.userData = { id: f.id, kind: 'furniture', name: f.name };

      // Highlight if selected
      if (selectedItemId === f.id) {
        const bbox = new THREE.Box3().setFromObject(meshGroup);
        const size = bbox.getSize(new THREE.Vector3());
        const center = bbox.getCenter(new THREE.Vector3());
        const helperGeo = new THREE.BoxGeometry(size.x + 0.1, size.y + 0.05, size.z + 0.1);
        const helperMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          wireframe: true,
        });
        const boxMesh = new THREE.Mesh(helperGeo, helperMat);
        boxMesh.position.copy(center);
        meshGroup.add(boxMesh);
      }

      itemsGroup.add(meshGroup);
    });

    // Render Decorations
    decorations.forEach((dec) => {
      const meshGroup = create3DItemMesh(dec.type, dec.name, dec.color);
      const normType = dec.type.toLowerCase();

      if (['mirror', 'wall art', 'clock'].includes(normType)) {
        // Wall mounted item on back wall
        const x3D = ((dec.position.x - 50) / 100) * (w * 0.82);
        const y3D = 1.6 + ((50 - Math.min(dec.position.y, 50)) / 50) * 0.7;
        meshGroup.position.set(x3D, y3D, -d / 2 + 0.05);
      } else {
        // Floor items (rug, lamp, plant)
        const { x, z } = mapPos(dec.position);
        meshGroup.position.set(x, 0, z);
      }

      meshGroup.userData = { id: dec.id, kind: 'decoration', name: dec.name };

      if (selectedItemId === dec.id) {
        const bbox = new THREE.Box3().setFromObject(meshGroup);
        const size = bbox.getSize(new THREE.Vector3());
        const center = bbox.getCenter(new THREE.Vector3());
        const helperGeo = new THREE.BoxGeometry(size.x + 0.08, size.y + 0.05, size.z + 0.08);
        const helperMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          wireframe: true,
        });
        const boxMesh = new THREE.Mesh(helperGeo, helperMat);
        boxMesh.position.copy(center);
        meshGroup.add(boxMesh);
      }

      itemsGroup.add(meshGroup);
    });
  }, [furniture, decorations, selectedItemId, roomSize]);

  // 5. Interactive Mouse Orbit & Selection
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    sphericalRef.current.theta -= deltaX * 0.007;
    sphericalRef.current.phi = Math.max(
      0.15,
      Math.min(Math.PI / 2.05, sphericalRef.current.phi - deltaY * 0.007)
    );

    updateCameraPosition();
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    sphericalRef.current.radius = Math.max(
      4.5,
      Math.min(14, sphericalRef.current.radius + e.deltaY * 0.008)
    );
    updateCameraPosition();
  };

  // Click on 3D Object with Raycasting
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || !itemsGroupRef.current || !onSelectItem) return;

    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(itemsGroupRef.current.children, true);
    if (intersects.length > 0) {
      // Find top-level group inside itemsGroup
      let topObj: THREE.Object3D | null = intersects[0].object;
      while (topObj && topObj.parent !== itemsGroupRef.current) {
        topObj = topObj.parent;
      }
      if (topObj && topObj.userData?.id) {
        onSelectItem(topObj.userData.id, topObj.userData.kind);
      }
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        className={`relative w-full aspect-[4/3] sm:aspect-[16/11] max-w-3xl overflow-hidden rounded-2xl border border-stone-200 shadow-xl bg-stone-950 cursor-grab active:cursor-grabbing transition-all ${
          isFullscreen ? 'fixed inset-4 z-50 max-w-none aspect-auto' : ''
        }`}
      >
        {/* Floating 3D Badge & Instructions */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
          <span className="px-2.5 py-1 bg-stone-900/85 backdrop-blur-md text-stone-100 text-[11px] font-semibold rounded-lg border border-stone-700/60 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-400" />
            3D Interactive Room
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-black/40 text-stone-300 text-[10px] rounded-md backdrop-blur-xs">
            Drag to rotate · Scroll to zoom
          </span>
        </div>

        {/* View Camera Angles Toolbar */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-stone-900/85 backdrop-blur-md p-1 rounded-xl border border-stone-700/60 shadow-md">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePresetChange('isometric');
            }}
            className={`px-2 py-1 text-[11px] font-medium rounded-lg transition ${
              cameraPreset === 'isometric'
                ? 'bg-amber-600 text-white font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Isometric View"
          >
            Iso
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePresetChange('front');
            }}
            className={`px-2 py-1 text-[11px] font-medium rounded-lg transition ${
              cameraPreset === 'front'
                ? 'bg-amber-600 text-white font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Front Eye-level View"
          >
            Front
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePresetChange('corner');
            }}
            className={`px-2 py-1 text-[11px] font-medium rounded-lg transition ${
              cameraPreset === 'corner'
                ? 'bg-amber-600 text-white font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Corner Perspective"
          >
            Corner
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePresetChange('top');
            }}
            className={`px-2 py-1 text-[11px] font-medium rounded-lg transition ${
              cameraPreset === 'top'
                ? 'bg-amber-600 text-white font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Top Floor Plan"
          >
            Top
          </button>

          <span className="w-px h-4 bg-stone-700 mx-0.5" />

          {/* Auto rotate toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAutoRotate(!autoRotate);
            }}
            className={`p-1.5 rounded-lg transition ${
              autoRotate ? 'bg-amber-500/30 text-amber-300' : 'text-stone-400 hover:text-white'
            }`}
            title={autoRotate ? 'Stop auto-orbit' : 'Start auto-orbit'}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          {/* Fullscreen */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(!isFullscreen);
            }}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Empty state hint if no items in room */}
        {furniture.length === 0 && decorations.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-stone-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-stone-700/60 shadow-lg text-center max-w-xs text-stone-100">
              <p className="text-xs font-semibold">3D Room Ready</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Add furniture or decor items from the sidebar to see them appear in 3D.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Camera zoom / controls bar below canvas */}
      {isInteractive && (
        <div className="mt-2.5 flex items-center justify-between w-full max-w-3xl px-1 text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Interactive 3D View · Click any furniture to select it
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                sphericalRef.current.radius = Math.min(14, sphericalRef.current.radius + 1.0);
                updateCameraPosition();
              }}
              className="p-1 hover:text-stone-900 rounded"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono">
              {Math.round((9 / sphericalRef.current.radius) * 100)}%
            </span>
            <button
              onClick={() => {
                sphericalRef.current.radius = Math.max(4.5, sphericalRef.current.radius - 1.0);
                updateCameraPosition();
              }}
              className="p-1 hover:text-stone-900 rounded"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handlePresetChange('isometric')}
              className="p-1 hover:text-stone-900 rounded ml-1"
              title="Reset angle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
