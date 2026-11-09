import React from 'react';
import { soundEngine } from '../game/audio';

interface TitleScreenProps {
  onPlay: () => void;
  onOpenDressUp: () => void;
  onOpenPets: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  onOpenCredits: () => void;
  onOpenDownload: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onPlay,
  onOpenDressUp,
  onOpenPets,
  onOpenShop,
  onOpenSettings,
  onOpenCredits,
  onOpenDownload,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-20">
      {/* Top Bar with Cute Branding */}
      <div className="flex justify-between items-center pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-none border border-pink-200/80 shadow-xs text-xs font-semibold text-pink-600">
          <span className="w-2 h-2 rounded-full bg-pink-400"></span>
          visualizee.ai
        </div>
        <div className="text-xs font-medium text-pink-500/90 bg-pink-50/70 px-3 py-1 rounded-full border border-pink-200/50">
          Cutecore · Pastelcore · Dreamcore 3D
        </div>
      </div>

      {/* Hero Centerpiece: Bespoke SVG Title Lockup */}
      <div className="flex flex-col items-center justify-center my-auto pointer-events-auto">
        <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
          {/* Whimsical SVG Logo Lockup */}
          <div className="text-center select-none">
            <div className="inline-flex items-center gap-2 mb-1 px-4 py-1 rounded-full bg-pink-100/90 border border-pink-300 text-pink-700 text-xs tracking-widest uppercase font-semibold shadow-xs">
              <span>🌸</span> El jardín de los sueños <span>🌸</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-pink-400 via-rose-400 to-pink-600 drop-shadow-sm font-['Fredoka']">
              DREAMYLAND
            </h1>

            <p className="mt-2 text-sm sm:text-base text-pink-800/80 max-w-md mx-auto font-medium">
              Despierta en un mundo mágico flotante, cuida a los Dreamies y devuelve el brillo a los sueños olvidados.
            </p>
          </div>
        </div>

        {/* Primary CTA Play Button */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playFanfare();
              onPlay();
            }}
            className="group relative px-10 py-4 rounded-3xl bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-xl shadow-lg shadow-pink-300/50 hover:shadow-xl hover:shadow-pink-300/70 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-white/60"
          >
            <span className="flex items-center gap-2">
              <span className="text-2xl group-hover:rotate-12 transition-transform">🎀</span>
              PLAY ♡
            </span>
          </button>

          <span className="text-xs text-pink-600/80 font-medium tracking-wide">
            Presiona <kbd className="px-1.5 py-0.5 rounded bg-white/80 border border-pink-200 text-pink-700 font-mono text-[11px]">Espacio</kbd> o <kbd className="px-1.5 py-0.5 rounded bg-white/80 border border-pink-200 text-pink-700 font-mono text-[11px]">Enter</kbd> para comenzar
          </span>
        </div>

        {/* Secondary Navigation Buttons Grid */}
        <div className="mt-6 flex flex-wrap justify-center gap-2.5 max-w-xl">
          <button
            onClick={() => {
              soundEngine.playUiPop();
              onOpenDressUp();
            }}
            className="px-4 py-2 rounded-2xl bg-white/80 hover:bg-white text-pink-700 font-semibold text-sm border border-pink-200 shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>👗</span> DRESS UP
          </button>

          <button
            onClick={() => {
              soundEngine.playUiPop();
              onOpenPets();
            }}
            className="px-4 py-2 rounded-2xl bg-white/80 hover:bg-white text-pink-700 font-semibold text-sm border border-pink-200 shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>🐇</span> PETS
          </button>

          <button
            onClick={() => {
              soundEngine.playUiPop();
              onOpenShop();
            }}
            className="px-4 py-2 rounded-2xl bg-white/80 hover:bg-white text-pink-700 font-semibold text-sm border border-pink-200 shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>🛍️</span> SHOP
          </button>

          <button
            onClick={() => {
              soundEngine.playUiPop();
              onOpenSettings();
            }}
            className="px-4 py-2 rounded-2xl bg-white/80 hover:bg-white text-pink-700 font-semibold text-sm border border-pink-200 shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>⚙️</span> SETTINGS
          </button>

          <button
            onClick={() => {
              soundEngine.playUiPop();
              onOpenDownload();
            }}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-md shadow-pink-300/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>📥</span> DESCARGAR
          </button>

          <button
            onClick={() => {
              soundEngine.playUiPop();
              onOpenCredits();
            }}
            className="px-4 py-2 rounded-2xl bg-white/80 hover:bg-white text-pink-700 font-semibold text-sm border border-pink-200 shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>📖</span> CREDITS
          </button>
        </div>
      </div>

      {/* Flat Control Hints Footer */}
      <div className="text-center pointer-events-auto">
        <p className="text-xs text-pink-700/80 font-medium">
          WASD / Flechas Mover · Espacio Saltar · E Interactuar · Tab Personalizar · Esc Pausa
        </p>
      </div>
    </div>
  );
};
