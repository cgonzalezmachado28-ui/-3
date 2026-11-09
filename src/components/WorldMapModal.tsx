import React from 'react';
import { gameState, GameState } from '../game/gameState';
import { WorldId } from '../types/game';
import { soundEngine } from '../game/audio';

interface WorldMapModalProps {
  onClose: () => void;
  state: GameState;
  onWarpToWorld: (worldId: WorldId) => void;
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  onClose,
  state,
  onWarpToWorld,
}) => {
  const handleSelectWorld = (worldId: WorldId, unlocked: boolean) => {
    if (!unlocked) return;
    soundEngine.playFanfare();
    onWarpToWorld(worldId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <div>
              <h2 className="text-base font-bold text-pink-900 leading-tight">Islas Flotantes de Dreamyland</h2>
              <p className="text-[11px] text-pink-600 font-medium">Viaja a través de los portales de ensueño</p>
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

        {/* Worlds Grid */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {state.worlds.map((world) => {
              const isCurrent = state.currentWorld === world.id;
              return (
                <div
                  key={world.id}
                  className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-pink-100/70 border-pink-500 shadow-md scale-102'
                      : world.unlocked
                      ? 'bg-pink-50/50 border-pink-200 hover:border-pink-300'
                      : 'bg-gray-50/70 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-white border border-pink-100 shadow-xs">
                      {world.emoji}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-gray-800">{world.name}</h4>
                        {world.isSecret && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                            SECRETO 🗝️
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-pink-700 font-medium">{world.subtitle}</p>
                      <p className="text-[11px] text-gray-500 mt-1 leading-snug">{world.description}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-pink-100/60 flex items-center justify-between">
                    {world.unlocked ? (
                      isCurrent ? (
                        <span className="text-xs font-bold text-pink-700">📍 Estás aquí</span>
                      ) : (
                        <button
                          onClick={() => handleSelectWorld(world.id, world.unlocked)}
                          className="w-full py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
                        >
                          Viajar a {world.name} ✨
                        </button>
                      )
                    ) : (
                      <span className="text-[10px] font-semibold text-gray-500 italic">
                        🔒 {world.unlockRequirement || 'Bloqueado'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
