[**Live at https://shader-screensaver.netlify.app/**](https://shader-screensaver.netlify.app/)

# Shader Screensaver

A web-based, fullscreen shader viewer that cycles through a collection of GLSL fragment shaders, creating a dynamic, animated background.

## Features

- **Dynamic Shader Loading**: Automatically discovers and loads all `.frag` shaders from the `src/shaders` directory.
- **Shader Selection**: Manually select shaders from a dropdown menu.
- **Auto-Cycle Mode**: Automatically cycles through the available shaders at a configurable interval.
- **Interactive Controls**:
  - Pause/resume auto-cycling.
  - Adjust the cycle duration (10s to 2min).
  - Navigate shaders with keyboard arrow keys (← and →).
  - Enter fullscreen mode.
  - Hide control panels for an immersive experience.
- **Responsive Canvas**: The WebGL canvas dynamically resizes to fit the window without stretching or distortion.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation & Running

1. **Clone the repository:**
   ```bash
   git clone https://github.com/greigs/shader-screensaver-web.git
   cd shader-screensaver-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`. Note that if the `vite` command is not found, you can run `npx vite` directly.

## Usage

- Use the **dropdown menu** to select a specific shader.
- Toggle the **"Auto-change"** checkbox to enable or disable automatic shader cycling.
- Use the **slider** to set the time interval for auto-changing.
- Use the **left (←) and right (→) arrow keys** to manually cycle through shaders.
- Press **F11** or click the **"Enter Fullscreen"** button for a fully immersive view.
- The control panels can be hidden by clicking the **'X'** button on the central panel.

## Adding New Shaders

To add your own fragment shader:

1. Create a new file with a `.frag` extension (e.g., `my-shader.frag`).
2. Place the file inside the `src/shaders/` directory.
3. The application will automatically detect the new shader and add it to the selection list.

The shaders are written in GLSL (OpenGL Shading Language). The following uniforms are passed from the application:

- `uniform vec2 resolution;` // The resolution of the canvas (width, height)
- `uniform float time;`      // The elapsed time in seconds
- `uniform vec2 mouse;`      // The mouse coordinates normalized to the canvas size

## Built With

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)

## Acknowledgements

- Inspired by [Shadertoy](https://www.shadertoy.com/).
- Many of the shaders were sourced from the creative coding community. 