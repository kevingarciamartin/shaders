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

  vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;

    // Here is where the offset is happening
    // _st.x += step(1., mod(_st.y,2.0)) * 0.5;
    
    if (mod(uTime,2.0) < 1.0) {
        _st.x += mod(_st.y,2.0) < 1.0 ? -uTime : uTime;
    } else {
        _st.y += mod(_st.x,2.0) < 1.0 ? -uTime : uTime;
    }

    return fract(_st);
  }

  float circle(in vec2 _st, in vec2 _center, in float _radius) {
    vec2 dist = _st - _center;
	  return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
  }

  void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st.x *= uResolution.x/uResolution.y;
    vec3 color = vec3(0.0);
    
    st = tile(st, 10.0);
    color = vec3(circle(st, vec2(0.5), 0.2));

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function Offset() {
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
