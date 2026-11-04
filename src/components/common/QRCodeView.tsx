import React from 'react';
import { QrCode, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface QRCodeViewProps {
  value: string;
  size?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  size = 180,
  label,
  sublabel,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate deterministic QR-like pseudo-matrix for crisp SVG rendering without external heavy binaries
  const hash = Math.abs(
    value.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  );

  const gridSize = 21;
  const cells: boolean[][] = Array(gridSize)
    .fill(null)
    .map((_, r) =>
      Array(gridSize)
        .fill(null)
        .map((_, c) => {
          // Standard QR corner finder squares
          const inTopLeft = r < 7 && c < 7;
          const inTopRight = r < 7 && c >= gridSize - 7;
          const inBottomLeft = r >= gridSize - 7 && c < 7;

          if (inTopLeft) {
            if (r === 0 || r === 6 || c === 0 || c === 6) return true;
            if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
            return false;
          }
          if (inTopRight) {
            const adjC = c - (gridSize - 7);
            if (r === 0 || r === 6 || adjC === 0 || adjC === 6) return true;
            if (r >= 2 && r <= 4 && adjC >= 2 && adjC <= 4) return true;
            return false;
          }
          if (inBottomLeft) {
            const adjR = r - (gridSize - 7);
            if (adjR === 0 || adjR === 6 || c === 0 || c === 6) return true;
            if (adjR >= 2 && adjR <= 4 && c >= 2 && c <= 4) return true;
            return false;
          }

          // Timing patterns
          if (r === 6 || c === 6) return (r + c) % 2 === 0;

          // Deterministic pattern based on text hash
          const valSeed = (r * 31 + c * 17 + hash) % 100;
          return valSeed > 46;
        })
    );

  const cellSize = size / gridSize;

  return (
    <div className={`flex flex-col items-center p-4 bg-white rounded-2xl border border-stone-200 shadow-sm ${className}`}>
      {label && <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">{label}</span>}
      <div className="relative p-2.5 bg-white rounded-xl border border-stone-100 flex items-center justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg">
          {cells.map((row, r) =>
            row.map((cell, c) =>
              cell ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize * 0.98}
                  height={cellSize * 0.98}
                  rx={cellSize * 0.2}
                  fill="#005C52"
                />
              ) : null
            )
          )}
        </svg>
        {/* Center CareCycle pharmacy badge */}
        <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-lg shadow-md border border-stone-100 flex items-center justify-center">
          <div className="w-7 h-7 rounded-md bg-[#005C52] flex items-center justify-center text-white font-bold text-xs">
            CC
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-sm font-bold text-stone-800 bg-stone-100 px-3 py-1 rounded-md border border-stone-200">
          {value}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 text-stone-500 hover:text-[#005C52] hover:bg-[#E0F0E4] rounded-md transition-colors"
          title="Copier le code"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {sublabel && <p className="text-xs text-stone-500 text-center mt-1">{sublabel}</p>}
    </div>
  );
};
