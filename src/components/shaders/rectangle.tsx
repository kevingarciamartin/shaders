import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec2 uResolution;
  uniform vec2 uHorizontal;
  uniform vec2 uVertical;
  uniform float uBlur;

  vec3 rectangle (in vec2 st, in vec2 horizontal, in vec2 vertical, in float blur) {
    vec2 bl = smoothstep(vec2(horizontal.x - 0.5 * blur, vertical.x - 0.5 * blur), 
                         vec2(horizontal.x + 0.5 * blur, vertical.x + 0.5 * blur),st);
    vec2 tr = smoothstep(vec2(1.0 - horizontal.y - 0.5 * blur, 1.0 - vertical.y - 0.5 * blur), 
                         vec2(1.0 - horizontal.y + 0.5 * blur, 1.0 - vertical.y + 0.5 * blur), 1.0-st);

    return vec3(bl.x * bl.y * tr.x * tr.y);
  }

  void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    float ratio = uResolution.x/uResolution.y;
    st.x *= ratio;
    st.x -= (ratio - 1.0) * 0.5;

    vec3 color = rectangle(st, uHorizontal, uVertical, uBlur);

    gl_FragColor = vec4(color,1.0);
  }
`;

export function Rectangle() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const { vertical, horizontal, blur } = useControls({
    vertical: {
      value: [0.3, 0.7],
      min: 0.0,
      max: 1.0,
      step: 0.1,
    },
    horizontal: {
      value: [0.3, 0.7],
      min: 0.0,
      max: 1.0,
      step: 0.1,
    },
    blur: {
      value: 0.0,
      min: 0.0,
      max: 0.5,
      step: 0.01,
    },
  });

  const uniforms = useMemo(
    () => ({
      uResolution: {
        value: new THREE.Vector2(0, 0),
      },
      uVertical: {
        value: new THREE.Vector2(0.3, 0.7),
      },
      uHorizontal: {
        value: new THREE.Vector2(0.3, 0.7),
      },
      uBlur: { value: 0.0 },
    }),
    []
  );

  useEffect(() => {
    uniforms.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
  }, [size.width, size.height, viewport.dpr, uniforms]);

  useEffect(() => {
    uniforms.uVertical.value.set(vertical[0], vertical[1]);
  }, [vertical, uniforms]);

  useEffect(() => {
    uniforms.uHorizontal.value.set(horizontal[0], horizontal[1]);
  }, [horizontal, uniforms]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uBlur.value = blur;
    }
  }, [blur, uniforms]);

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
