import React from 'react';
import { gameState } from '../game/gameState';
import { soundEngine } from '../game/audio';

interface SettingsModalProps {
  onClose: () => void;
  onReturnToTitle?: () => void;
  onOpenDownload?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onReturnToTitle, onOpenDownload }) => {
  const isMuted = soundEngine.getMuted();

  const handleReset = () => {
    if (window.confirm('¿Deseas reiniciar tu aventura en Dreamyland? Se restaurarán todos los datos.')) {
      gameState.resetGame();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-md bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <div>
              <h2 className="text-base font-bold text-pink-900 leading-tight">Ajustes & Controles</h2>
              <p className="text-[11px] text-pink-600 font-medium">Configuración de sonido, juego y teclas</p>
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

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Audio Setting */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-pink-50/60 border border-pink-100">
            <div>
              <div className="text-xs font-bold text-gray-800">Música y Efectos de Sonido</div>
              <div className="text-[10px] text-gray-500">Sintetizador Web Audio procedural</div>
            </div>
            <button
              onClick={() => soundEngine.toggleMute()}
              className="px-3.5 py-1.5 rounded-xl bg-pink-500 text-white font-bold text-xs cursor-pointer hover:bg-pink-600 transition-all"
            >
              {isMuted ? '🔇 Desmutear' : '🔊 Silenciar'}
            </button>
          </div>

          {/* Controls Guide */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Guía de Teclas</h3>
            <div className="space-y-1.5 text-xs text-gray-700">
              <div className="flex justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
                <span>Mover Personaje</span>
                <span className="font-mono font-bold text-pink-700">W, A, S, D o Flechas</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
                <span>Saltar / Brincar</span>
                <span className="font-mono font-bold text-pink-700">Espacio</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
                <span>Interactuar / Hablar / Cosechar</span>
                <span className="font-mono font-bold text-pink-700">E</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
                <span>Pantalla Táctil</span>
                <span className="font-mono font-bold text-pink-700">Joystick flotante</span>
              </div>
            </div>
          </div>

          {/* Reset & Download Save Data */}
          <div className="pt-2 border-t border-pink-100 flex flex-col gap-2">
            {onOpenDownload && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDownload();
                }}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs shadow-md shadow-pink-300/40 cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <span>📥</span> Descargar / Instalar en mi Dispositivo
              </button>
            )}

            {onReturnToTitle && (
              <button
                onClick={() => {
                  onReturnToTitle();
                  onClose();
                }}
                className="w-full py-2.5 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-xs cursor-pointer transition-all"
              >
                🏠 Volver al Menú Principal
              </button>
            )}

            <button
              onClick={handleReset}
              className="w-full py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs border border-red-200 cursor-pointer transition-all"
            >
              ⚠️ Reiniciar Todos los Datos de la Partida
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
