import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec2 uResolution;
  void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    gl_FragColor = vec4(st.x, st.y, 0., 1.);
  }
`;

export function GLFragCoord() {
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    []
  );

  useMemo(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size.width, size.height, uniforms]);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
