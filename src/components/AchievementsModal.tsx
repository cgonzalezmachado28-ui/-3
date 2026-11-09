import React from 'react';
import { GameState } from '../game/gameState';
import { soundEngine } from '../game/audio';

interface AchievementsModalProps {
  onClose: () => void;
  state: GameState;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ onClose, state }) => {
  const unlockedCount = state.achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-xl bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <h2 className="text-base font-bold text-pink-900 leading-tight">Insignias & Logros Mágicos</h2>
              <p className="text-[11px] text-pink-600 font-medium">
                Desbloqueados: <strong className="text-pink-700">{unlockedCount} / {state.achievements.length}</strong>
              </p>
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

        {/* Badges Grid */}
        <div className="p-6 overflow-y-auto space-y-2.5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {state.achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                  ach.unlocked
                    ? 'bg-pink-50/70 border-pink-300 shadow-xs'
                    : 'bg-gray-50/60 border-gray-200 opacity-60'
                }`}
              >
                <span className="text-3xl p-2 rounded-xl bg-white border border-pink-100">
                  {ach.unlocked ? ach.emoji : '🔒'}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">{ach.title}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">{ach.description}</p>
                  {ach.unlocked && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold mt-1 inline-block">
                      Obtenido +50 ✨
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
