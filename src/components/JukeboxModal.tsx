import React from 'react';
import { gameState, GameState } from '../game/gameState';
import { soundEngine } from '../game/audio';

interface JukeboxModalProps {
  onClose: () => void;
  state: GameState;
}

export const JukeboxModal: React.FC<JukeboxModalProps> = ({ onClose, state }) => {
  const currentTrack = state.musicTracks.find((t) => t.id === state.currentTrackId) || state.musicTracks[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-none pointer-events-auto">
      <div className="relative w-full max-w-md bg-white/95 rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-50 border-b border-pink-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎵</span>
            <div>
              <h2 className="text-base font-bold text-pink-900 leading-tight">Gramófono & Playlists</h2>
              <p className="text-[11px] text-pink-600 font-medium">Melodías de cajita musical y arpegios pastel</p>
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

        {/* Vinyl Player Centerpiece */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-b from-pink-50/50 to-white">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-pink-300 via-rose-300 to-pink-200 border-4 border-white shadow-lg flex items-center justify-center animate-spin [animation-duration:8s]">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-pink-300 flex items-center justify-center text-xl">
              🎶
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-800">{currentTrack.title}</h3>
            <p className="text-xs text-pink-600 font-medium">{currentTrack.artist}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => soundEngine.toggleMute()}
              className="px-4 py-2 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold cursor-pointer transition-all"
            >
              {soundEngine.getMuted() ? '🔇 Desmutear' : '🔊 Silenciar'}
            </button>
          </div>
        </div>

        {/* Tracks List */}
        <div className="p-5 border-t border-pink-100 space-y-2 overflow-y-auto max-h-56">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Canciones Desbloqueadas ({state.musicTracks.length})
          </div>

          {state.musicTracks.map((track) => (
            <button
              key={track.id}
              onClick={() => gameState.playTrack(track.id)}
              className={`w-full p-3 rounded-2xl text-left cursor-pointer transition-all flex items-center justify-between ${
                state.currentTrackId === track.id
                  ? 'bg-pink-100/80 border-2 border-pink-400 text-pink-800'
                  : 'bg-white hover:bg-pink-50/60 border border-pink-100 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{state.currentTrackId === track.id ? '▶️' : '🎵'}</span>
                <div>
                  <div className="text-xs font-bold">{track.title}</div>
                  <div className="text-[10px] text-gray-500">{track.artist}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-gray-400">{track.duration}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
