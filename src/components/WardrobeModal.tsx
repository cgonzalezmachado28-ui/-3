import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { gameState, GameState } from '../game/gameState';
import { OutfitConfig } from '../types/game';
import { soundEngine } from '../game/audio';

interface WardrobeModalProps {
  onClose: () => void;
  state: GameState;
  onRefreshPlayerModel?: () => void;
}

const HAIR_STYLES = [
  { id: 'twintails', name: 'Coletas Dobles', emoji: '🎀' },
  { id: 'bob', name: 'Bob con Flequillo', emoji: '💇‍♀️' },
  { id: 'fluffy', name: 'Ondas Esponjosas', emoji: '✨' },
  { id: 'hime_cut', name: 'Corte Hime Princesa', emoji: '👑' },
  { id: 'messy_buns', name: 'Moños Dobles Cute', emoji: '🍡' },
];

const HAIR_COLORS = [
  { id: '#f9a8d4', name: 'Rosa Pastel', color: '#f9a8d4' },
  { id: '#fbcfe8', name: 'Algodón de Azúcar', color: '#fbcfe8' },
  { id: '#e9d5ff', name: 'Lavanda Niebla', color: '#e9d5ff' },
  { id: '#bae6fd', name: 'Celeste Nube', color: '#bae6fd' },
  { id: '#fef08a', name: 'Rubio Caramelo', color: '#fef08a' },
  { id: '#fed7aa', name: 'Melocotón Miel', color: '#fed7aa' },
  { id: '#ffffff', name: 'Blanco Nieve', color: '#ffffff' },
  { id: '#475569', name: 'Gris Grafito', color: '#475569' },
];

const HEADWEAR = [
  { id: 'bunny_ears', name: 'Orejas de Conejito', emoji: '🐰' },
  { id: 'strawberry_beret', name: 'Boina de Fresa Dulce', emoji: '🍓' },
  { id: 'sakura_bow', name: 'Lazo de Cerezo', emoji: '🌸' },
  { id: 'star_halo', name: 'Aureola de Estrellas', emoji: '⭐' },
  { id: 'antique_bonnet', name: 'Bonete Victoriano de Encaje', emoji: '🎀' },
  { id: 'none', name: 'Sin Accesorio', emoji: '✖️' },
];

const DRESSES = [
  { id: 'strawberry_lolita', name: 'Vestido Lolita Fresa', emoji: '👗', desc: 'Encaje blanco y lazos de fresa' },
  { id: 'cloud_overalls', name: 'Peto de Nube Pastel', emoji: '👖', desc: 'Cómodo, esponjoso y tierno' },
  { id: 'sakura_kimono', name: 'Kimono de Flor de Cerezo', emoji: '👘', desc: 'Seda rosada con obi dorado' },
  { id: 'pastel_sailor', name: 'Uniforme Marinero Pastel', emoji: '🎀', desc: 'Cuello marinero con lazo dulce' },
  { id: 'vintage_pinafore', name: 'Pichi Victoriano Dreamcore', emoji: '🗝️', desc: 'Muted vintage con encaje antiguo' },
  { id: 'fairy_tulle', name: 'Vestido de Tul de Hada', emoji: '🧚‍♀️', desc: 'Capas translúcidas iridiscentes' },
];

const DRESS_COLORS = [
  { id: '#f472b6', name: 'Rosa Cerezo', color: '#f472b6' },
  { id: '#fb7185', name: 'Fresa Viva', color: '#fb7185' },
  { id: '#c084fc', name: 'Lavanda Dulce', color: '#c084fc' },
  { id: '#60a5fa', name: 'Cielo Estival', color: '#60a5fa' },
  { id: '#34d399', name: 'Menta Pastel', color: '#34d399' },
  { id: '#fbbf24', name: 'Vainilla Solar', color: '#fbbf24' },
  { id: '#d5bdaf', name: 'Crema Vintage', color: '#d5bdaf' },
];

const WINGS = [
  { id: 'angel_wings', name: 'Alas de Ángel de Algodón', emoji: '🪽' },
  { id: 'fairy_wings', name: 'Alas de Hada Translúcidas', emoji: '🧚‍♀️' },
  { id: 'backpack', name: 'Mochilita de Fresa', emoji: '🎒' },
  { id: 'star_wand', name: 'Varita Mágica de Estrella', emoji: '🪄' },
  { id: 'ribbon_cape', name: 'Capa con Lazo de Satén', emoji: '🎀' },
  { id: 'none', name: 'Ninguno', emoji: '✖️' },
];

const MAKEUPS = [
  { id: 'heart_blush', name: 'Rubor de Corazoncitos', emoji: '💖' },
  { id: 'star_freckles', name: 'Pecas de Polvo Estelar', emoji: '✨' },
  { id: 'glitter_cheeks', name: 'Purpurina Pastel', emoji: '🌟' },
  { id: 'bunny_nose', name: 'Nariz de Conejito Dulce', emoji: '🐰' },
  { id: 'natural', name: 'Mejillas Suaves Naturales', emoji: '🌸' },
];

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  onClose,
  state,
  onRefreshPlayerModel,
}) => {
  const [activeCategory, setActiveCategory] = useState<'hair' | 'headwear' | 'dress' | 'wings' | 'makeup'>('dress');
  const [fashionShowRunning, setFashionShowRunning] = useState(false);
  const [showScore, setShowScore] = useState<number | null>(null);

  const outfit = state.outfit;

  const handleUpdate = (update: Partial<OutfitConfig>) => {
    gameState.updateOutfit(update);
    if (onRefreshPlayerModel) onRefreshPlayerModel();
  };

  const startFashionShow = () => {
    setFashionShowRunning(true);
    soundEngine.playFanfare();

    setTimeout(() => {
      soundEngine.playHarvest();
    }, 1000);

    setTimeout(() => {
      // Climax: judges award score!
      const score = 95 + Math.floor(Math.random() * 6); // 95 - 100
      setShowScore(score);
      soundEngine.playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffb7c5', '#f472b6', '#e0f2fe', '#fef08a'],
      });
      gameState.unlockAchievement('ach_fashion_star');
      gameState.addDreamEssence(50);
      gameState.addColorMagic(5);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">👗</span>
            <div>
              <h2 className="text-lg font-bold text-pink-900 leading-tight">Estudio de Moda & Outfits Pastel</h2>
              <p className="text-xs text-pink-600 font-medium">Personaliza peinados, vestidos, alas, moños y maquillaje</p>
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

        {/* Fashion Show Overlay Modal if active */}
        {fashionShowRunning && (
          <div className="absolute inset-0 z-30 bg-pink-900/80 flex flex-col items-center justify-center p-6 text-white text-center">
            {showScore === null ? (
              <div className="space-y-4 animate-pulse">
                <span className="text-6xl animate-bounce">✨👗✨</span>
                <h3 className="text-2xl font-bold tracking-wide">¡Desfile de Moda en la Pasarela de Ensueño!</h3>
                <p className="text-sm text-pink-200">Los Dreamies aplauden tu estilo único...</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-md bg-white text-gray-800 p-6 rounded-3xl shadow-2xl border-4 border-pink-300">
                <span className="text-5xl">👑🎀🏆</span>
                <h3 className="text-2xl font-bold text-pink-600">¡Calificación de los Jueces!</h3>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">
                  {showScore} / 100 Puntos
                </div>
                <p className="text-xs text-gray-600">
                  ¡Pompon y Celeste están maravillados con tu combinación de colores y encaje! Has ganado 50 Esencia de Sueño.
                </p>
                <button
                  onClick={() => {
                    setFashionShowRunning(false);
                    setShowScore(null);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 text-white font-bold text-sm shadow-md cursor-pointer hover:scale-105 transition-all"
                >
                  ¡Aceptar Premio! 💖
                </button>
              </div>
            )}
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex border-b border-pink-100 px-6 gap-2 bg-pink-50/50 overflow-x-auto">
          {[
            { id: 'dress', label: 'Vestidos & Faldas', emoji: '👗' },
            { id: 'hair', label: 'Cabello & Color', emoji: '💇‍♀️' },
            { id: 'headwear', label: 'Moños & Sombreros', emoji: '🎀' },
            { id: 'wings', label: 'Alas & Mochilas', emoji: '🪽' },
            { id: 'makeup', label: 'Maquillaje Fantasía', emoji: '✨' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundEngine.playUiPop();
                setActiveCategory(cat.id as any);
              }}
              className={`py-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-pink-500'
              }`}
            >
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeCategory === 'dress' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color del Vestido</h4>
                <div className="flex flex-wrap gap-2.5">
                  {DRESS_COLORS.map((dc) => (
                    <button
                      key={dc.id}
                      onClick={() => handleUpdate({ dressColor: dc.id })}
                      className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                        outfit.dressColor === dc.id ? 'border-pink-600 scale-110 shadow-xs' : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: dc.color }}
                      title={dc.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Diseños de Ropa</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DRESSES.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleUpdate({ dress: d.id as any })}
                      className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all flex items-center gap-3 ${
                        outfit.dress === d.id
                          ? 'border-pink-500 bg-pink-50/80 shadow-xs'
                          : 'border-pink-100 bg-white hover:border-pink-200'
                      }`}
                    >
                      <span className="text-3xl p-2 rounded-xl bg-pink-50">{d.emoji}</span>
                      <div>
                        <div className="text-sm font-bold text-gray-800">{d.name}</div>
                        <div className="text-xs text-gray-500">{d.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'hair' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color de Cabello</h4>
                <div className="flex flex-wrap gap-2.5">
                  {HAIR_COLORS.map((hc) => (
                    <button
                      key={hc.id}
                      onClick={() => handleUpdate({ hairColor: hc.id })}
                      className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                        outfit.hairColor === hc.id ? 'border-pink-600 scale-110 shadow-xs' : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: hc.color }}
                      title={hc.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estilo de Peinado</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {HAIR_STYLES.map((hs) => (
                    <button
                      key={hs.id}
                      onClick={() => handleUpdate({ hairStyle: hs.id as any })}
                      className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                        outfit.hairStyle === hs.id
                          ? 'border-pink-500 bg-pink-50 shadow-xs'
                          : 'border-pink-100 bg-white hover:border-pink-200'
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{hs.emoji}</span>
                      <span className="text-xs font-bold text-gray-800">{hs.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'headwear' && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Moños, Boinas y Aureolas</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {HEADWEAR.map((hw) => (
                  <button
                    key={hw.id}
                    onClick={() => handleUpdate({ headwear: hw.id as any })}
                    className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                      outfit.headwear === hw.id
                        ? 'border-pink-500 bg-pink-50 shadow-xs'
                        : 'border-pink-100 bg-white hover:border-pink-200'
                    }`}
                  >
                    <span className="text-3xl mb-1 block">{hw.emoji}</span>
                    <span className="text-xs font-bold text-gray-800">{hw.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'wings' && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Alas y Accesorios de Espalda</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {WINGS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleUpdate({ wings: w.id as any })}
                    className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                      outfit.wings === w.id
                        ? 'border-pink-500 bg-pink-50 shadow-xs'
                        : 'border-pink-100 bg-white hover:border-pink-200'
                    }`}
                  >
                    <span className="text-3xl mb-1 block">{w.emoji}</span>
                    <span className="text-xs font-bold text-gray-800">{w.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'makeup' && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Maquillaje Fantasía</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MAKEUPS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleUpdate({ makeup: m.id as any })}
                    className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all flex items-center gap-3 ${
                      outfit.makeup === m.id
                        ? 'border-pink-500 bg-pink-50 shadow-xs'
                        : 'border-pink-100 bg-white hover:border-pink-200'
                    }`}
                  >
                    <span className="text-3xl p-2 rounded-xl bg-pink-50">{m.emoji}</span>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{m.name}</div>
                      <div className="text-xs text-gray-500">Destellos y rubor dulce</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions: Runway Fashion Show CTA */}
        <div className="p-4 bg-pink-50/70 border-t border-pink-200 flex items-center justify-between">
          <div className="text-xs text-pink-700 font-medium">
            ¡Luce tu outfit ante los Dreamies de la aldea!
          </div>
          <button
            onClick={startFashionShow}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs shadow-md shadow-pink-300/50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>✨</span> ¡Desfile de Moda! 👑
          </button>
        </div>
      </div>
    </div>
  );
};
