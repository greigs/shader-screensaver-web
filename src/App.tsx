import React, { useRef, useState, useEffect } from 'react';
import { X, Maximize } from 'lucide-react';
import ShaderBackground from './components/ShaderBackground';
import ControlPanel from './components/ControlPanel';

function App() {
  const backgroundRef = useRef<any>(null);
  const [shaders, setShaders] = useState<Record<string, string>>({});
  const [shader, setShader] = useState('');
  const [isPanelVisible, setPanelVisible] = useState(true);
  const [isAutoChangeEnabled, setAutoChangeEnabled] = useState(true);
  const [autoChangeDuration, setAutoChangeDuration] = useState(15);
  const [resolution, setResolution] = useState('');
  const [showResolution, setShowResolution] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F11') {
        setPanelVisible(false);
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const shaderUrls = Object.values(shaders);
        if (shaderUrls.length === 0) return;

        const currentIndex = shaderUrls.findIndex((url) => url === shader);
        let nextIndex;

        if (event.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % shaderUrls.length;
        } else {
          nextIndex =
            (currentIndex - 1 + shaderUrls.length) % shaderUrls.length;
        }
        setShader(shaderUrls[nextIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shader, shaders]);

  useEffect(() => {
    const shaderModules = import.meta.glob<string>('./shaders/*.frag', {
      eager: true,
      query: '?url',
      import: 'default',
    });

    const loadedShaders: Record<string, string> = {};
    for (const path in shaderModules) {
      const fileName = path.split('/').pop()?.replace('.frag', '');
      if (fileName) {
        loadedShaders[fileName] = shaderModules[path];
      }
    }

    setShaders(loadedShaders);
    if (Object.keys(loadedShaders).length > 0) {
      setShader(loadedShaders[Object.keys(loadedShaders)[0]]);
    }
  }, []);

  useEffect(() => {
    if (!isAutoChangeEnabled || Object.keys(shaders).length < 2) return;

    const shaderUrls = Object.values(shaders);
    const interval = setInterval(() => {
      const currentShaderIndex = shaderUrls.findIndex((url) => url === shader);
      const nextShaderIndex = (currentShaderIndex + 1) % shaderUrls.length;
      setShader(shaderUrls[nextShaderIndex]);
    }, autoChangeDuration * 1000);

    return () => clearInterval(interval);
  }, [shader, isAutoChangeEnabled, autoChangeDuration, shaders]);

  const handleReset = () => {
    window.location.reload();
  };

  const handleShaderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setShader(shaders[event.target.value]);
  };

  const handleClose = () => {
    setPanelVisible(false);
  };

  const handleAutoChangeToggle = () => {
    setAutoChangeEnabled((prev) => !prev);
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoChangeDuration(Number(event.target.value));
  };

  const handleResize = (width: number, height: number) => {
    setResolution(`${width} x ${height}`);
    setShowResolution(true);
    setTimeout(() => {
      setShowResolution(false);
    }, 1000);
  };

  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    setPanelVisible(false);
  };

  if (!shader) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading Shaders...
      </div>
    );
  }

  const currentShaderName =
    Object.keys(shaders).find((name) => shaders[name] === shader) || '';

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <ShaderBackground
        className="absolute inset-0 w-full h-full"
        ref={backgroundRef}
        shaderUrl={shader}
        onResize={handleResize}
      />
      <ControlPanel
        onReset={handleReset}
        onShaderChange={handleShaderChange}
        shaders={Object.keys(shaders)}
        selectedShader={currentShaderName}
        isAutoChangeEnabled={isAutoChangeEnabled}
        autoChangeDuration={autoChangeDuration}
        onAutoChangeToggle={handleAutoChangeToggle}
        onDurationChange={handleDurationChange}
      />

      {isPanelVisible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative text-center text-white p-8 rounded-xl bg-black/30 border border-white/20 pointer-events-auto">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
            <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">
              Shader Screensaver
            </h1>
            <p className="text-white/90 text-lg drop-shadow-md">
              Procedural graphics powered by WebGL
            </p>
            <div className="mt-4 text-sm text-gray-400">
              <p>Inspired by Shadertoy</p>
              <p>
                Built by{' '}
                <a
                  href="https://github.com/greigs/shader-screensaver-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  greigs
                </a>
              </p>
            </div>
            <button
              onClick={handleFullscreen}
              className="mt-4 flex mx-auto items-center gap-2 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors text-sm"
            >
              <Maximize size={16} />
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}
      {showResolution && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs p-2 rounded">
          {resolution}
        </div>
      )}
    </div>
  );
}

export default App;