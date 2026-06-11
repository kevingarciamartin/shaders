import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform vec2 uResolution;

  vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
  }

  // Gradient Noise by Inigo Quilez - iq/2013
  // https://www.shadertoy.com/view/XdXGW8
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
  }

  mat2 rotate2d(float angle){
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
  }

  void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    float aspect = uResolution.x/uResolution.y;
    st.x *= aspect;

    // Zoom out to frame the composition beautifully
    st *= 2.5;

    // Background - Matte textured gesso paper
    float paper_grain = noise(st * 180.0) * 0.03 + noise(st * 60.0) * 0.02;
    vec3 color = vec3(249./255., 249./255., 236./255.) - vec3(paper_grain);

    // Color definitions
    vec3 color_black = vec3(0.06, 0.06, 0.08);

    // --- LAYER 1: FINE BLACK FILAMENTS & DROPLETS ---
    vec2 st_fine_1 = st + vec2(45.2, -12.6);
    st_fine_1 = rotate2d(-0.2) * st_fine_1;
    st_fine_1 += noise(st_fine_1 * 1.3) * 0.7;
    st_fine_1 *= 0.4;
    
    // Thin winding dripped filaments
    float fine_lines_1 = abs(noise(st_fine_1 * 5.5));
    float mask_fine_lines_1 = smoothstep(0.02, 0.015, fine_lines_1) * 1.;
    
    // Small spattered droplets
    float droplets = noise(st_fine_1 * 25.0 + noise(st_fine_1 * 8.0) * 1.);
    float mask_droplets = smoothstep(0.22, 0.28, droplets) * 1.;

    float combined_fine_1 = max(mask_fine_lines_1, mask_droplets);
    color = mix(color, color_black, combined_fine_1);

    // --- LAYER 2: FINE BLACK FILAMENTS ---
    vec2 st_fine_2 = st + vec2(-37.4, 8.8);
    st_fine_2 = rotate2d(0.85) * st_fine_2;
    st_fine_2 += noise(st_fine_2 * 1.3) * 0.7;
    st_fine_2 *= 0.4;
    
    // Thin winding dripped filaments
    float fine_lines_2 = abs(noise(st_fine_2 * 10.5));
    float mask_fine_lines_2 = smoothstep(0.02, 0.015, fine_lines_2) * 1.;
    
    color = mix(color, color_black, mask_fine_lines_2);

    // --- LAYER 3: FINE BLACK FILAMENTS ---
    vec2 st_fine_3 = st + vec2(14.7, -22.3);
    st_fine_3 = rotate2d(-0.45) * st_fine_3;
    st_fine_3 += noise(st_fine_3 * 1.3) * 0.7;
    st_fine_3 *= 0.2;
    // st_fine_3 += 3.;
    
    // Thin winding dripped filaments
    float fine_lines_3 = abs(noise(st_fine_3 * 10.5));
    float mask_fine_lines_3 = smoothstep(0.02, 0.015, fine_lines_3) * 1.;

    color = mix(color, color_black, mask_fine_lines_3);

    // --- LAYER 4: FINE BLACK FILAMENTS ---
    vec2 st_fine_4 = st;
    st_fine_4 = rotate2d(0.35) * st_fine_4;
    st_fine_4 += noise(st_fine_4 * 1.3) * 0.7;
    st_fine_4 *= 0.12;
    
    // Thin winding dripped filaments
    float fine_lines_4 = abs(noise(st_fine_4 * 10.5));
    float mask_fine_lines_4 = smoothstep(0.02, 0.015, fine_lines_4) * 2.;

    color = mix(color, color_black, mask_fine_lines_4);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function JacksonPollock() {
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
