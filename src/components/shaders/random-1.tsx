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

  #define PI 3.14159265358979323846

  float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, uMouse)) * (uTime + 10.) * 0.01);
  }

  vec2 truchetPattern(in vec2 _st, in float _index){
    _index = fract(((_index - 0.5) * 2.0));
    if (_index > 0.75) {
        _st = vec2(1.0) - _st;
    } else if (_index > 0.5) {
        _st = vec2(1.0 - _st.x, _st.y);
    } else if (_index > 0.25) {
        _st = 1.0 - vec2(1.0 - _st.x, _st.y);
    }
    return _st;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    st.x *= aspect;

    st *= 10.0;
    // st = (st - vec2(5.0)) * (abs(sin(u_time * 0.2)) * 5.);
    // st.x += u_time * 3.0;

    vec2 ipos = floor(st);  // integer
    vec2 fpos = fract(st);  // fraction

    vec2 tile = truchetPattern(fpos, random( ipos ));

    float color = 0.0;

    // Maze
    color = smoothstep(tile.x - 0.3, tile.x, tile.y) - 
            smoothstep(tile.x, tile.x + 0.3, tile.y);

    // Circles
    color = (step(length(tile), 0.6) -
             step(length(tile), 0.4) ) +
            (step(length(tile - vec2(1.)), 0.6) -
             step(length(tile - vec2(1.)), 0.4) );

    // Truchet (2 triangles)
    color = step(tile.x, tile.y);

    gl_FragColor = vec4(vec3(color), 1.0);
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
