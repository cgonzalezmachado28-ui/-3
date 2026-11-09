import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { gameState } from '../game/gameState';
import { soundEngine } from '../game/audio';

interface DownloadModalProps {
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copiedLink, setCopiedLink] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'pc' | 'android' | 'ios'>('pc');

  const appUrl = window.location.href;

  const handleInstallClick = async () => {
    soundEngine.playFanfare();
    const success = await install();
    if (success) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
  };

  const copyUrl = () => {
    soundEngine.playUiPop();
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const exportSaveData = () => {
    soundEngine.playHarvest();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(gameState.getState(), null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'dreamyland_partida_guardada.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📥</span>
            <div>
              <h2 className="text-lg font-bold text-pink-900 leading-tight">¿Cómo Descargar & Instalar Dreamyland?</h2>
              <p className="text-xs text-pink-600 font-medium">Instálalo como app nativa en tu PC, Mac, Android o iPhone</p>
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-gray-800">
          {/* 1. Direct Install CTA if supported */}
          {isInstalled ? (
            <div className="p-4 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-1">
              <span className="text-3xl">🎉</span>
              <h3 className="text-sm font-bold text-emerald-800">¡Dreamyland ya está instalado como aplicación!</h3>
              <p className="text-xs text-emerald-700">
                Puedes abrirlo directamente desde tu escritorio o menú de aplicaciones sin barras de navegador.
              </p>
            </div>
          ) : isInstallable ? (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100 border-2 border-pink-300 text-center space-y-3 shadow-xs">
              <div className="text-3xl animate-bounce">🎀 📲 💻</div>
              <div>
                <h3 className="text-base font-bold text-pink-900">¡Tu navegador soporta instalación con 1 Clic!</h3>
                <p className="text-xs text-pink-700 mt-0.5">
                  Descárgalo e instálalo directamente para jugar en pantalla completa con icono propio.
                </p>
              </div>

              <button
                onClick={handleInstallClick}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-pink-300/50 hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2 border border-white"
              >
                <span>📥</span>
                <span>¡Instalar / Descargar App en mi Dispositivo!</span>
              </button>
            </div>
          ) : null}

          {/* 2. Step-by-Step Instructions by Platform */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Guía de Instalación según tu Dispositivo
            </h3>

            {/* Platform selector tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  soundEngine.playUiPop();
                  setActivePlatform('pc');
                }}
                className={`flex-1 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activePlatform === 'pc'
                    ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                    : 'bg-white text-gray-600 border-pink-100 hover:bg-pink-50'
                }`}
              >
                <span>💻</span> PC / Mac
              </button>

              <button
                onClick={() => {
                  soundEngine.playUiPop();
                  setActivePlatform('android');
                }}
                className={`flex-1 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activePlatform === 'android'
                    ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                    : 'bg-white text-gray-600 border-pink-100 hover:bg-pink-50'
                }`}
              >
                <span>🤖</span> Android
              </button>

              <button
                onClick={() => {
                  soundEngine.playUiPop();
                  setActivePlatform('ios');
                }}
                className={`flex-1 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activePlatform === 'ios'
                    ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                    : 'bg-white text-gray-600 border-pink-100 hover:bg-pink-50'
                }`}
              >
                <span>🍎</span> iPhone / iPad
              </button>
            </div>

            {/* Details per platform */}
            <div className="p-4 rounded-3xl bg-pink-50/60 border border-pink-200 text-xs space-y-2.5">
              {activePlatform === 'pc' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <p>
                      En <strong>Google Chrome</strong> o <strong>Microsoft Edge</strong>, mira el extremo derecho de la barra de direcciones arriba (donde está la URL).
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <p>
                      Verás un icono con forma de <strong>pantalla con flecha hacia abajo</strong> 🖥️ o un botón que dice <strong>"Instalar Dreamyland"</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <p>
                      Haz clic en <strong>"Instalar"</strong>. ¡Se creará un acceso directo en tu escritorio y barra de tareas como cualquier videojuego de PC!
                    </p>
                  </div>
                </>
              )}

              {activePlatform === 'android' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <p>
                      Abre el juego en tu navegador <strong>Chrome</strong> en tu celular o tablet.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <p>
                      Toca el menú de <strong>tres puntitos (⋮)</strong> en la esquina superior derecha.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <p>
                      Elige <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>. ¡Aparecerá el icono kawaii de fresa en tus apps!
                    </p>
                  </div>
                </>
              )}

              {activePlatform === 'ios' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <p>
                      Abre este enlace en el navegador <strong>Safari</strong> de tu iPhone o iPad.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <p>
                      Toca el botón <strong>Compartir</strong> (el icono de un cuadradito con flecha hacia arriba 📤) en la barra inferior de Safari.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <p>
                      Baja en el menú y selecciona <strong>"Agregar a la pantalla de inicio"</strong> ➕. ¡Podrás abrirlo a pantalla completa!
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 3. Link and Bookmark Access */}
          <div className="p-4 rounded-3xl bg-white border border-pink-200 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-pink-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>🔗</span> Enlace Permanente del Juego
            </h4>
            <p className="text-xs text-gray-600">
              Siempre puedes entrar directamente desde cualquier navegador web sin instalar nada:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="flex-1 px-3 py-2 rounded-xl border border-pink-200 bg-pink-50/50 text-xs font-mono text-gray-700 select-all"
              />
              <button
                onClick={copyUrl}
                className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs cursor-pointer transition-all"
              >
                {copiedLink ? '¡Copiado! ✓' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* 4. Export Save File Backup */}
          <div className="p-4 rounded-3xl bg-amber-50/50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-amber-900">💾 Respaldo de Partida Guardada</h4>
              <p className="text-[11px] text-amber-700">
                Descarga un archivo .json con tus casas, muebles, mascotas y progreso para nunca perderlos.
              </p>
            </div>
            <button
              onClick={exportSaveData}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs cursor-pointer transition-all whitespace-nowrap"
            >
              Exportar Datos 📁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
