import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { gameState, GameState } from '../game/gameState';
import { JobType } from '../types/game';
import { soundEngine } from '../game/audio';

interface JobsModalProps {
  onClose: () => void;
  state: GameState;
}

export const JobsModal: React.FC<JobsModalProps> = ({ onClose, state }) => {
  const [selectedJob, setSelectedJob] = useState<JobType>('cafe');
  const [isWorking, setIsWorking] = useState(false);
  const [workStep, setWorkStep] = useState(0);

  const currentJob = state.jobs.find((j) => j.id === selectedJob) || state.jobs[0];

  const startShift = () => {
    setIsWorking(true);
    setWorkStep(1);
    soundEngine.playHarvest();

    // 3-step interactive shift
    setTimeout(() => {
      setWorkStep(2);
      soundEngine.playWater();
    }, 900);

    setTimeout(() => {
      setWorkStep(3);
      soundEngine.playUiPop();
    }, 1800);

    setTimeout(() => {
      setIsWorking(false);
      setWorkStep(0);
      gameState.completeJobShift(selectedJob, 45);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f472b6', '#fef08a', '#93c5fd'],
      });
    }, 2600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🍰</span>
            <div>
              <h2 className="text-lg font-bold text-pink-900 leading-tight">Trabajos y Profesiones de Ensueño</h2>
              <p className="text-xs text-pink-600 font-medium">Trabaja en la cafetería, pastelería, floristería, taller y veterinaria</p>
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

        {/* Job Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-4 bg-pink-50/50 border-b border-pink-100">
          {state.jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => {
                soundEngine.playUiPop();
                setSelectedJob(job.id);
              }}
              className={`p-2.5 rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center gap-1 ${
                selectedJob === job.id
                  ? 'bg-white shadow-xs border-2 border-pink-400 scale-105'
                  : 'hover:bg-white/60 border border-transparent opacity-80'
              }`}
            >
              <span className="text-2xl">{job.emoji}</span>
              <span className="text-[11px] font-bold text-gray-800 leading-tight truncate w-full">
                {job.title.split(' ')[0]}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold">
                Lv. {job.level}
              </span>
            </button>
          ))}
        </div>

        {/* Active Job Workplace Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-3xl bg-pink-50/60 border border-pink-200">
              <span className="text-5xl p-3 rounded-2xl bg-white border border-pink-100 shadow-xs">
                {currentJob.emoji}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-800">{currentJob.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">
                    Nivel {currentJob.level}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{currentJob.description}</p>

                {/* XP Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-bold text-pink-700 mb-1">
                    <span>Experiencia</span>
                    <span>{currentJob.xp} / {currentJob.level * 100} XP</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-pink-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (currentJob.xp / (currentJob.level * 100)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 mt-2 font-medium">
                  Turnos completados: <strong className="text-gray-800">{currentJob.shiftsDone}</strong>
                </div>
              </div>
            </div>

            {/* Task Preview */}
            <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-2">
              <h4 className="text-xs font-bold text-pink-800 uppercase tracking-wider">
                Pedidos de los Clientes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {selectedJob === 'cafe' && (
                  <>
                    <div className="p-2.5 rounded-xl bg-pink-50/80 border border-pink-200">🧋 Boba de Fresa con Nubes</div>
                    <div className="p-2.5 rounded-xl bg-sky-50/80 border border-sky-200">☕ Matcha Latte de Lavanda</div>
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">🧁 Batido de Caramelo Dulce</div>
                  </>
                )}
                {selectedJob === 'bakery' && (
                  <>
                    <div className="p-2.5 rounded-xl bg-pink-50/80 border border-pink-200">🍓 Tarta de Fresas Tiernas</div>
                    <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200">🧁 Cupcake con Chispas Mágicas</div>
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">🍪 Galletitas de Estrella</div>
                  </>
                )}
                {selectedJob === 'florist' && (
                  <>
                    <div className="p-2.5 rounded-xl bg-pink-50/80 border border-pink-200">🌸 Ramo de Cerezos Sagrados</div>
                    <div className="p-2.5 rounded-xl bg-yellow-50/80 border border-yellow-200">⭐ Corona de Lirios Estelares</div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200">🌿 Corona de Musgo Pastel</div>
                  </>
                )}
                {selectedJob === 'plushie_shop' && (
                  <>
                    <div className="p-2.5 rounded-xl bg-pink-50/80 border border-pink-200">🐰 Peluche de Conejo Mochi</div>
                    <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200">🧸 Osito de Felpa Azul</div>
                    <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200">🐱 Gatito Nube con Cascabel</div>
                  </>
                )}
                {selectedJob === 'vet' && (
                  <>
                    <div className="p-2.5 rounded-xl bg-sky-50/80 border border-sky-200">🛁 Baño con Esponja de Corazón</div>
                    <div className="p-2.5 rounded-xl bg-pink-50/80 border border-pink-200">🩹 Curar Raspón en la Patita</div>
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">💖 Cepillado de Pelaje Esponjoso</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Shift CTA */}
          <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
            <div className="text-xs text-gray-500 font-medium">
              Recompensa por turno: <strong className="text-pink-600 font-bold">+45 ✨ y +4% Color</strong>
            </div>

            <button
              onClick={startShift}
              disabled={isWorking}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-pink-300/50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              {isWorking ? (
                <>
                  <span className="animate-spin">🌀</span>
                  <span>
                    {workStep === 1 && 'Preparando ingredientes...'}
                    {workStep === 2 && 'Ensamblando con magia...'}
                    {workStep === 3 && '¡Decorando con brillitos! ✨'}
                  </span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Comenzar Turno de Trabajo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
