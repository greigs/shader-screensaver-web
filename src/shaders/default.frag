precision mediump float;

uniform vec2 resolution;
uniform float time;

// Hash function for noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Noise function
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

// Fractal noise
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for(int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 p = (uv - 0.5) * 2.0;
  
  float time = time * 0.3;
  
  // Create flowing patterns
  vec2 q = p + vec2(sin(time * 0.5), cos(time * 0.3)) * 0.5;
  float pattern1 = fbm(q * 2.0 + time * 0.1);
  float pattern2 = fbm(q * 3.0 + time * 0.15);
  
  // Animated circles
  vec2 center1 = vec2(sin(time * 0.7) * 0.6, cos(time * 0.5) * 0.4);
  vec2 center2 = vec2(cos(time * 0.6) * 0.5, sin(time * 0.8) * 0.5);
  vec2 center3 = vec2(sin(time * 0.4) * 0.4, cos(time * 0.9) * 0.3);
  
  float d1 = length(p - center1) - (0.3 + sin(time * 2.0) * 0.1);
  float d2 = length(p - center2) - (0.25 + cos(time * 1.5) * 0.08);
  float d3 = length(p - center3) - (0.2 + sin(time * 2.5) * 0.06);
  
  // Create dynamic colors
  vec3 color1 = vec3(0.2 + sin(time) * 0.1, 0.4 + cos(time * 0.7) * 0.1, 0.8);
  vec3 color2 = vec3(0.8, 0.3 + sin(time * 0.8) * 0.1, 0.6 + cos(time) * 0.1);
  vec3 color3 = vec3(0.3 + cos(time * 0.6) * 0.1, 0.8, 0.5 + sin(time * 0.9) * 0.1);
  
  // Mix colors based on patterns
  vec3 color = mix(color1, color2, pattern1);
  color = mix(color, color3, pattern2 * 0.7);
  
  // Add circle influences with smooth blending
  float influence1 = smoothstep(0.5, -0.2, d1);
  float influence2 = smoothstep(0.4, -0.1, d2);
  float influence3 = smoothstep(0.3, -0.1, d3);
  
  color = mix(color, vec3(1.0, 1.0, 0.9), influence1 * 0.4);
  color = mix(color, vec3(0.9, 1.0, 1.0), influence2 * 0.3);
  color = mix(color, vec3(1.0, 0.9, 1.0), influence3 * 0.2);
  
  // Add subtle sparkles
  vec2 sparkleUV = p * 15.0 + time;
  float sparkle = hash(floor(sparkleUV));
  sparkle = smoothstep(0.98, 1.0, sparkle);
  sparkle *= sin(time * 8.0 + hash(floor(sparkleUV)) * 50.0) * 0.5 + 0.5;
  color += vec3(sparkle * 0.2);
  
  // Add vignette
  float vignette = 1.0 - length(p * 0.6);
  color *= smoothstep(0.0, 1.0, vignette);
  
  // Enhance colors
  color = pow(color, vec3(0.8));
  
  gl_FragColor = vec4(color, 1.0);
} 