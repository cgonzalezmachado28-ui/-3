import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { gameState, GameState } from '../game/gameState';
import { soundEngine } from '../game/audio';

interface CameraModalProps {
  onClose: () => void;
  state: GameState;
}

const FILTERS = [
  { id: 'pastel', name: 'Pastel Dream', class: 'bg-pink-100/30' },
  { id: 'polaroid', name: 'Polaroid Retro', class: 'bg-amber-100/20 sepia-[0.2]' },
  { id: 'sparkles', name: 'Lluvia de Brillos', class: 'bg-purple-100/30' },
  { id: 'dreamcore', name: 'Nostalgia Dreamcore', class: 'bg-rose-900/15 contrast-[0.9]' },
];

const STICKERS = ['🍓', '🌸', '🎀', '✨', '🧸', '☁️', '🗝️', '🐰', '⭐', '🧁'];

export const CameraModal: React.FC<CameraModalProps> = ({ onClose, state }) => {
  const [selectedFilter, setSelectedFilter] = useState('pastel');
  const [activeStickers, setActiveStickers] = useState<string[]>(['✨', '🌸']);
  const [caption, setCaption] = useState('¡Un instante mágico en Dreamyland! 💖');
  const [flash, setFlash] = useState(false);

  const toggleSticker = (s: string) => {
    soundEngine.playUiPop();
    if (activeStickers.includes(s)) {
      setActiveStickers(activeStickers.filter((item) => item !== s));
    } else {
      setActiveStickers([...activeStickers, s]);
    }
  };

  const capturePhoto = () => {
    setFlash(true);
    soundEngine.playUiPop();
    setTimeout(() => setFlash(false), 200);

    const worldInfo = state.worlds.find((w) => w.id === state.currentWorld);

    gameState.savePhoto({
      title: `Recuerdo de ${worldInfo?.name || 'Dreamyland'}`,
      location: worldInfo?.name || 'Dreamyland',
      filter: selectedFilter,
      caption,
      stickers: activeStickers,
    });

    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-lg bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Flash Effect */}
        {flash && <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity" />}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <div>
              <h2 className="text-base font-bold text-pink-900 leading-tight">Cámara Instantánea Kawaii</h2>
              <p className="text-[11px] text-pink-600 font-medium">Captura recuerdos con filtros y sellitos</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playUiPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-pink-600 font-bold flex items-center justify-center border border-pink-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Camera Viewfinder View */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="relative w-full aspect-4/3 rounded-3xl border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-pink-200 via-rose-100 to-sky-200 flex flex-col justify-between p-4">
            {/* Filter overlay */}
            <div className={`absolute inset-0 pointer-events-none ${FILTERS.find((f) => f.id === selectedFilter)?.class}`} />

            {/* Viewfinder crosshairs */}
            <div className="absolute inset-4 border border-white/40 border-dashed rounded-2xl pointer-events-none flex items-center justify-center">
              <span className="text-white/40 text-xs tracking-widest font-mono">+ 00:00 +</span>
            </div>

            {/* In-Frame Stickers */}
            <div className="relative z-10 flex flex-wrap gap-2 pointer-events-none">
              {activeStickers.map((s, idx) => (
                <span key={idx} className="text-3xl drop-shadow-md animate-bounce">
                  {s}
                </span>
              ))}
            </div>

            <div className="relative z-10 text-right">
              <span className="px-2.5 py-1 rounded-full bg-white/70 text-[10px] font-bold text-pink-700 shadow-xs">
                {state.currentWorld.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Filters Picker */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              Filtro Fotográfico
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    soundEngine.playUiPop();
                    setSelectedFilter(f.id);
                  }}
                  className={`p-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    selectedFilter === f.id
                      ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-xs'
                      : 'border-pink-100 bg-white text-gray-600 hover:bg-pink-50/50'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stickers Picker */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              Sellitos y Stickers
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STICKERS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSticker(s)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border cursor-pointer transition-all ${
                    activeStickers.includes(s)
                      ? 'bg-pink-100 border-pink-400 scale-105'
                      : 'bg-white border-pink-100 hover:scale-105'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Caption Input */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              Pie de Foto para el Diario
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-pink-200 text-xs font-medium text-gray-800"
              placeholder="Escribe una dedicatoria..."
              maxLength={60}
            />
          </div>
        </div>

        {/* Shutter Button Action */}
        <div className="p-4 bg-pink-50/70 border-t border-pink-200 flex justify-between items-center">
          <span className="text-xs text-pink-600 font-medium">
            Se guardará en tu Diario ♡
          </span>
          <button
            onClick={capturePhoto}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs shadow-md shadow-pink-300/50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>📸</span> ¡Tomar Foto!
          </button>
        </div>
      </div>
    </div>
  );
};
