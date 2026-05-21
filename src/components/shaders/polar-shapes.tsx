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

  float circle(in vec2 _st, in vec2 _center, in float _radius) {
    vec2 dist = _st - _center;
	  return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
  }

  float plot(vec2 st, float pct){
    return  smoothstep( pct-0.02, pct, st.y) -
            smoothstep( pct, pct+0.02, st.y);
  }
  
  void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    float ratio = uResolution.x/uResolution.y;
    st.x *= ratio;
    vec3 color = vec3(0.0);

    vec2 center = vec2(0.5 * ratio, 0.5);
    vec2 pos = center - st;

    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x);

    float f = abs(cos(a*2.5 + sin(uTime)))*.5+.3;
    f -= circle(st, center, 0.01);

    color = vec3( 1.-smoothstep(f,f+0.02,r) );

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function PolarShapes() {
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
