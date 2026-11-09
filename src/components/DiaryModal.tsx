import React, { useState } from 'react';
import { GameState } from '../game/gameState';
import { soundEngine } from '../game/audio';

interface DiaryModalProps {
  onClose: () => void;
  state: GameState;
}

export const DiaryModal: React.FC<DiaryModalProps> = ({ onClose, state }) => {
  const [activeTab, setActiveTab] = useState<'pages' | 'photos'>('pages');
  const [selectedPageId, setSelectedPageId] = useState<number>(1);

  const selectedPage = state.diaryEntries.find((d) => d.id === selectedPageId) || state.diaryEntries[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📔</span>
            <div>
              <h2 className="text-base font-bold text-pink-900 leading-tight">El Diario del Creador de Sueños</h2>
              <p className="text-[11px] text-pink-600 font-medium">Memorias, álbum de fotos y el misterio de The Forgotten Room</p>
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

        {/* Tab switch */}
        <div className="flex border-b border-pink-100 px-6 gap-2 bg-pink-50/50">
          <button
            onClick={() => {
              soundEngine.playUiPop();
              setActiveTab('pages');
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pages'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-pink-500'
            }`}
          >
            <span>📜</span> Páginas Olvidadas
          </button>

          <button
            onClick={() => {
              soundEngine.playUiPop();
              setActiveTab('photos');
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'photos'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-pink-500'
            }`}
          >
            <span>📸</span> Álbum de Recuerdos ({state.photos.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'pages' ? (
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Pages Index */}
              <div className="w-full sm:w-48 space-y-1.5 border-b sm:border-b-0 sm:border-r border-pink-100 pr-2">
                {state.diaryEntries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => {
                      soundEngine.playUiPop();
                      setSelectedPageId(entry.id);
                    }}
                    className={`w-full p-2.5 rounded-2xl text-left cursor-pointer transition-all ${
                      selectedPageId === entry.id
                        ? 'bg-pink-100/80 border-2 border-pink-400 font-bold text-pink-900 shadow-xs'
                        : 'bg-white hover:bg-pink-50 border border-pink-100 text-gray-600'
                    }`}
                  >
                    <div className="text-xs">{entry.title.split(':')[0]}</div>
                    <div className="text-[10px] text-gray-400">
                      {entry.discovered ? 'Desbloqueado ✓' : '🔒 Por descubrir'}
                    </div>
                  </button>
                ))}
              </div>

              {/* Page Reader */}
              <div className="flex-1 p-5 rounded-3xl bg-amber-50/60 border border-amber-200/80 font-serif space-y-3">
                <div className="flex justify-between items-center border-b border-amber-200/60 pb-2">
                  <h3 className="text-sm font-bold text-amber-900">{selectedPage.title}</h3>
                  <span className="text-[10px] text-amber-700 italic">{selectedPage.date}</span>
                </div>

                {selectedPage.discovered ? (
                  <p className="text-xs text-amber-950 leading-relaxed whitespace-pre-line">
                    {selectedPage.content}
                  </p>
                ) : (
                  <div className="p-6 text-center text-xs text-amber-800/70 italic">
                    Esta página está sellada por el tiempo. Explora los mundos secretos para desvelar sus secretos.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              {state.photos.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-400">
                  Aún no has tomado fotos. ¡Abre la Cámara 📸 para guardar momentos inolvidables!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {state.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="p-3 bg-white rounded-3xl shadow-md border-2 border-pink-100 space-y-2 transform hover:-rotate-1 transition-transform"
                    >
                      <div className="aspect-4/3 rounded-2xl bg-gradient-to-tr from-pink-100 via-rose-50 to-sky-100 flex items-center justify-center p-3 relative overflow-hidden">
                        <div className="flex gap-1.5 text-2xl">
                          {photo.stickers.map((s: string, i: number) => (
                            <span key={i}>{s}</span>
                          ))}
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white/80 text-[9px] font-bold text-pink-700">
                          {photo.location}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-gray-800">{photo.title}</div>
                        <p className="text-[11px] text-gray-500 italic mt-0.5">"{photo.caption}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
