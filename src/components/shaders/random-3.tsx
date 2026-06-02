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
  uniform vec2 uMouse;

  float random (in float x) {
    return fract(sin(x) * 1e4);
  }

  float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor(st + v);
    return step(t, random(100. + p * .000001) + random(p.x) * 0.5 );
  }

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    st.x *= aspect;

    vec2 grid = vec2(100.0, 150.);
    st *= grid;

    vec2 ipos = floor(st);  // integer
    vec2 fpos = fract(st);  // fraction

    vec2 vel = vec2(0.75 * uTime * max(grid.x, grid.y)); // time
    vel *= vec2(-1., 0.0) * random(1.0 + ipos.y); // direction

    // Assign a random value base on the integer coord
    vec2 offset = vec2(0.1, 0.);

    vec3 color = vec3(0.);
    color.r = pattern(st + offset, vel, 0.5 + uMouse.x * 0.2);
    color.g = pattern(st, vel, 0.5 + uMouse.x * 0.2);
    color.b = pattern(st - offset, vel, 0.5 + uMouse.x * 0.2);

    // Margins
    color *= step(0.2, fpos.y);

    gl_FragColor = vec4(1.0 - color, 1.0);
  }
`;

export function Random() {
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
      uMouse: {
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

  useFrame((state) => {
    if (!materialRef.current) {
      return;
    }

    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    materialRef.current.uniforms.uMouse.value.set(
      state.pointer.x,
      state.pointer.y
    );
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
