import React, { useState } from 'react';
import { GameState } from '../game/gameState';
import { InteractionTarget } from '../game/sceneManager';
import { soundEngine } from '../game/audio';

interface GameHUDProps {
  state: GameState;
  nearInteraction: InteractionTarget | null;
  onInteract: () => void;
  onOpenCottage: () => void;
  onOpenWardrobe: () => void;
  onOpenPets: () => void;
  onOpenGardening: () => void;
  onOpenJobs: () => void;
  onOpenMinigames: () => void;
  onOpenShop: () => void;
  onOpenMap: () => void;
  onOpenCamera: () => void;
  onOpenJukebox: () => void;
  onOpenMailbox: () => void;
  onOpenAchievements: () => void;
  onOpenDiary: () => void;
  onOpenSettings: () => void;
  onReturnToTitle: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  state,
  nearInteraction,
  onInteract,
  onOpenCottage,
  onOpenWardrobe,
  onOpenPets,
  onOpenGardening,
  onOpenJobs,
  onOpenMinigames,
  onOpenShop,
  onOpenMap,
  onOpenCamera,
  onOpenJukebox,
  onOpenMailbox,
  onOpenAchievements,
  onOpenDiary,
  onOpenSettings,
  onReturnToTitle,
}) => {
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  const currentWorldInfo = state.worlds.find((w) => w.id === state.currentWorld) || state.worlds[0];
  const unreadLetters = state.letters.filter((l) => !l.read).length;

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-10 select-none">
      {/* Top Perimeter Status Cluster */}
      <div className="flex justify-between items-start w-full">
        {/* Top-Left: World & Magic Health */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* World Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/90 border border-pink-200/80 shadow-xs">
            <span className="text-xl">{currentWorldInfo.emoji}</span>
            <div>
              <div className="text-xs font-bold text-gray-800 leading-tight">{currentWorldInfo.name}</div>
              <div className="text-[10px] text-pink-600 font-medium">{currentWorldInfo.subtitle}</div>
            </div>
          </div>

          {/* Color Magic Restoration Bar */}
          <div className="px-3 py-2 rounded-2xl bg-white/90 border border-pink-200/80 shadow-xs w-48 sm:w-56">
            <div className="flex justify-between items-center text-[10px] font-bold text-pink-700 mb-1">
              <span>Magia de Color</span>
              <span className="tabular-nums font-mono">{state.worldColorLevel}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, state.worldColorLevel)}%` }}
              />
            </div>
          </div>

          {/* Dream Essence Cluster */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/90 border border-pink-200/80 shadow-xs text-xs font-bold text-amber-700">
            <span>✨</span>
            <span className="tabular-nums font-mono">{state.dreamEssence}</span>
            <span className="text-[10px] text-amber-600 font-medium">Esencia de Sueño</span>
          </div>
        </div>

        {/* Top-Right: Perimeter Utility Icons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              soundEngine.playUiPop();
              onOpenMailbox();
            }}
            className="relative w-10 h-10 rounded-2xl bg-white/90 hover:bg-white text-gray-700 border border-pink-200/80 shadow-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Buzón de Cartas"
          >
            <span className="text-base">💌</span>
            {unreadLetters > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadLetters}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              soundEngine.playUiPop();
              onOpenAchievements();
            }}
            className="w-10 h-10 rounded-2xl bg-white/90 hover:bg-white text-gray-700 border border-pink-200/80 shadow-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Logros e Insignias"
          >
            <span className="text-base">🏆</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playUiPop();
              onOpenCamera();
            }}
            className="w-10 h-10 rounded-2xl bg-white/90 hover:bg-white text-gray-700 border border-pink-200/80 shadow-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Modo Cámara"
          >
            <span className="text-base">📸</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playUiPop();
              onOpenJukebox();
            }}
            className="w-10 h-10 rounded-2xl bg-white/90 hover:bg-white text-gray-700 border border-pink-200/80 shadow-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Música & Playlists"
          >
            <span className="text-base">🎵</span>
          </button>

          <button
            onClick={toggleSound}
            className="w-10 h-10 rounded-2xl bg-white/90 hover:bg-white text-gray-700 border border-pink-200/80 shadow-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Silenciar / Activar Sonido"
          >
            <span className="text-base">{isMuted ? '🔇' : '🔊'}</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playUiPop();
              onOpenSettings();
            }}
            className="w-10 h-10 rounded-2xl bg-white/90 hover:bg-white text-gray-700 border border-pink-200/80 shadow-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Menú & Ajustes"
          >
            <span className="text-base">⚙️</span>
          </button>
        </div>
      </div>

      {/* Proximity Interaction Floating Tooltip */}
      {nearInteraction && (
        <div className="mx-auto mb-3 pointer-events-auto animate-bounce">
          <button
            onClick={onInteract}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold text-xs shadow-lg shadow-pink-300/60 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-white"
          >
            <kbd className="px-1.5 py-0.5 rounded bg-white/30 text-white font-mono text-[10px]">E</kbd>
            <span>{nearInteraction.prompt}</span>
          </button>
        </div>
      )}

      {/* Unified Bottom Control Dock */}
      <div className="mx-auto pointer-events-auto flex flex-col items-center">
        {/* Dock Collapse / Expand Tab Toggle */}
        <button
          onClick={() => {
            soundEngine.playUiPop();
            setDockCollapsed(!dockCollapsed);
          }}
          className="mb-1 px-3 py-1 rounded-full bg-white/90 hover:bg-white text-pink-700 text-[10px] font-bold border border-pink-200/80 shadow-xs cursor-pointer transition-all hover:scale-105"
        >
          {dockCollapsed ? '▴ Mostrar Menú' : '▾ Ocultar Menú'}
        </button>

        {/* Collapsible Horizontal Dock */}
        {!dockCollapsed && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-2 rounded-3xl bg-white/95 border border-pink-200 shadow-xl max-w-full">
            <button
              onClick={() => {
                soundEngine.playUiPop();
                onOpenCottage();
              }}
              className="px-3 py-1.5 rounded-2xl hover:bg-pink-50 text-gray-800 hover:text-pink-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>🏡</span> Casita
            </button>

            <button
              onClick={() => {
                soundEngine.playUiPop();
                onOpenWardrobe();
              }}
              className="px-3 py-1.5 rounded-2xl hover:bg-pink-50 text-gray-800 hover:text-pink-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>👗</span> Moda
            </button>

            <button
              onClick={() => {
                soundEngine.playUiPop();
                onOpenPets();
              }}
              className="px-3 py-1.5 rounded-2xl hover:bg-pink-50 text-gray-800 hover:text-pink-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>🐇</span> Mascotas
            </button>

            <button
              onClick={() => {
                soundEngine.playUiPop();
                onOpenGardening();
              }}
              className="px-3 py-1.5 rounded-2xl hover:bg-pink-50 text-gray-800 hover:text-pink-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>🍓</span> Huerto
            </button>

            <button
              onClick={() => {
                soundEngine.playUiPop();
                onOpenJobs();
              }}
              className="px-3 py-1.5 rounded-2xl hover:bg-pink-50 text-gray-800 hover:text-pink-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>🍰</span> Trabajos
            </button>

            <button
              onClick={() => {
                soundEngine.playUiPop();
                onOpenMinigames();
              }}
              className="px-3 py-1.5 rounded-2xl hover:bg-pink-50 text-gray-800 hover:text-pink-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>🎮</span> Minijuegos
            </button>

            <button
              onClick={() => {
                soundEngine.playUiPop();
                onOpenShop();
              }}
              className="px-3 py-1.5 rounded-2xl hover:bg-pink-50 text-gray-800 hover:text-pink-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>🛍️</span> Tienda
            </button>

            <button
              onClick={() => {
                soundEngine.playUiPop();
                onOpenMap();
              }}
              className="px-3 py-1.5 rounded-2xl hover:bg-pink-50 text-gray-800 hover:text-pink-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>🗺️</span> Viajar
            </button>

            <button
              onClick={() => {
                soundEngine.playUiPop();
                onOpenDiary();
              }}
              className="px-3 py-1.5 rounded-2xl hover:bg-pink-50 text-gray-800 hover:text-pink-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>📔</span> Diario
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
