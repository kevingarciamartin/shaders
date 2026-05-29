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
  uniform float uTime;

  #define PI 3.14159265358979323846

  float rect(vec2 st, vec2 size) {
    size = 0.5 - size * 0.5;
    vec2 uv = step(size, st);
    uv *= step(size, 1.0 - st);
    return uv.x * uv.y;
  }

  float ichingLine(vec2 st, float type) {
    float line = 0.0;
    if (type > 0.5) {
        // Unbroken: A single long rectangle
        line = rect(st, vec2(0.8, 0.12));
    } else {
        // Broken: Two smaller rectangles with a gap in the middle
        // Gap size is roughly 0.1 wide
        // Left part
        line = rect(st + vec2(0.24, 0.0), vec2(0.32, 0.12));
        // Right part
        line += rect(st - vec2(0.24, 0.0), vec2(0.32, 0.12));
    }
    return line;
  }

  float trigram(vec2 st, float index) {
    float pct = 0.0;
    
    // Bottom line
    float bit1 = mod(index, 2.0);
    pct += ichingLine(st + vec2(0.0, 0.25), bit1);
    
    // Middle line
    float bit2 = mod(floor(index / 2.0), 2.0);
    pct += ichingLine(st, bit2);
    
    // Top line
    float bit3 = mod(floor(index / 4.0), 2.0);
    pct += ichingLine(st - vec2(0.0, 0.25), bit3);
    
    return clamp(pct, 0.0, 1.0);
  }

  void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    float aspect = uResolution.x/uResolution.y;
    st.x *= aspect;

    // Grid
    float zoom = 8.0;
    vec2 gridST = st * zoom;
    vec2 f_st = fract(gridST);
    vec2 i_st = floor(gridST);

    // Staggered index
    // Use tile position to offset the time
    float offset = (i_st.x + i_st.y) * 0.5;
    float index = mod(floor(uTime * 2.0 + offset), 8.0);

    float color = trigram(f_st, index);

    // Subtle background color
    // vec3 bgColor = vec3(0.05, 0.05, 0.07);
    vec3 bgColor = vec3(0.0);
    // vec3 lineColor = vec3(0.9, 0.9, 0.95);
    vec3 lineColor = vec3(1.0);
    
    vec3 finalColor = mix(bgColor, lineColor, color);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function Bagua() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uResolution: {
        value: new THREE.Vector2(0, 0),
      },
      uTime: {
        value: 0,
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

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

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
