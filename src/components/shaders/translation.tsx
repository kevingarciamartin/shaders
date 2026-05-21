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

  #define PI 3.14159265359

  float circle(in vec2 _st, in float _radius) {
    vec2 dist = _st-vec2(0.5);
	  return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
  }
  
  void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st.x *= uResolution.x/uResolution.y;
    vec3 color = vec3(0.0);

    // Calculate vertical bouncing motion using a sawtooth wave and absolute sine
    float t = mod(uTime, 5.0); // Loop animation every 5 seconds
    float y_pos = - 0.5 * abs(3. / t * sin(t * PI)); // Bouncing curve

    // To move the circle we move the space
    vec2 translate = vec2(-0.8*t  * uResolution.x/uResolution.y + 2., y_pos + 0.3);
    st += translate*0.35;

    // Show the coordinates of the space on the background
    // color = vec3(st.x,st.y,0.0);

    // Add the shape on the foreground
    color += vec3(circle(st,0.01));

    gl_FragColor = vec4(color,1.0);
  }
`;

export function Translation() {
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
