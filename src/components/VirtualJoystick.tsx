import React, { useRef, useState, useEffect } from 'react';

interface VirtualJoystickProps {
  onMove: (x: number, z: number) => void;
  onJump: () => void;
  onInteract: () => void;
  canInteract: boolean;
  interactLabel?: string;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onMove,
  onJump,
  onInteract,
  canInteract,
  interactLabel,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging && e.type !== 'pointerdown') return;
    if (!joystickBaseRef.current) return;

    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxRadius = 40;

    let nx = dx;
    let ny = dy;

    if (dist > maxRadius) {
      nx = (dx / dist) * maxRadius;
      ny = (dy / dist) * maxRadius;
    }

    setKnobPos({ x: nx, y: ny });
    onMove(nx / maxRadius, ny / maxRadius);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
    onMove(0, 0);
  };

  return (
    <div className="absolute inset-x-4 bottom-20 pointer-events-none flex justify-between items-end z-10 sm:hidden">
      {/* Left: Joystick */}
      <div
        ref={joystickBaseRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-28 h-28 rounded-full bg-white/40 border-2 border-pink-300/80 pointer-events-auto touch-none flex items-center justify-center relative shadow-lg"
      >
        <div
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 shadow-md transform transition-transform border border-white"
          style={{ transform: `translate(${knobPos.x}px, ${knobPos.y}px)` }}
        />
      </div>

      {/* Right: Action Buttons */}
      <div className="flex flex-col gap-3 pointer-events-auto">
        {canInteract && (
          <button
            onClick={onInteract}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-400 text-white font-bold text-xs shadow-lg active:scale-90 transition-transform flex flex-col items-center justify-center border-2 border-white"
          >
            <span className="text-sm">✨</span>
            <span className="text-[9px] uppercase font-bold">{interactLabel || 'Acción'}</span>
          </button>
        )}

        <button
          onClick={onJump}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 text-white font-bold text-xs shadow-lg active:scale-90 transition-transform flex flex-col items-center justify-center border-2 border-white"
        >
          <span className="text-base">🦘</span>
          <span className="text-[9px] uppercase font-bold">Saltar</span>
        </button>
      </div>
    </div>
  );
};
