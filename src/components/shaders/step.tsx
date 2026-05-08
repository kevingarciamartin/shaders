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
  uniform float uThreshold;

  float plot(vec2 st, float pct){
    return  smoothstep( pct-0.01, pct, st.y) -
            smoothstep( pct, pct+0.01, st.y);
  }

  void main() {
    vec2 st = gl_FragCoord.xy/uResolution;

    // Step will return 0.0 unless the value is over 0.5,
    // in that case it will return 1.0
    float y = 1.5 * step(1.5 * uThreshold,st.x);

    vec3 color = vec3(y);

    float pct = plot(st,y);
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);

    gl_FragColor = vec4(color,1.0);
  }
`;

export function Step() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const { threshold } = useControls({
    threshold: {
      value: 0.5,
      min: 0.0,
      max: 1.0,
      step: 0.1,
    },
  });

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uThreshold: { type: "f", value: threshold },
    }),
    []
  );

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size.width, size.height, uniforms]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uThreshold.value = threshold;
    }
  }, [threshold]);

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
