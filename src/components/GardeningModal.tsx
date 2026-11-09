import React, { useState } from 'react';
import { gameState, GameState } from '../game/gameState';
import { SeedType } from '../types/game';
import { soundEngine } from '../game/audio';

interface GardeningModalProps {
  onClose: () => void;
  state: GameState;
  onRefreshPlots?: () => void;
}

const SEED_CATALOG: { type: SeedType; name: string; emoji: string; growthTime: string; desc: string }[] = [
  { type: 'strawberry', name: 'Fresas de Ensueño', emoji: '🍓', growthTime: '25 seg', desc: 'Frutas tiernas con sabor a pastel de vainilla.' },
  { type: 'sakura_blossom', name: 'Cerezos Sagrados', emoji: '🌸', growthTime: '30 seg', desc: 'Desprenden pétalos mágicos al florecer.' },
  { type: 'star_lily', name: 'Lirio Estelar', emoji: '⭐', growthTime: '35 seg', desc: 'Brillan como pequeñas cometas en la tierra.' },
  { type: 'marshmallow_bloom', name: 'Flor de Malvavisco', emoji: '🍬', growthTime: '40 seg', desc: 'Suave y esponjosa como algodón de azúcar.' },
];

export const GardeningModal: React.FC<GardeningModalProps> = ({
  onClose,
  state,
  onRefreshPlots,
}) => {
  const [selectedSeed, setSelectedSeed] = useState<SeedType>('strawberry');

  const handlePlant = (plotId: number) => {
    const success = gameState.plantSeed(plotId, selectedSeed);
    if (success && onRefreshPlots) onRefreshPlots();
  };

  const handleWater = (plotId: number) => {
    gameState.waterPlot(plotId);
    if (onRefreshPlots) onRefreshPlots();
  };

  const handleHarvest = (plotId: number) => {
    const success = gameState.harvestPlot(plotId);
    if (success && onRefreshPlots) onRefreshPlots();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍓</span>
            <div>
              <h2 className="text-base font-bold text-pink-900 leading-tight">Huerto Mágico de Strawberry Village</h2>
              <p className="text-[11px] text-pink-600 font-medium">Planta, riega y cosecha para devolver el color al mundo</p>
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

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Seed Pouch */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bolsa de Semillas</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SEED_CATALOG.map((seed) => {
                const count = state.seeds[seed.type] || 0;
                return (
                  <button
                    key={seed.type}
                    onClick={() => {
                      soundEngine.playUiPop();
                      setSelectedSeed(seed.type);
                    }}
                    className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between ${
                      selectedSeed === seed.type
                        ? 'border-pink-500 bg-pink-50 shadow-xs'
                        : 'border-pink-100 bg-white hover:border-pink-200'
                    }`}
                  >
                    <div>
                      <span className="text-2xl mb-1 block">{seed.emoji}</span>
                      <div className="text-xs font-bold text-gray-800 leading-tight">{seed.name}</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-pink-600">x{count} disponibles</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6 Garden Plots */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tus 6 Parcelas de Cultivo</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {state.gardenPlots.map((plot) => (
                <div
                  key={plot.id}
                  className="p-3.5 rounded-2xl bg-amber-50/70 border-2 border-amber-200 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">Parcela #{plot.id + 1}</span>
                    {plot.watered && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 font-bold">
                        💧 Regado
                      </span>
                    )}
                  </div>

                  <div className="my-3 text-center">
                    {plot.plantedSeed ? (
                      <div>
                        <div className="text-3xl animate-pulse">
                          {plot.isReady
                            ? SEED_CATALOG.find((s) => s.type === plot.plantedSeed)?.emoji
                            : '🌱'}
                        </div>
                        <div className="text-[11px] font-bold text-gray-700 mt-1">
                          {plot.isReady
                            ? '¡Listo para cosechar!'
                            : `Creciendo: ${Math.round(plot.growthProgress * 100)}%`}
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-amber-200 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, plot.growthProgress * 100)}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 text-xs text-amber-700/60 italic">Tierra fértil vacía</div>
                    )}
                  </div>

                  {/* Plot Actions */}
                  <div>
                    {!plot.plantedSeed ? (
                      <button
                        onClick={() => handlePlant(plot.id)}
                        disabled={(state.seeds[selectedSeed] || 0) <= 0}
                        className="w-full py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white font-bold text-xs cursor-pointer transition-all"
                      >
                        Sembrar {SEED_CATALOG.find((s) => s.type === selectedSeed)?.emoji}
                      </button>
                    ) : plot.isReady ? (
                      <button
                        onClick={() => handleHarvest(plot.id)}
                        className="w-full py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
                      >
                        ¡Cosechar! ✨
                      </button>
                    ) : !plot.watered ? (
                      <button
                        onClick={() => handleWater(plot.id)}
                        className="w-full py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs cursor-pointer transition-all"
                      >
                        Regar con Amor 💧
                      </button>
                    ) : (
                      <div className="text-center text-[10px] text-gray-400 font-medium">Brotando suavemente...</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
