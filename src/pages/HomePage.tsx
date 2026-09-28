import React from 'react';
import { INSPIRATION_ITEMS } from '../data/inspiration';
import { PlusCircle, Compass, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'home' | 'create' | 'designs' | 'inspiration') => void;
  onUseInspiration: (item: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onUseInspiration }) => {
  // Take first 3-4 items for preview
  const sampleDesigns = INSPIRATION_ITEMS.slice(0, 3);

  const features = [
    {
      icon: '🏠',
      title: 'Create Your Room',
      desc: 'Set custom room dimensions, types, and floor layouts with effortless clarity.',
    },
    {
      icon: '🎨',
      title: 'Choose Colors',
      desc: 'Select from curated palettes of wall paints and authentic flooring finishes.',
    },
    {
      icon: '🛋️',
      title: 'Add Furniture',
      desc: 'Place sofas, beds, desks, and dining pieces directly into your living canvas.',
    },
    {
      icon: '✨',
      title: 'Personalize Your Space',
      desc: 'Enhance with ambient lighting, lush plants, wall art, rugs, and soft glow.',
    },
  ];

  return (
    <div className="space-y-20 pb-12">
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-12 text-center max-w-4xl mx-auto px-4 sm:px-6">
        {/* Subtle decorative badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-pulse" />
          <span>Interactive Virtual Room Customizer</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
          DreamHome
        </h1>

        <p className="mt-4 text-2xl sm:text-3xl font-serif text-stone-700 italic">
          Design the space you dream of.
        </p>

        <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Create and customize your perfect room with simple furniture, colors, decorations, and lighting.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => onNavigate('create')}
            className="w-full sm:w-auto py-3.5 px-7 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Start Designing</span>
          </button>

          <button
            onClick={() => onNavigate('inspiration')}
            className="w-full sm:w-auto py-3.5 px-6 bg-white hover:bg-stone-100 text-stone-800 font-semibold text-sm rounded-xl border border-stone-300 shadow-sm transition flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-stone-600" />
            <span>Explore Designs</span>
          </button>
        </div>

        {/* Subtle hero visual preview card */}
        <div className="mt-14 p-2.5 sm:p-3 bg-white/80 rounded-2xl border border-stone-200/90 shadow-xl max-w-3xl mx-auto">
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
              alt="DreamHome Interior Sample"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent flex items-end p-6 text-left">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-300">
                  Minimalist & Contemporary Living
                </span>
                <p className="text-white text-lg sm:text-xl font-serif font-bold">
                  Harmonious natural wood, neutral warmth, and gentle daylight
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Intuitive by Design
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
            Everything you need to visualize your sanctuary without complicated 3D modeling tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md hover:border-stone-300 transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-2xl mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-sm font-bold text-stone-900">{feat.title}</h3>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INSPIRATION PREVIEW SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Curated Rooms</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Inspiration Preview
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Explore hand-crafted room concepts and customize them to your liking.
            </p>
          </div>

          <button
            onClick={() => onNavigate('inspiration')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-amber-800 transition"
          >
            <span>View Inspiration</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleDesigns.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition duration-200 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={item.imageUrl}
                  alt={item.designName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-stone-100 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {item.style}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wide">
                    {item.roomType} · {item.colorTheme}
                  </div>
                  <h3 className="text-base font-serif font-bold text-stone-900 mt-1">
                    {item.designName}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => onUseInspiration(item)}
                  className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-900 hover:text-stone-100 text-stone-800 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <span>Customize This Style</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All button */}
        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('inspiration')}
            className="py-3 px-6 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold text-xs rounded-xl shadow-sm transition"
          >
            View Inspiration
          </button>
        </div>
      </section>
    </div>
  );
};
