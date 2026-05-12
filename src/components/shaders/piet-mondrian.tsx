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

  // Constants
  float stroke1 = 0.022;
  float stroke2 = 0.028;
  float stroke3 = 0.030;
  float x1 = 0.0;
  float x2 = 0.09;
  float x3 = 0.25;
  float x4 = 0.70;
  float x5 = 0.925;
  float x6 = 1.0;
  float y1 = 0.0;
  float y2 = 0.1;
  float y3 = 0.6;
  float y4 = 0.81;
  float y5 = 1.0;
  float noise_amplitude = 0.03;

  // Palette
  vec3 white = vec3(239./255., 232./255., 217./255.);
  vec3 black = vec3(25./255., 27./255., 32./255.);
  vec3 red = vec3(171./255.,35./255.,37./255.);
  vec3 yellow = vec3(252./255.,196./255.,51./255.);
  vec3 blue = vec3(40./255., 94./255., 152./255.);

  float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float wobble(float x, float seed) {
    float w = sin(x * 35.0 + seed) * 0.00015;
    w += sin(x * 82.0 + seed * 1.5) * 0.0001;
    w += (random(vec2(x, seed)) - 0.5) * 0.00015;
    return 1.5 * w;
  }

  vec3 rectangle (in vec2 st, in vec2 horizontal, in vec2 vertical) {
    float blur = 0.003;
    
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
    
    // Background
    // float grain = random(st);
    // vec3 color = white * (0.97 + 0.03 * grain);
    vec3 color = white;

    // Red
    vec3 red_rect = rectangle(st, vec2(x1, x3), vec2(y3, y5));
    color = mix(color, red, red_rect);

    // Yellow
    vec3 yellow_rect = rectangle(st, vec2(x5, x6), vec2(y3, y5));
    color = mix(color, yellow, yellow_rect);

    // Blue
    vec3 blue_rect = rectangle(st, vec2(x4, x6), vec2(y1, y2));
    color = mix(color, blue, blue_rect);

    // Horizontal
    vec3 hor_line1 = rectangle(st, vec2(x3, x6), vec2(y2, y2 + stroke1));
    vec3 hor_line2 = rectangle(st, vec2(x1, x6), vec2(y3, y3 + stroke3));
    vec3 hor_line3 = rectangle(st, vec2(x1, x6), vec2(y4, y4 + stroke3));
    color = mix(color, black, hor_line1);
    color = mix(color, black, hor_line2);
    color = mix(color, black, hor_line3);

    // Vertical
    vec3 ver_line1 = rectangle(st, vec2(x2, x2 + stroke1), vec2(y3, y5));
    vec3 ver_line2 = rectangle(st, vec2(x3, x3 + stroke2), vec2(y1, y5));
    vec3 ver_line3 = rectangle(st, vec2(x4, x4 + stroke2), vec2(y1, y5));
    vec3 ver_line4 = rectangle(st, vec2(x5, x5 + stroke2), vec2(y1, y5));
    color = mix(color, black, ver_line1);
    color = mix(color, black, ver_line2);
    color = mix(color, black, ver_line3);
    color = mix(color, black, ver_line4);

    // Noise
    float noise = random(st);
    color = color * (1. - noise_amplitude + noise_amplitude * noise);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function PietMondrian() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uResolution: {
        value: new THREE.Vector2(
          size.width * viewport.dpr,
          size.height * viewport.dpr
        ),
      },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

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
