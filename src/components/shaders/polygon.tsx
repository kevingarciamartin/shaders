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
  #define PI 3.14159265359
  #define TWO_PI 6.28318530718

  uniform vec2 uResolution;
  uniform float uTime;
  uniform int uSides;
  
  void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    float ratio = uResolution.x/uResolution.y;
    vec3 color = vec3(0.);
    float d = 0.;

    // Remap the space to -1. to 1. and fix aspect ratio
    st -= 0.5;
    st.x *= ratio;
    st *= 2.0;

    // Number of sides of your shape
    int N = uSides;

    // Angle and radius from the current pixel
    float a = atan(st.x,st.y)+PI;
    float r = TWO_PI/float(N);

    // Shaping function that modulate the distance
    d = cos(floor(.5+a/r)*r-a)*length(st);

    color = vec3(1.0-smoothstep(.4,.41,d));
    // color = vec3(d);

    gl_FragColor = vec4(color,1.0);
  }
`;

export function Polygon() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const { sides } = useControls({
    sides: {
      value: 3,
      min: 0,
      max: 10,
      step: 1,
    },
  });

  const uniforms = useMemo(
    () => ({
      uResolution: {
        value: new THREE.Vector2(0, 0),
      },
      uTime: {
        value: 0,
      },
      uSides: {
        value: sides,
      },
    }),
    [sides]
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
      materialRef.current.uniforms.uSides.value = sides;
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
