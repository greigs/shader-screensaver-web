import React, { useState } from 'react';
import {
  Settings,
  Minimize2,
  RotateCcw,
} from 'lucide-react';

interface ControlPanelProps {
  onReset?: () => void;
  onShaderChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  shaders: string[];
  selectedShader: string;
  isAutoChangeEnabled: boolean;
  autoChangeDuration: number;
  onAutoChangeToggle: () => void;
  onDurationChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onReset,
  onShaderChange,
  shaders,
  selectedShader,
  isAutoChangeEnabled,
  autoChangeDuration,
  onAutoChangeToggle,
  onDurationChange,
}) => {
  const [isMinimized, setIsMinimized] = useState(true);

  return (
    <div className="fixed top-4 right-4 z-10">
      <div
        className={`bg-black/20 backdrop-blur-md rounded-lg border border-white/10 transition-all duration-300 ${
          isMinimized ? 'p-2' : 'p-4'
        }`}
      >
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            title="Open Controls"
          >
            <Settings size={20} />
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium text-sm">Shader Controls</h3>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Minimize"
              >
                <Minimize2 size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-white/80">Shader</span>
                <select
                  value={selectedShader}
                  onChange={onShaderChange}
                  className="bg-white/10 text-white p-2 rounded-md text-xs"
                >
                  {shaders.map((shader) => (
                    <option key={shader} value={shader} className="text-black">
                      {shader}
                    </option>
                  ))}
                </select>
              </label>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAutoChangeEnabled}
                    onChange={onAutoChangeToggle}
                    className="accent-pink-500"
                  />
                  <span className="text-white/80">Auto-change</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="120"
                    value={autoChangeDuration}
                    onChange={onDurationChange}
                    disabled={!isAutoChangeEnabled}
                    className="w-full"
                  />
                  <span className="text-xs text-white/60 w-12 text-right">
                    {autoChangeDuration}s
                  </span>
                </div>
              </div>

              <button
                onClick={onReset}
                className="flex items-center gap-2 w-full p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors text-sm"
                title="Reset Animation"
              >
                <RotateCcw size={16} />
                Reset Animation
              </button>

              <div className="text-white/60 text-xs">
                <p className="mb-1">WebGL Shader Screensaver</p>
                <p>Inspired by Shadertoy</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;