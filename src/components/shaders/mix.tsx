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
  #define PI 3.14159265359

  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec2 uRedThresholds;
  uniform float uGreenWavelength;
  uniform float uBlueExponent;

  float plot (vec2 st, float pct){
    return  smoothstep( pct-0.01, pct, st.y) -
            smoothstep( pct, pct+0.01, st.y);
  }

  void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    vec3 color = vec3(0.0);

    vec3 pct = vec3(st.x);

    pct.r = smoothstep(uRedThresholds.x, uRedThresholds.y, st.x);
    pct.g = sin(st.x * uGreenWavelength * PI);
    pct.b = pow(st.x, uBlueExponent);

    color = mix(uColorA, uColorB, pct);

    // Plot transition lines for each channel
    color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
    color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
    color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

    gl_FragColor = vec4(color,1.0);
  }
`;

export function ColorMix() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const { colorA, colorB, redThresholds, greenWavelength, blueExponent } =
    useControls({
      colorA: "#0000ff",
      colorB: "#ffff00",
      redThresholds: {
        value: [0.1, 0.9],
        min: 0.0,
        max: 1.0,
        step: 0.1,
      },
      greenWavelength: {
        value: 1.0,
        min: 0.0,
        max: 10.0,
        step: 0.25,
      },
      blueExponent: {
        value: 1.0,
        min: 0.0,
        max: 10.0,
        step: 0.01,
      },
    });

  const uniforms = useMemo(
    () => ({
      uResolution: {
        value: new THREE.Vector2(
          size.width * viewport.dpr,
          size.height * viewport.dpr
        ),
      },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uRedThresholds: {
        value: new THREE.Vector2(redThresholds[0], redThresholds[1]),
      },
      uGreenWavelength: { value: greenWavelength },
      uBlueExponent: { value: blueExponent },
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
    uniforms.uColorA.value.set(colorA);
  }, [colorA, uniforms]);

  useEffect(() => {
    uniforms.uColorB.value.set(colorB);
  }, [colorB, uniforms]);

  useEffect(() => {
    uniforms.uRedThresholds.value.set(redThresholds[0], redThresholds[1]);
  }, [redThresholds, uniforms]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uGreenWavelength.value = greenWavelength;
    }
  }, [greenWavelength, uniforms]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uBlueExponent.value = blueExponent;
    }
  }, [blueExponent, uniforms]);

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
