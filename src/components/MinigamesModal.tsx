import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { gameState, GameState } from '../game/gameState';
import { MinigameId } from '../types/game';
import { soundEngine } from '../game/audio';

interface MinigamesModalProps {
  onClose: () => void;
  state: GameState;
}

export const MinigamesModal: React.FC<MinigamesModalProps> = ({ onClose, state }) => {
  const [activeGame, setActiveGame] = useState<MinigameId | null>(null);

  // Minigame 1: Pesca de Estrellas
  const [starsCaught, setStarsCaught] = useState(0);
  const [starTimer, setStarTimer] = useState(15);
  const [fallingStars, setFallingStars] = useState<{ id: number; x: number; y: number }[]>([]);

  // Minigame 2: Cocina de Postres
  const [cookingScore, setCookingScore] = useState(0);
  const [targetRecipe, setTargetRecipe] = useState<string[]>(['🍓 Fresa', '🧁 Bizcocho', '🥛 Nata']);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  // Minigame 3: Carrera de Conejitos
  const [racePos, setRacePos] = useState(0);
  const [raceObstacle, setRaceObstacle] = useState(60);
  const [raceScore, setRaceScore] = useState(0);
  const [raceGameOver, setRaceGameOver] = useState(false);

  // Minigame 4: Rompecabezas
  const [puzzleTiles, setPuzzleTiles] = useState<number[]>([1, 3, 0, 2]);
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  // Minigame 5: Baile Musical
  const [danceBeat, setDanceBeat] = useState<number>(0);
  const [danceScore, setDanceScore] = useState(0);
  const [danceTarget, setDanceTarget] = useState<string>('ArrowUp');

  // Star fishing timer
  useEffect(() => {
    if (activeGame !== 'star_fishing') return;

    const interval = setInterval(() => {
      setStarTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          gameState.recordMinigameResult('star_fishing', starsCaught * 10, 35);
          return 0;
        }
        return prev - 1;
      });

      // Spawn falling star
      if (Math.random() > 0.3) {
        setFallingStars((prev) => [
          ...prev.slice(-6),
          {
            id: Date.now() + Math.random(),
            x: 10 + Math.random() * 80,
            y: 10 + Math.random() * 70,
          },
        ]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeGame, starsCaught]);

  const catchStar = (id: number) => {
    soundEngine.playHarvest();
    setStarsCaught((c) => c + 1);
    setFallingStars((prev) => prev.filter((s) => s.id !== id));
  };

  // Cooking ingredient selection
  const addIngredient = (ing: string) => {
    soundEngine.playUiPop();
    const next = [...selectedIngredients, ing];
    setSelectedIngredients(next);

    if (next.length === targetRecipe.length) {
      const match = next.every((val, index) => val === targetRecipe[index]);
      if (match) {
        soundEngine.playFanfare();
        setCookingScore((s) => s + 50);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      } else {
        soundEngine.playFootstep();
      }
      setSelectedIngredients([]);
    }
  };

  // Bunny race jump
  const jumpBunny = () => {
    if (raceGameOver) return;
    soundEngine.playJump();
    setRaceScore((s) => s + 20);
    setRacePos((p) => p + 15);
    if (racePos > 120) {
      soundEngine.playFanfare();
      setRaceGameOver(true);
      gameState.recordMinigameResult('bunny_race', raceScore + 50, 40);
    }
  };

  // Puzzle tile swap
  const swapTile = (idx: number) => {
    soundEngine.playUiPop();
    const next = [...puzzleTiles];
    const emptyIdx = next.indexOf(0);
    next[emptyIdx] = next[idx];
    next[idx] = 0;
    setPuzzleTiles(next);

    const isSolved = next.slice(0, 3).every((val, i) => val === i + 1);
    if (isSolved && !puzzleSolved) {
      setPuzzleSolved(true);
      soundEngine.playFanfare();
      gameState.recordMinigameResult('pastel_puzzle', 200, 50);
      confetti({ particleCount: 60, spread: 60 });
    }
  };

  // Dance beat press
  const pressDanceKey = (key: string) => {
    if (key === danceTarget) {
      soundEngine.playHarvest();
      setDanceScore((s) => s + 30);
      const keys = ['ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'];
      setDanceTarget(keys[Math.floor(Math.random() * keys.length)]);
      setDanceBeat((b) => b + 1);
    } else {
      soundEngine.playFootstep();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎮</span>
            <div>
              <h2 className="text-lg font-bold text-pink-900 leading-tight">Salón de Minijuegos</h2>
              <p className="text-xs text-pink-600 font-medium">Juega, gana Esencia de Sueño y compite por récords</p>
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

        {/* Minigames Selector / Active View */}
        {!activeGame ? (
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'star_fishing',
                  title: '⭐ Pesca de Estrellas',
                  desc: 'Atrapa las estrellas fugaces antes de que caigan al lago.',
                  highScore: state.highScores.star_fishing || 0,
                  emoji: '🎣',
                },
                {
                  id: 'dessert_cooking',
                  title: '🧁 Cocina de Postres',
                  desc: 'Ensambla dulces recetas kawaii siguiendo los pedidos de Pompon.',
                  highScore: state.highScores.dessert_cooking || 0,
                  emoji: '🍰',
                },
                {
                  id: 'bunny_race',
                  title: '🐰 Carrera de Conejitos',
                  desc: 'Salta obstáculos de fresas para cruzar la meta primero.',
                  highScore: state.highScores.bunny_race || 0,
                  emoji: '🏁',
                },
                {
                  id: 'pastel_puzzle',
                  title: '🧩 Rompecabezas Pastel',
                  desc: 'Ordena los fragmentos de postales del jardín mágico.',
                  highScore: state.highScores.pastel_puzzle || 0,
                  emoji: '🖼️',
                },
                {
                  id: 'rhythm_dance',
                  title: '🎶 Baile Musical',
                  desc: 'Sigue el compás de la cajita musical con ritmo perfecto.',
                  highScore: state.highScores.rhythm_dance || 0,
                  emoji: '💃',
                },
              ].map((game) => (
                <div
                  key={game.id}
                  className="p-4 rounded-3xl bg-pink-50/70 border border-pink-200 hover:border-pink-300 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-4xl p-2.5 rounded-2xl bg-white border border-pink-100 shadow-xs">
                      {game.emoji}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">{game.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{game.desc}</p>
                      <div className="text-[11px] font-semibold text-pink-600 mt-2">
                        Récord: <strong className="text-pink-700">{game.highScore} pts</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      soundEngine.playFanfare();
                      setActiveGame(game.id as MinigameId);
                      setStarTimer(15);
                      setStarsCaught(0);
                      setCookingScore(0);
                      setRacePos(0);
                      setRaceGameOver(false);
                      setPuzzleSolved(false);
                    }}
                    className="mt-3 w-full py-2 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  >
                    ¡Jugar Ahora! ♡
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 flex-1 flex flex-col justify-between">
            {/* Top Bar inside Minigame */}
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <button
                onClick={() => setActiveGame(null)}
                className="text-xs font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 cursor-pointer"
              >
                ← Volver a Minijuegos
              </button>
            </div>

            {/* Game 1: Star Fishing */}
            {activeGame === 'star_fishing' && (
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="text-center mb-3">
                  <div className="text-xs text-gray-500 font-bold uppercase">Tiempo Restante: {starTimer}s</div>
                  <div className="text-2xl font-bold text-pink-600">Estrellas Atrapadas: {starsCaught} ⭐</div>
                </div>

                <div className="relative w-full h-56 rounded-3xl bg-gradient-to-b from-sky-900 to-indigo-900 border-2 border-pink-300 overflow-hidden select-none">
                  {fallingStars.map((star) => (
                    <button
                      key={star.id}
                      onClick={() => catchStar(star.id)}
                      style={{ top: `${star.y}%`, left: `${star.x}%` }}
                      className="absolute text-3xl cursor-pointer hover:scale-125 transition-transform animate-pulse"
                    >
                      ⭐
                    </button>
                  ))}
                  {starTimer === 0 && (
                    <div className="absolute inset-0 bg-pink-900/80 flex flex-col items-center justify-center text-white">
                      <div className="text-2xl font-bold">¡Tiempo Terminado!</div>
                      <div className="text-sm mt-1">Puntuación: {starsCaught * 10} pts</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Game 2: Dessert Cooking */}
            {activeGame === 'dessert_cooking' && (
              <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 font-bold">Puntuación: {cookingScore} pts</div>
                  <h3 className="text-sm font-bold text-pink-700 mt-1">Receta Actual:</h3>
                  <div className="flex gap-2 justify-center mt-1">
                    {targetRecipe.map((ing, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedIngredients.map((ing, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-2xl bg-white border border-pink-300 text-xs font-bold animate-bounce">
                      {ing}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                  {['🍓 Fresa', '🧁 Bizcocho', '🥛 Nata', '🍫 Chocolate', '🍒 Cereza'].map((ing) => (
                    <button
                      key={ing}
                      onClick={() => addIngredient(ing)}
                      className="px-4 py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-xs font-bold text-gray-800 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                    >
                      {ing}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Game 3: Bunny Race */}
            {activeGame === 'bunny_race' && (
              <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-pink-700">Progreso de la Carrera: {racePos} / 120m</div>
                  <div className="text-xs text-gray-500">Puntuación: {raceScore} pts</div>
                </div>

                {/* Track */}
                <div className="relative w-full h-24 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-100 to-emerald-100 border border-pink-200 flex items-center px-4 overflow-hidden">
                  <div
                    className="text-4xl transition-all duration-300 transform"
                    style={{ marginLeft: `${Math.min(85, (racePos / 120) * 85)}%` }}
                  >
                    🐰
                  </div>
                  <div className="absolute right-4 text-3xl">🏁</div>
                </div>

                <button
                  onClick={jumpBunny}
                  disabled={raceGameOver}
                  className="px-8 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white font-bold text-sm shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  {raceGameOver ? '¡Carrera Ganada! 🏆' : '¡Saltar hacia adelante! 🐇'}
                </button>
              </div>
            )}

            {/* Game 4: Pastel Puzzle */}
            {activeGame === 'pastel_puzzle' && (
              <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-3">
                <div className="text-xs font-bold text-gray-500 uppercase">Ordena los azulejos de ensueño (1, 2, 3)</div>
                <div className="grid grid-cols-2 gap-2 w-48 h-48 p-2 rounded-3xl bg-pink-100 border-2 border-pink-300">
                  {puzzleTiles.map((tile, idx) => (
                    <button
                      key={idx}
                      onClick={() => swapTile(idx)}
                      className={`rounded-2xl font-bold text-xl flex items-center justify-center shadow-xs cursor-pointer transition-all ${
                        tile === 0
                          ? 'bg-pink-50 border border-dashed border-pink-300 text-transparent'
                          : 'bg-white border-2 border-pink-300 text-pink-700 hover:scale-105'
                      }`}
                    >
                      {tile !== 0 && (
                        <span>
                          {tile === 1 && '🌸 1'}
                          {tile === 2 && '🍓 2'}
                          {tile === 3 && '⭐ 3'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {puzzleSolved && (
                  <div className="text-sm font-bold text-emerald-600 animate-bounce">
                    ¡Rompecabezas Completado con Éxito! ✨
                  </div>
                )}
              </div>
            )}

            {/* Game 5: Rhythm Dance */}
            {activeGame === 'rhythm_dance' && (
              <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-pink-700">Puntos de Baile: {danceScore}</div>
                  <div className="text-xs text-gray-500">¡Presiona la flecha que coincida con el ritmo!</div>
                </div>

                <div className="text-6xl p-5 rounded-3xl bg-pink-50 border-2 border-pink-300 shadow-md animate-pulse">
                  {danceTarget === 'ArrowUp' && '⬆️'}
                  {danceTarget === 'ArrowLeft' && '⬅️'}
                  {danceTarget === 'ArrowRight' && '➡️'}
                  {danceTarget === 'ArrowDown' && '⬇️'}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'ArrowLeft', emoji: '⬅️' },
                    { key: 'ArrowUp', emoji: '⬆️' },
                    { key: 'ArrowDown', emoji: '⬇️' },
                    { key: 'ArrowRight', emoji: '➡️' },
                  ].map((btn) => (
                    <button
                      key={btn.key}
                      onClick={() => pressDanceKey(btn.key)}
                      className="w-12 h-12 rounded-2xl bg-white border border-pink-200 text-xl font-bold shadow-xs hover:bg-pink-100 active:scale-95 transition-all cursor-pointer"
                    >
                      {btn.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
