import React, { useState } from 'react';
import { Home, Compass, Bookmark, PlusCircle, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPage: 'home' | 'create' | 'designs' | 'inspiration';
  onNavigate: (page: 'home' | 'create' | 'designs' | 'inspiration') => void;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  savedCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'create' as const, label: 'Create Room', icon: PlusCircle },
    { id: 'designs' as const, label: 'My Designs', icon: Bookmark, badge: savedCount > 0 ? savedCount : undefined },
    { id: 'inspiration' as const, label: 'Inspiration', icon: Compass },
  ];

  const handleNavClick = (page: 'home' | 'create' | 'designs' | 'inspiration') => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-sm group-hover:bg-amber-900 transition">
            <span className="text-base font-serif font-bold">D</span>
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-stone-900 tracking-tight block leading-none">
              DreamHome
            </span>
            <span className="text-[10px] text-stone-500 font-medium tracking-wider uppercase">
              Room Customization
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'text-stone-900 bg-stone-200/60 font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="text-[10px] font-mono bg-stone-900 text-stone-100 px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleNavClick('create')}
            className="py-2 px-4 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Start Designing</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-[#FAF8F5] px-4 pt-2 pb-5 space-y-2 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-stone-900 text-stone-100 font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-stone-800 text-stone-200' : 'bg-stone-200 text-stone-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2">
            <button
              onClick={() => handleNavClick('create')}
              className="w-full py-2.5 px-4 bg-stone-900 text-stone-100 font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Start Designing</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
