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
  uniform float uExponent;

  float plot(vec2 st, float pct){
    return  smoothstep( pct-0.01, pct, st.y) -
            smoothstep( pct, pct+0.01, st.y);
  }

  void main() {
    vec2 st = gl_FragCoord.xy/uResolution;

    float y = pow(st.x, uExponent);

    vec3 color = vec3(y);

    float pct = plot(st, y);
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);

	  gl_FragColor = vec4(color,1.0);
  }
`;

export function GLFragCoord() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const { exponent } = useControls({
    exponent: {
      value: 1.0,
      min: 0.01,
      max: 10.0,
      step: 0.01,
    },
  });

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uExponent: { type: "f", value: exponent },
    }),
    []
  );

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size.width, size.height, uniforms]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uExponent.value = exponent;
    }
  }, [exponent]);

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
