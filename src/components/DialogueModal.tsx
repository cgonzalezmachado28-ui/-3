import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { gameState, GameState } from '../game/gameState';
import { NPC } from '../types/game';
import { soundEngine } from '../game/audio';

interface DialogueModalProps {
  npc: NPC;
  onClose: () => void;
  state: GameState;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({ npc, onClose, state }) => {
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const activeQuest = state.quests.find((q) => q.npcId === npc.id);
  const isQuestReady = activeQuest && activeQuest.completed && !activeQuest.claimed;

  const currentLines = isQuestReady
    ? npc.dialogueQuestDone
    : [...npc.dialogueIntro, ...npc.dialogueChat];

  const handleNext = () => {
    soundEngine.playUiPop();
    if (dialogueIndex < currentLines.length - 1) {
      setDialogueIndex((i) => i + 1);
    } else {
      if (isQuestReady && activeQuest) {
        gameState.claimQuestReward(activeQuest.id);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:p-8 bg-black/30 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-300 overflow-hidden p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* NPC Avatar Display */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="w-20 h-20 rounded-3xl bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-4xl shadow-inner animate-bounce [animation-duration:3s]">
            {npc.emoji}
          </div>
          <span className="text-xs font-bold text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
            {npc.name}
          </span>
          <span className="text-[10px] text-gray-500">{npc.role}</span>
        </div>

        {/* Dialogue Bubble */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="min-h-16 flex items-center">
            <p className="text-sm font-medium text-gray-800 leading-relaxed font-sans">
              "{currentLines[dialogueIndex] || currentLines[0]}"
            </p>
          </div>

          {isQuestReady && activeQuest && (
            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold flex items-center justify-between">
              <span>¡Misión completada: {activeQuest.title}!</span>
              <span>+{activeQuest.rewardEssence} ✨</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-pink-100">
            <span className="text-[10px] text-gray-400 font-mono">
              {dialogueIndex + 1} / {currentLines.length}
            </span>
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>{dialogueIndex < currentLines.length - 1 ? 'Siguiente' : '¡Hasta luego! ♡'}</span>
              <span>➜</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
