/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Design, InspirationItem } from './types';
import { getSavedDesigns, saveDesign as persistDesign, deleteDesign as removeDesign } from './utils/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CreateRoomPage } from './pages/CreateRoomPage';
import { MyDesignsPage } from './pages/MyDesignsPage';
import { InspirationPage } from './pages/InspirationPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'create' | 'designs' | 'inspiration'>('home');
  const [savedDesigns, setSavedDesigns] = useState<Design[]>([]);
  // Design currently being edited or pre-populated from inspiration
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);

  // Load saved designs on mount
  useEffect(() => {
    const loaded = getSavedDesigns();
    setSavedDesigns(loaded);
  }, []);

  // Save or update design handler
  const handleSaveDesign = (design: Design) => {
    const ok = persistDesign(design);
    if (ok) {
      setSavedDesigns(getSavedDesigns());
    }
  };

  // Delete design handler
  const handleDeleteDesign = (id: string) => {
    const ok = removeDesign(id);
    if (ok) {
      setSavedDesigns(getSavedDesigns());
    }
  };

  // Start designing fresh room
  const handleStartFreshDesign = () => {
    setEditingDesign(null);
    setCurrentPage('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Edit existing design
  const handleEditDesign = (design: Design) => {
    setEditingDesign(design);
    setCurrentPage('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Use inspiration design configuration
  const handleUseInspiration = (item: InspirationItem) => {
    const freshDesignFromInspiration: Design = {
      id: `design-${Date.now()}`,
      designName: `${item.designName}`,
      roomName: item.config.roomName,
      roomType: item.config.roomType,
      roomSize: item.config.roomSize,
      wallColor: item.config.wallColor,
      floorType: item.config.floorType,
      furniture: item.config.furniture.map((f, i) => ({
        ...f,
        id: f.id || `inspire-f-${i}-${Date.now()}`,
      })),
      decorations: item.config.decorations.map((d, i) => ({
        ...d,
        id: d.id || `inspire-d-${i}-${Date.now()}`,
      })),
      lighting: { ...item.config.lighting },
      createdAt: new Date().toISOString(),
    };

    setEditingDesign(freshDesignFromInspiration);
    setCurrentPage('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: 'home' | 'create' | 'designs' | 'inspiration') => {
    if (page === 'create' && currentPage !== 'create') {
      // If navigating to create without explicit edit, keep existing state or start fresh if none
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        savedCount={savedDesigns.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onUseInspiration={handleUseInspiration}
          />
        )}

        {currentPage === 'create' && (
          <CreateRoomPage
            initialDesign={editingDesign}
            onSaveDesign={handleSaveDesign}
            onNavigateToDesigns={() => handleNavigate('designs')}
          />
        )}

        {currentPage === 'designs' && (
          <MyDesignsPage
            designs={savedDesigns}
            onOpenCreate={handleStartFreshDesign}
            onEditDesign={handleEditDesign}
            onDeleteDesign={handleDeleteDesign}
          />
        )}

        {currentPage === 'inspiration' && (
          <InspirationPage onUseDesign={handleUseInspiration} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
