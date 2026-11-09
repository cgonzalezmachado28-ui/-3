import React from 'react';
import { soundEngine } from '../game/audio';

interface CreditsModalProps {
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-lg bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="text-base font-bold text-pink-900 leading-tight">Créditos & La Historia de Dreamyland</h2>
              <p className="text-[11px] text-pink-600 font-medium">El jardín de los sueños · visualizee.ai</p>
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

        {/* Story Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-700 leading-relaxed font-sans">
          <div className="p-4 rounded-2xl bg-pink-50/80 border border-pink-200">
            <h3 className="font-bold text-pink-800 text-sm mb-1">🌷 La Leyenda de los Dreamies</h3>
            <p>
              Despiertas en un mundo mágico llamado <strong>Dreamyland</strong>, donde los anhelos y recuerdos puros de las personas se convierten en pequeñas criaturas llamadas <strong>Dreamies</strong>.
            </p>
            <p className="mt-2">
              Cuando los colores del mundo comenzaron a desvanecerse, los pequeños amigos esperaron la llegada de un soñador que les devolviera la magia con amor, cuidados y flores de fresa.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <h3 className="font-bold text-amber-900 text-sm mb-1">♡ The Forgotten Room (Mundo Secreto)</h3>
            <p className="italic">
              "Existe un rincón sellado donde los colores son apagados como té con leche, habitado por muñecos antiguos y una cajita musical dorada... Nadie sabe quién lo creó, pero guarda los sueños de aquellos que creyeron haber olvidado su infancia."
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
            <h3 className="font-bold text-purple-900 text-xs uppercase tracking-wider mb-2">Estética & Dirección Artística</h3>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-full bg-pink-100 text-pink-800">Cutecore</span>
              <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">Kawaii</span>
              <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">Dreamcore</span>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">Pastelcore</span>
            </div>
          </div>

          <div className="text-center pt-2 text-[11px] text-gray-400 font-medium">
            Creado con amor para soñadores de todo el mundo · (๑˃ᴗ˂)ﻭ 💕
          </div>
        </div>
      </div>
    </div>
  );
};
