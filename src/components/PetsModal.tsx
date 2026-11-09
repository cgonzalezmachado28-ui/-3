import React, { useState } from 'react';
import { gameState, GameState } from '../game/gameState';
import { Dreamie } from '../types/game';
import { soundEngine } from '../game/audio';

interface PetsModalProps {
  onClose: () => void;
  state: GameState;
  onRefreshCompanion?: () => void;
}

const TRICKS = [
  { id: 'Dar la patita', emoji: '🐾', desc: 'Saluda levantando una patita con dulzura.' },
  { id: 'Salto voltereta', emoji: '🤸', desc: 'Realiza un salto acrobático esponjoso en el aire.' },
  { id: 'Danza de corazones', emoji: '💖', desc: 'Baila en círculos dejando una estela de corazones.' },
  { id: 'Brillo estelar', emoji: '⭐', desc: 'Emite destellos luminosos que iluminan la noche.' },
];

export const PetsModal: React.FC<PetsModalProps> = ({
  onClose,
  state,
  onRefreshCompanion,
}) => {
  const [selectedPetId, setSelectedPetId] = useState<string>(state.activeCompanionId || state.dreamies[0].id);
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [bathAnimation, setBathAnimation] = useState(false);

  const selectedPet = state.dreamies.find((d) => d.id === selectedPetId) || state.dreamies[0];

  const handlePetAction = () => {
    gameState.petDreamie(selectedPet.id);
  };

  const handleFeed = () => {
    // Check inventory food
    const foods = ['strawberry', 'star_shards', 'sugar_shells'];
    const availableFood = foods.find((f) => (state.inventory[f] || 0) > 0);
    if (availableFood) {
      gameState.feedDreamie(selectedPet.id, availableFood);
    } else {
      // Free strawberry snack if empty
      gameState.feedDreamie(selectedPet.id, 'strawberry');
    }
  };

  const handleBath = () => {
    setBathAnimation(true);
    gameState.batheDreamie(selectedPet.id);
    setTimeout(() => {
      setBathAnimation(false);
    }, 1800);
  };

  const handleRename = () => {
    if (nameInput.trim()) {
      gameState.renameDreamie(selectedPet.id, nameInput.trim());
      setIsRenaming(false);
    }
  };

  const handleTeachTrick = (trick: string) => {
    gameState.teachDreamieTrick(selectedPet.id, trick);
  };

  const handleSetCompanion = () => {
    gameState.setCompanion(selectedPet.id);
    if (onRefreshCompanion) onRefreshCompanion();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-3xl bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🐇</span>
            <div>
              <h2 className="text-lg font-bold text-pink-900 leading-tight">Santuario & Cuidados de Dreamies</h2>
              <p className="text-xs text-pink-600 font-medium">Alimenta, baña, nombra y enseña trucos a tus mascotas mágicas</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playUiPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-pink-600 font-bold flex items-center justify-center border border-pink-200 cursor-pointer transition-all hover:scale-105"
          >
            ✕
          </button>
        </div>

        {/* Bathing Bubble Overlay */}
        {bathAnimation && (
          <div className="absolute inset-0 z-30 bg-sky-200/70 flex flex-col items-center justify-center p-6 text-center animate-pulse">
            <span className="text-7xl animate-bounce">🛁🫧🐥</span>
            <h3 className="text-2xl font-bold text-sky-800 mt-3">¡Baño de Burbujas Perfumadas!</h3>
            <p className="text-xs text-sky-700">¡{selectedPet.customName || selectedPet.name} queda suave y oliendo a fresas!</p>
          </div>
        )}

        {/* Main Body Layout */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Pets List (Left Sidebar) */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-pink-100 p-3 bg-pink-50/40 overflow-y-auto space-y-1.5 max-h-48 md:max-h-full">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
              Tus Criaturas ({state.dreamies.filter((d) => d.adopted).length}/{state.dreamies.length})
            </div>

            {state.dreamies.map((pet) => (
              <button
                key={pet.id}
                onClick={() => {
                  soundEngine.playUiPop();
                  setSelectedPetId(pet.id);
                  setIsRenaming(false);
                }}
                className={`w-full p-2.5 rounded-2xl text-left cursor-pointer transition-all flex items-center gap-2.5 ${
                  selectedPet.id === pet.id
                    ? 'bg-white shadow-xs border-2 border-pink-400'
                    : 'hover:bg-white/70 border border-transparent'
                }`}
              >
                <span className="text-2xl p-1 rounded-xl bg-pink-100/70">{pet.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-800 truncate">
                      {pet.customName || pet.name}
                    </span>
                    {pet.isLegendary && (
                      <span className="text-[10px] px-1 rounded bg-amber-100 text-amber-800 font-bold">★</span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">{pet.title}</div>
                </div>
                {pet.adopted && pet.isFollowing && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
              </button>
            ))}
          </div>

          {/* Pet Details & Interaction Center (Right) */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-white">
            {/* Pet Card Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-3xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-200">
              <div className="text-6xl p-3 bg-white rounded-3xl shadow-xs border border-pink-100 flex items-center justify-center">
                {selectedPet.emoji}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {isRenaming ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Nuevo nombre..."
                        className="px-2 py-1 rounded-lg border border-pink-300 text-xs font-bold"
                        maxLength={16}
                      />
                      <button
                        onClick={handleRename}
                        className="px-2.5 py-1 rounded-lg bg-pink-500 text-white text-xs font-bold cursor-pointer"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setIsRenaming(false)}
                        className="px-2 py-1 rounded-lg bg-gray-200 text-gray-600 text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-gray-800">
                        {selectedPet.customName || selectedPet.name}
                      </h3>
                      <button
                        onClick={() => {
                          setNameInput(selectedPet.customName || selectedPet.name);
                          setIsRenaming(true);
                        }}
                        className="text-xs text-pink-600 hover:text-pink-800 font-semibold cursor-pointer"
                        title="Cambiar nombre"
                      >
                        ✏️ Renombrar
                      </button>
                    </>
                  )}
                  {selectedPet.isLegendary && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                      Legendaria ✨
                    </span>
                  )}
                </div>

                <p className="text-xs text-pink-700 font-medium mt-0.5">{selectedPet.title}</p>
                <p className="text-xs text-gray-600 mt-2 italic">{selectedPet.personality}</p>

                {/* Status Meters */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="p-2 rounded-xl bg-white/90 border border-pink-100 text-center">
                    <div className="text-[10px] text-gray-500 font-semibold">Felicidad</div>
                    <div className="text-xs font-bold text-pink-600">{selectedPet.happiness}%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/90 border border-pink-100 text-center">
                    <div className="text-[10px] text-gray-500 font-semibold">Limpieza</div>
                    <div className="text-xs font-bold text-sky-600">{selectedPet.cleanliness || 90}%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/90 border border-pink-100 text-center">
                    <div className="text-[10px] text-gray-500 font-semibold">Amistad</div>
                    <div className="text-xs font-bold text-amber-600">Nivel {selectedPet.friendshipLevel}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Interaction Buttons */}
            {selectedPet.adopted ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={handlePetAction}
                  className="p-3 rounded-2xl bg-pink-100/80 hover:bg-pink-200 text-pink-700 font-bold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <span className="text-xl">💖</span>
                  Acariciar
                </button>

                <button
                  onClick={handleFeed}
                  className="p-3 rounded-2xl bg-amber-100/80 hover:bg-amber-200 text-amber-800 font-bold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <span className="text-xl">🍓</span>
                  Alimentar
                </button>

                <button
                  onClick={handleBath}
                  className="p-3 rounded-2xl bg-sky-100/80 hover:bg-sky-200 text-sky-800 font-bold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <span className="text-xl">🛁</span>
                  Bañar
                </button>

                <button
                  onClick={handleSetCompanion}
                  className={`p-3 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                    selectedPet.isFollowing
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-rose-500 hover:bg-rose-600 text-white'
                  }`}
                >
                  <span className="text-xl">🐾</span>
                  {selectedPet.isFollowing ? 'Acompañando' : 'Elegir Compañero'}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 text-center">
                <p className="text-xs text-pink-800 mb-3">
                  Esta criatura vive en <strong>{selectedPet.homeWorld}</strong>. ¡Adóptala para cuidarla y llevarla contigo!
                </p>
                <button
                  onClick={() => gameState.adoptDreamie(selectedPet.id)}
                  className="px-6 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md cursor-pointer hover:scale-105 transition-all"
                >
                  Adoptar a {selectedPet.name} ♡
                </button>
              </div>
            )}

            {/* Tricks Section */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                Trucos Aprendidos ({selectedPet.learnedTricks?.length || 1}/{TRICKS.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TRICKS.map((trick) => {
                  const isLearned = selectedPet.learnedTricks?.includes(trick.id);
                  return (
                    <div
                      key={trick.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        isLearned
                          ? 'bg-pink-50/60 border-pink-200'
                          : 'bg-gray-50/70 border-gray-200 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{trick.emoji}</span>
                        <div>
                          <div className="text-xs font-bold text-gray-800">{trick.id}</div>
                          <div className="text-[10px] text-gray-500">{trick.desc}</div>
                        </div>
                      </div>

                      {isLearned ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                          Aprendido ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => handleTeachTrick(trick.id)}
                          className="px-2.5 py-1 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-[11px] font-bold cursor-pointer transition-all"
                        >
                          Enseñar
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
