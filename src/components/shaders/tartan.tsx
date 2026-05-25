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

  // Royal Stewart Colors
  const vec3 RED = vec3(0.7, 0.05, 0.05);
  const vec3 BLUE = vec3(0.0, 0.1, 0.4);
  const vec3 GREEN = vec3(0.0, 0.3, 0.1);
  const vec3 BLACK = vec3(0.05, 0.05, 0.05);
  const vec3 YELLOW = vec3(0.9, 0.8, 0.1);
  const vec3 WHITE = vec3(0.95, 0.95, 0.95);

  vec3 getTartanColor(float p) {
    p = fract(p);
    
    vec3 color = RED;
    
    // Symmetrical sett: Green - Red - Yellow - Red - Black - Blue - Black - Red - White - Red - Green
    // We'll define stripes based on their position in the normalized (0-1) range.
    
    // Green band at the edges
    if (p < 0.08 || p > 0.92) {
      color = GREEN;
    } 
    // Central Black/Blue/Black band
    else if (abs(p - 0.5) < 0.15) {
      color = BLUE;
      if (abs(p - 0.5) < 0.1) {
        color = BLACK;
      }
    }
    // Yellow thin stripe
    else if (abs(p - 0.25) < 0.01) {
      color = YELLOW;
    }
    // White thin stripe
    else if (abs(p - 0.75) < 0.01) {
      color = WHITE;
    }
    
    return color;
  }

  void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st.x *= uResolution.x/uResolution.y;
    
    // Tiling and Zoom
    float zoom = 3.0;
    vec2 uv = st * zoom;
    
    // Sample the horizontal and vertical "sett"
    vec3 colorH = getTartanColor(uv.y);
    vec3 colorV = getTartanColor(uv.x);
    
    // Twill weave frequency (the diagonal "over-under" pattern)
    // This simulates the threads crossing each other
    float freq = 400.0;
    float twill = step(0.5, fract((uv.x + uv.y) * freq));
    
    // Combine horizontal and vertical colors using the twill pattern
    vec3 color = mix(colorH, colorV, twill);
    
    // Add subtle fabric texture/noise
    float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    color *= 0.92 + 0.08 * grain;
    
    // Subtle darkening at intersections to give depth
    float intersection = (1.0 - abs(colorH.r - colorV.r)) * 
                         (1.0 - abs(colorH.g - colorV.g)) * 
                         (1.0 - abs(colorH.b - colorV.b));
    color *= 1.0 - 0.05 * intersection;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function Tartan() {
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
