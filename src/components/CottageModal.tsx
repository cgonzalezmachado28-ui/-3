import React, { useState } from 'react';
import { gameState, GameState } from '../game/gameState';
import { FurnitureItem, RoomTheme } from '../types/game';
import { soundEngine } from '../game/audio';

interface CottageModalProps {
  onClose: () => void;
  state: GameState;
}

const WALLPAPERS = [
  { id: 'strawberry_gingham', name: 'Gingham de Fresa', emoji: '🍓', color: 'bg-rose-100 border-rose-300' },
  { id: 'sweet_clouds', name: 'Nubes de Azúcar', emoji: '☁️', color: 'bg-sky-100 border-sky-300' },
  { id: 'sakura_blossoms', name: 'Pétalos de Sakura', emoji: '🌸', color: 'bg-pink-100 border-pink-300' },
  { id: 'vintage_lace', name: 'Encaje Victoriano', emoji: '🎀', color: 'bg-amber-50 border-amber-300' },
  { id: 'starry_dream', name: 'Estrellas Oníricas', emoji: '⭐', color: 'bg-purple-100 border-purple-300' },
];

const FLOORINGS = [
  { id: 'pastel_wood', name: 'Madera de Roble Pastel', emoji: '🪵', color: 'bg-amber-100' },
  { id: 'sugar_marble', name: 'Mármol de Nácar', emoji: '✨', color: 'bg-rose-50' },
  { id: 'fluffy_carpet', name: 'Moqueta de Algodón', emoji: '☁️', color: 'bg-pink-100' },
  { id: 'tatami_pastoral', name: 'Tatami Floral', emoji: '🌾', color: 'bg-emerald-50' },
];

const THEMES: { id: RoomTheme; name: string; emoji: string }[] = [
  { id: 'strawberry', name: 'Valle de Fresa', emoji: '🍓' },
  { id: 'clouds', name: 'Nubes Celestiales', emoji: '☁️' },
  { id: 'sakura', name: 'Cerezos Sagrados', emoji: '🌸' },
  { id: 'vintage', name: 'Nostalgia Vintage', emoji: '🗝️' },
  { id: 'starry', name: 'Observatorio Estelar', emoji: '⭐' },
];

export const CottageModal: React.FC<CottageModalProps> = ({ onClose, state }) => {
  const [activeTab, setActiveTab] = useState<'furniture' | 'walls_floors' | 'pets' | 'themes'>('furniture');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFurniture = state.furniture.filter((f) => {
    if (selectedCategory === 'all') return true;
    return f.category === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏡</span>
            <div>
              <h2 className="text-lg font-bold text-pink-900 leading-tight">Tu Propia Casita de Ensueño</h2>
              <p className="text-xs text-pink-600 font-medium">Personaliza muebles, paredes, pisos y mascotas</p>
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

        {/* Tab Navigation */}
        <div className="flex border-b border-pink-100 px-6 gap-2 bg-pink-50/50">
          <button
            onClick={() => {
              soundEngine.playUiPop();
              setActiveTab('furniture');
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'furniture'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-pink-500'
            }`}
          >
            <span>🛋️</span> Muebles ({state.furniture.filter((f) => f.placed).length})
          </button>

          <button
            onClick={() => {
              soundEngine.playUiPop();
              setActiveTab('walls_floors');
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'walls_floors'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-pink-500'
            }`}
          >
            <span>🎨</span> Paredes y Pisos
          </button>

          <button
            onClick={() => {
              soundEngine.playUiPop();
              setActiveTab('pets');
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pets'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-pink-500'
            }`}
          >
            <span>🐇</span> Mascotas en Casa
          </button>

          <button
            onClick={() => {
              soundEngine.playUiPop();
              setActiveTab('themes');
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'themes'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-pink-500'
            }`}
          >
            <span>✨</span> Temas y Luces
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'furniture' && (
            <div>
              {/* Category Filter */}
              <div className="flex gap-1.5 overflow-x-auto pb-3 mb-3">
                {['all', 'bed', 'seating', 'rug', 'table', 'decor', 'lighting'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      soundEngine.playUiPop();
                      setSelectedCategory(cat);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap cursor-pointer transition-all ${
                      selectedCategory === cat
                        ? 'bg-pink-500 text-white shadow-xs'
                        : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                    }`}
                  >
                    {cat === 'all' ? 'Todos' : cat}
                  </button>
                ))}
              </div>

              {/* Furniture Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredFurniture.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      item.placed
                        ? 'bg-pink-50/80 border-pink-300'
                        : item.unlocked
                        ? 'bg-white border-pink-100 hover:border-pink-200'
                        : 'bg-gray-50/70 border-gray-200 opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl p-2 rounded-xl bg-white shadow-xs border border-pink-100">{item.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                          {item.placed && (
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                              Colocado
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-pink-100/60">
                      {!item.unlocked ? (
                        <button
                          onClick={() => gameState.unlockFurniture(item.id)}
                          disabled={state.dreamEssence < item.costEssence}
                          className="w-full py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Desbloquear por {item.costEssence} ✨</span>
                        </button>
                      ) : item.placed ? (
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => {
                              // Rotate 45 deg
                              gameState.placeFurniture(item.id, item.position, item.rotationY + Math.PI / 4);
                            }}
                            className="flex-1 py-1.5 rounded-xl bg-white hover:bg-pink-50 text-pink-700 border border-pink-200 text-xs font-semibold cursor-pointer"
                          >
                            🔄 Rotar
                          </button>
                          <button
                            onClick={() => gameState.removeFurniture(item.id)}
                            className="flex-1 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-semibold cursor-pointer"
                          >
                            Guardar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            gameState.placeFurniture(item.id, [0, 0, 0], 0);
                          }}
                          className="w-full py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold cursor-pointer"
                        >
                          Colocar en Casita 🌸
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'walls_floors' && (
            <div className="space-y-6">
              {/* Wallpapers */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                  <span>🧱</span> Diseños de Papel Tapiz
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {WALLPAPERS.map((wp) => (
                    <button
                      key={wp.id}
                      onClick={() => gameState.setRoomCustomization({ wallpaper: wp.id })}
                      className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                        state.roomCustomization.wallpaper === wp.id
                          ? 'border-pink-500 bg-pink-50 shadow-xs'
                          : 'border-pink-100 bg-white hover:border-pink-200'
                      }`}
                    >
                      <div className="text-2xl mb-1">{wp.emoji}</div>
                      <div className="text-xs font-bold text-gray-800">{wp.name}</div>
                      {state.roomCustomization.wallpaper === wp.id && (
                        <div className="text-[10px] text-pink-600 font-bold mt-1">Activo ✓</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floorings */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                  <span>🪵</span> Diseños de Suelo
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {FLOORINGS.map((fl) => (
                    <button
                      key={fl.id}
                      onClick={() => gameState.setRoomCustomization({ flooring: fl.id })}
                      className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                        state.roomCustomization.flooring === fl.id
                          ? 'border-pink-500 bg-pink-50 shadow-xs'
                          : 'border-pink-100 bg-white hover:border-pink-200'
                      }`}
                    >
                      <div className="text-2xl mb-1">{fl.emoji}</div>
                      <div className="text-xs font-bold text-gray-800">{fl.name}</div>
                      {state.roomCustomization.flooring === fl.id && (
                        <div className="text-[10px] text-pink-600 font-bold mt-1">Activo ✓</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pets' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200 text-xs text-pink-800">
                ¡Tus Dreamies adoptados pueden descansar en tu casita! Coloca alfombras y camitas para que jueguen contigo.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {state.dreamies
                  .filter((d) => d.adopted)
                  .map((d) => (
                    <div key={d.id} className="p-3.5 rounded-2xl bg-white border border-pink-100 shadow-xs flex items-center gap-3">
                      <span className="text-3xl p-2 rounded-2xl bg-pink-50 border border-pink-200">{d.emoji}</span>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-800">{d.customName || d.name}</h4>
                        <p className="text-xs text-gray-500">{d.title}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-pink-600 font-medium">
                          <span>Felicidad: {d.happiness}%</span>
                          <span>·</span>
                          <span>Amistad Lv.{d.friendshipLevel}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => gameState.setCompanion(d.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          d.isFollowing
                            ? 'bg-emerald-500 text-white'
                            : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                        }`}
                      >
                        {d.isFollowing ? 'Acompañando' : 'Llevar'}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'themes' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2">Temas de Habitación Prediseñados</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => gameState.setRoomCustomization({ theme: theme.id })}
                      className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all flex items-center gap-3 ${
                        state.roomCustomization.theme === theme.id
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-pink-100 bg-white hover:border-pink-200'
                      }`}
                    >
                      <span className="text-3xl">{theme.emoji}</span>
                      <div>
                        <div className="text-sm font-bold text-gray-800">{theme.name}</div>
                        <div className="text-xs text-gray-500">Muebles y paletas a juego</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2">Tono de Iluminación</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'warm', label: 'Cálido Natural', emoji: '☀️' },
                    { id: 'pastel_pink', label: 'Hada Rosada', emoji: '🌸' },
                    { id: 'cool_lavender', label: 'Mística Lavanda', emoji: '🌙' },
                    { id: 'candlelight', label: 'Vela Suave', emoji: '🕯️' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => gameState.setRoomCustomization({ lightingTone: l.id as any })}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold cursor-pointer ${
                        state.roomCustomization.lightingTone === l.id
                          ? 'border-pink-500 bg-pink-100 text-pink-800'
                          : 'border-pink-100 bg-white text-gray-700'
                      }`}
                    >
                      <div className="text-xl mb-1">{l.emoji}</div>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
