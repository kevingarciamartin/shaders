import { useControls } from "leva";
import { useMemo } from "react";
import * as THREE from "three";

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  void main() {
    gl_FragColor = vec4(uColor, 1.);
  }
`;

export function Uniforms() {
  const { color } = useControls({
    color: "#ff0000",
  });

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#ff0000") },
    }),
    []
  );

  useMemo(() => {
    uniforms.uColor.value.set(color);
  }, [color, uniforms]);

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
