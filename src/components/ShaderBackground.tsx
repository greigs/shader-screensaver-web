import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';

interface ShaderBackgroundProps {
  className?: string;
  shaderUrl: string;
  onResize: (width: number, height: number) => void;
}

const ShaderBackground = forwardRef<any, ShaderBackgroundProps>(
  ({ className = '', shaderUrl, onResize }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useImperativeHandle(ref, () => ({
      reset: () => {
        startTimeRef.current = Date.now();
      },
    }));

    // Vertex shader source
    const vertexShaderSource = `
    attribute vec4 a_position;
    void main() {
      gl_Position = a_position;
    }
  `;

    const createShader = (
      gl: WebGLRenderingContext,
      type: GLenum,
      source: string,
    ): WebGLShader | null => {
      try {
        const shader = gl.createShader(type);
        if (!shader) return null;

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error(
            'Shader compilation error:',
            gl.getShaderInfoLog(shader),
          );
          gl.deleteShader(shader);
          return null;
        }

        return shader;
      } catch (error) {
        console.error('Error creating shader:', error);
        return null;
      }
    };

    const createProgram = (
      gl: WebGLRenderingContext,
      vertexShader: WebGLShader,
      fragmentShader: WebGLShader,
    ): WebGLProgram | null => {
      try {
        const program = gl.createProgram();
        if (!program) return null;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.error('Program linking error:', gl.getProgramInfoLog(program));
          gl.deleteProgram(program);
          return null;
        }

        return program;
      } catch (error) {
        console.error('Error creating program:', error);
        return null;
      }
    };

    const render = () => {
      const canvas = canvasRef.current;
      const gl = glRef.current;
      const program = programRef.current;

      if (!canvas || !gl || !program) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const displayWidth = Math.floor(rect.width * window.devicePixelRatio);
      const displayHeight = Math.floor(rect.height * window.devicePixelRatio);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
        onResize(displayWidth, displayHeight);
      }
      // Set uniforms
      const timeLocation = gl.getUniformLocation(program, 'time');
      const resolutionLocation = gl.getUniformLocation(
        program,
        'resolution',
      );

      const currentTime = (Date.now() - startTimeRef.current) / 1000;

      if (timeLocation !== null) {
        gl.uniform1f(timeLocation, currentTime);
      }
      if (resolutionLocation !== null) {
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      }

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Next frame
      animationRef.current = requestAnimationFrame(render);
    };

    const initWebGL = (fragmentShaderSource: string): boolean => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return false;

        const gl = canvas.getContext('webgl', {
          antialias: true,
          powerPreference: 'high-performance',
        });
        if (!gl) return false;
        glRef.current = gl;

        const vertexShader = createShader(
          gl,
          gl.VERTEX_SHADER,
          vertexShaderSource,
        );
        if (!vertexShader) return false;

        const fragmentShader = createShader(
          gl,
          gl.FRAGMENT_SHADER,
          fragmentShaderSource,
        );
        if (!fragmentShader) return false;

        const program = createProgram(gl, vertexShader, fragmentShader);
        if (!program) return false;
        programRef.current = program;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // prettier-ignore
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]), gl.STATIC_DRAW);

        const positionAttributeLocation = gl.getAttribLocation(
          program,
          'a_position',
        );
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(
          positionAttributeLocation,
          2,
          gl.FLOAT,
          false,
          0,
          0,
        );
        gl.useProgram(program);
        return true;
      } catch (error) {
        console.error('WebGL Initialization Error:', error);
        return false;
      }
    };

    useEffect(() => {
      const initialize = async () => {
        try {
          const response = await fetch(shaderUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch shader: ${response.statusText}`);
          }
          const fragmentShaderSource = await response.text();

          if (initWebGL(fragmentShaderSource)) {
            setIsLoaded(true);
            animationRef.current = requestAnimationFrame(render);
          } else {
            setHasError(true);
          }
        } catch (error) {
          console.error('Initialization failed:', error);
          setHasError(true);
        }
      };
      initialize();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (glRef.current) {
          const gl = glRef.current;
          if (programRef.current) {
            gl.deleteProgram(programRef.current);
          }
        }
      };
    }, [shaderUrl]);

    return (
      <div className={`${className} relative overflow-hidden`}>
        <canvas
          ref={canvasRef}
          className="block w-full h-full"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />

        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
            <div className="text-white text-xl animate-pulse">
              Loading shader...
            </div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/20 to-transparent animate-bounce"></div>
            <div
              className="absolute inset-0 bg-gradient-to-bl from-pink-500/20 via-transparent to-green-.00/20 animate-pulse"
              style={{ animationDelay: '1s' }}
            ></div>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/30 rounded-full animate-ping"></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-400/30 rounded-full animate-ping"
              style={{ animationDelay: '0.5s' }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-green-400/20 rounded-full animate-pulse"
              style={{ animationDelay: '1.5s' }}
            ></div>
          </div>
        )}
      </div>
    );
  },
);

ShaderBackground.displayName = 'ShaderBackground';

export default ShaderBackground;