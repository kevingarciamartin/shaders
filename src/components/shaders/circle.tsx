import { useFrame, useThree } from "@react-three/fiber";
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
  uniform float uRadius;

 float circle(in vec2 _st, in vec2 _center, in float _radius) {
    vec2 dist = _st - _center;
	  return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}
  
  void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    float ratio = uResolution.x/uResolution.y;
    st.x *= ratio;
    
    vec2 center = vec2(0.5 * ratio, 0.5);
    vec3 color = vec3(circle(st, center, uRadius));

    gl_FragColor = vec4(color,1.0);
  }
`;

export function Circle() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const { radius } = useControls({
    radius: {
      value: 0.5,
      min: 0.0,
      max: 1.0,
      step: 0.1,
    },
  });

  const uniforms = useMemo(
    () => ({
      uResolution: {
        value: new THREE.Vector2(0, 0),
      },
      uRadius: {
        value: radius,
      },
    }),
    [radius]
  );

  useEffect(() => {
    uniforms.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
  }, [size.width, size.height, viewport.dpr, uniforms]);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uRadius.value = radius;
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
