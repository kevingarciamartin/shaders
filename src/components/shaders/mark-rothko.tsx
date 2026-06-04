import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec2 uResolution;

  // Palette
  vec3 bg1 = vec3(29./255., 3./255., 4./255.);
  vec3 bg2 = vec3(67./255., 22./255., 9./255.);
  vec3 left = vec3(145./255., 28./255., 18./255.);
  vec3 mid = vec3(115./255., 20./255., 12./255.);
  vec3 right = vec3(226./255., 181./255., 117./255.);

  float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float wobble(float x, float seed) {
    float w = sin(x * 35.0 + seed) * 0.0015;
    w += sin(x * 82.0 + seed * 1.5) * 0.001;
    w += (random(vec2(x, seed)) - 0.5) * 0.0015;
    w += (random(vec2(x, seed)) + seed) * 0.001;
    return 1. * w;
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  vec3 rectangle (in vec2 st, in vec2 horizontal, in vec2 vertical) {
    float blur = 0.009;
    
    float left = horizontal.x + wobble(st.y, 1.1);
    float right = horizontal.y + wobble(st.y, 2.2);
    float bottom = vertical.x + wobble(st.x, 3.3);
    float top = vertical.y + wobble(st.x, 4.4);

    vec2 bl = smoothstep(vec2(left - blur * 0.5, bottom - blur * 0.5), 
                         vec2(left + blur * 0.5, bottom + blur * 0.5), st);
    vec2 tr = smoothstep(vec2(1.0 - right - blur * 0.5, 1.0 - top - blur * 0.5), 
                         vec2(1.0 - right + blur * 0.5, 1.0 - top + blur * 0.5), 1.0 - st);

    return vec3(bl.x * bl.y * tr.x * tr.y);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;

    // Stain noise for layered feel
    float stain = noise(st * 20.0);

    // Background 
    vec3 bg1_stained = mix(bg1 * 0.85, bg1 * 1.15, stain);
    vec3 bg2_stained = mix(bg2 * 0.85, bg2 * 1.15, stain);
    float mask = smoothstep(0.0, 0.35, st.x) * (1.0 - smoothstep(0.9, 1.0, st.x));
    vec3 color = mix(bg1_stained, bg2_stained, mask);

    // Left
    vec3 left_stained = mix(left * 0.95, left * 1.15, noise(st * 7. + 2.0));
    vec3 left_rect = rectangle(st, vec2(0.02, 0.29), vec2(0.02, 0.95));
    color = mix(color, left_stained, left_rect);
    
    // Middle
    vec3 mid_stained = mix(mid * 0.95, mid * 1.15, noise(st * 6.0 + 1.0));
    vec3 mid_rect = rectangle(st, vec2(0.3, 0.7), vec2(0.015, 0.985));
    color = mix(color, mid_stained, mid_rect);

    // Right
    vec3 right_stained = mix(right * 0.95, right * 1.15, noise(st * 10.0 + 10.0));
    vec3 right_rect = rectangle(st, vec2(0.71, 0.98), vec2(0.05, 0.9));
    color = mix(color, right_stained, right_rect);

    // Final Canvas Grain
    float grain = random(st);
    float grain_amplitude = 0.05;
    color = color * (1. - grain_amplitude + grain_amplitude * grain);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function MarkRothko() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uResolution: {
        value: new THREE.Vector2(0, 0),
      },
    }),
    []
  );

  useEffect(() => {
    uniforms.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
  }, [size.width, size.height, viewport.dpr, uniforms]);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
