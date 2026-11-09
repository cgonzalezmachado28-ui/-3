import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { gameState, GameState } from '../game/gameState';
import { Letter } from '../types/game';
import { soundEngine } from '../game/audio';

interface MailboxModalProps {
  onClose: () => void;
  state: GameState;
}

export const MailboxModal: React.FC<MailboxModalProps> = ({ onClose, state }) => {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(state.letters[0] || null);
  const [isWriting, setIsWriting] = useState(false);
  const [recipient, setRecipient] = useState('Pompon 🐰');
  const [replyText, setReplyText] = useState('');

  const openLetter = (l: Letter) => {
    soundEngine.playUiPop();
    setSelectedLetter(l);
    gameState.readLetter(l.id);
  };

  const sendLetter = () => {
    if (!replyText.trim()) return;
    soundEngine.playFanfare();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setIsWriting(false);
    setReplyText('');
    gameState.addDreamEssence(20);
    gameState.addColorMagic(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💌</span>
            <div>
              <h2 className="text-base font-bold text-pink-900 leading-tight">Buzón de Cartas de Ensueño</h2>
              <p className="text-[11px] text-pink-600 font-medium">Correspondencia con amigos de las islas flotantes</p>
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

        {/* Content Body */}
        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
          {/* Letters List (Left) */}
          <div className="w-full sm:w-60 border-b sm:border-b-0 sm:border-r border-pink-100 p-3 bg-pink-50/40 space-y-1.5 overflow-y-auto max-h-40 sm:max-h-full">
            <button
              onClick={() => {
                soundEngine.playUiPop();
                setIsWriting(true);
              }}
              className="w-full py-2 mb-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <span>✍️</span> Escribir Carta
            </button>

            {state.letters.map((letItem) => (
              <button
                key={letItem.id}
                onClick={() => {
                  setIsWriting(false);
                  openLetter(letItem);
                }}
                className={`w-full p-2.5 rounded-2xl text-left cursor-pointer transition-all flex items-center gap-2 ${
                  selectedLetter?.id === letItem.id && !isWriting
                    ? 'bg-white border-2 border-pink-400 shadow-xs'
                    : 'hover:bg-white/70 border border-transparent'
                }`}
              >
                <span className="text-xl p-1 bg-pink-100 rounded-xl">{letItem.avatarEmoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-800 truncate">{letItem.sender}</div>
                  <div className="text-[10px] text-gray-500 truncate">{letItem.subject}</div>
                </div>
                {!letItem.read && <span className="w-2 h-2 rounded-full bg-rose-500"></span>}
              </button>
            ))}
          </div>

          {/* Letter Viewer / Writer (Right) */}
          <div className="flex-1 p-6 overflow-y-auto bg-amber-50/30">
            {isWriting ? (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-pink-800">Enviar Carta Mágica con Sello</h3>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Destinatario</label>
                  <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 text-xs font-bold text-gray-800 bg-white"
                  >
                    <option value="Pompon 🐰">Pompon 🐰 (Strawberry Village)</option>
                    <option value="Celeste 🐑">Celeste 🐑 (Cloudy Kingdom)</option>
                    <option value="Hana 🦊">Hana 🦊 (Sakura Forest)</option>
                    <option value="Pip 🦦">Pip 🦦 (Candy Ocean)</option>
                    <option value="Marion 🎀">Marion 🎀 (The Forgotten Room)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Mensaje de Afecto</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    placeholder="Escribe palabras cálidas para alegrar el día de tu amigo..."
                    className="w-full p-3 rounded-2xl border border-pink-200 text-xs text-gray-800 bg-white"
                  />
                </div>

                <button
                  onClick={sendLetter}
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-md cursor-pointer hover:scale-105 transition-all"
                >
                  ¡Poner Sello y Enviar! 💌
                </button>
              </div>
            ) : selectedLetter ? (
              <div className="p-6 rounded-3xl bg-white border-2 border-pink-100 shadow-sm space-y-4 relative">
                {/* Stamp */}
                <div className="absolute top-4 right-4 w-12 h-14 rounded-lg border-2 border-pink-300 bg-pink-50 flex flex-col items-center justify-center shadow-xs">
                  <span className="text-xl">🍓</span>
                  <span className="text-[8px] font-mono font-bold text-pink-600">DREAM</span>
                </div>

                <div>
                  <div className="text-xs text-pink-600 font-bold uppercase tracking-wider">De: {selectedLetter.sender}</div>
                  <h3 className="text-base font-bold text-gray-800 mt-1">{selectedLetter.subject}</h3>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed font-serif whitespace-pre-line">
                  {selectedLetter.body}
                </p>

                {selectedLetter.attachedItem && (
                  <div className="mt-4 p-3 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedLetter.attachedItem.emoji}</span>
                      <div>
                        <div className="font-bold text-pink-800">{selectedLetter.attachedItem.name}</div>
                        <div className="text-[10px] text-pink-600">Regalo adjunto x{selectedLetter.attachedItem.count}</div>
                      </div>
                    </div>
                    <span className="text-emerald-600 font-bold text-[11px]">Recibido ✓</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
