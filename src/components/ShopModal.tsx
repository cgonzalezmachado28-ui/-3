import React from 'react';
import { gameState, GameState } from '../game/gameState';
import { SeedType } from '../types/game';
import { soundEngine } from '../game/audio';

interface ShopModalProps {
  onClose: () => void;
  state: GameState;
}

const SHOP_ITEMS = [
  { id: 'seeds_strawberry', name: 'Pack 3x Semillas de Fresa', type: 'seed', seedType: 'strawberry', cost: 15, emoji: '🍓', desc: 'Fresas dulces y jugosas de crecimiento rápido.' },
  { id: 'seeds_sakura', name: 'Pack 2x Semillas de Sakura', type: 'seed', seedType: 'sakura_blossom', cost: 25, emoji: '🌸', desc: 'Flores de cerezo rosadas con néctar sagrado.' },
  { id: 'seeds_star', name: 'Pack 2x Semillas de Lirio Estelar', type: 'seed', seedType: 'star_lily', cost: 35, emoji: '⭐', desc: 'Brillan en la oscuridad con luz dorada.' },
  { id: 'seeds_marshmallow', name: 'Pack 2x Semillas de Malvavisco', type: 'seed', seedType: 'marshmallow_bloom', cost: 40, emoji: '🍬', desc: 'Flores tiernas que huelen a azúcar hilado.' },
  { id: 'color_potion', name: 'Poción de Color Radiante', type: 'potion', cost: 50, emoji: '🧪', desc: 'Restaura instantáneamente un +15% de color a Dreamyland.' },
  { id: 'golden_ribbon', name: 'Lazo Dorado Exclusivo', type: 'accessory', cost: 60, emoji: '🎀', desc: 'Accesorio brillante para tu mascota favorita.' },
];

export const ShopModal: React.FC<ShopModalProps> = ({ onClose, state }) => {
  const buyItem = (item: typeof SHOP_ITEMS[0]) => {
    if (state.dreamEssence < item.cost) return;

    if (item.type === 'seed' && item.seedType) {
      gameState.spendDreamEssence(item.cost);
      state.seeds[item.seedType as SeedType] = (state.seeds[item.seedType as SeedType] || 0) + (item.id.includes('3x') ? 3 : 2);
      soundEngine.playHarvest();
    } else if (item.type === 'potion') {
      gameState.spendDreamEssence(item.cost);
      gameState.addColorMagic(15);
      soundEngine.playFanfare();
    } else {
      gameState.spendDreamEssence(item.cost);
      soundEngine.playFanfare();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🛍️</span>
            <div>
              <h2 className="text-lg font-bold text-pink-900 leading-tight">Boutique de Ensueño</h2>
              <p className="text-xs text-pink-600 font-medium">Semillas mágicas, muebles exclusivos y pociones</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200">
              {state.dreamEssence} ✨ Esencia
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
        </div>

        {/* Shop Items List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SHOP_ITEMS.map((item) => {
              const canAfford = state.dreamEssence >= item.cost;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-3xl bg-pink-50/50 border border-pink-200 hover:border-pink-300 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-4xl p-2.5 rounded-2xl bg-white border border-pink-100 shadow-xs">
                      {item.emoji}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-pink-100">
                    <span className="text-xs font-bold text-pink-700">{item.cost} ✨</span>
                    <button
                      onClick={() => buyItem(item)}
                      disabled={!canAfford}
                      className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white font-bold text-xs shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
                    >
                      Comprar ♡
                    </button>
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
