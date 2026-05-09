import { useFrame, useThree } from "@react-three/fiber";
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
  uniform float uTime;

  // Constants that were previously controls
  const float horizon = 0.35;
  const float mist = 0.5;

  // Turner-inspired palette
  vec3 skyTop = vec3(0.68, 0.67, 0.58);    // Misty Gray/Blue (#AEAC95)
  vec3 skyBottomSunset = vec3(0.82, 0.42, 0.24); // Burnt Copper (#D16B3D)
  vec3 skyBottomSunrise = vec3(0.4, 0.5, 0.7);   // Cool Blue for sunrise
  vec3 sunCore = vec3(1.0, 1.0, 0.9);      // Ghostly White/Gold
  vec3 sunGlowSunset = vec3(0.91, 0.66, 0.34);   // Golden Orange (#E8A856)
  vec3 sunGlowSunrise = vec3(1.0, 0.8, 0.5);     // Pale Gold for sunrise
  vec3 water = vec3(93./255., 98./255., 131./255.); 

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    vec3 color = vec3(0.0);

    // Animation factor (0.0 to 1.0)
    float t = sin(uTime * 0.3) * 0.5 + 0.5;

    // Animate Sun Position in an arc
    vec2 sunPos;
    sunPos.x = mix(0.0, 1.0, t);
    sunPos.y = horizon - 0.5 + 1.5 * sin(t * PI / 1.1);

    // Interpolate Palette
    vec3 skyBottom = mix(skyBottomSunrise, skyBottomSunset, t);
    vec3 sunGlow = mix(sunGlowSunrise, sunGlowSunset, t);

    // 1. Background Sky Gradient
    float skyMask = smoothstep(horizon - 0.01, horizon + 0.01, st.y);
    float skyGradient = smoothstep(horizon, 1.0, st.y);
    vec3 skyColor = mix(skyBottom, skyTop, skyGradient);
    
    // 2. Sun and Glow
    vec2 sunDist = st - sunPos;
    // Adjust for aspect ratio to keep sun circular
    sunDist.x *= uResolution.x / uResolution.y;
    float d = length(sunDist);

    // Sun Core
    float sunMask = smoothstep(0.03, 0.01, d);
    
    // Atmospheric Glow (using inverse square-ish falloff for "Turneresque" haze)
    float glowIntensity = 1.5 * (0.5 + 0.5 * sin(t * PI));
    float glow = exp(-d * (10.0 - glowIntensity * 5.0));
    vec3 glowColor = sunGlow * glow * glowIntensity;

    // 3. Water and Reflection
    float waterMask = 1.0 - skyMask;
    
    // Vertical reflection logic
    // Add "ripples" to reflection
    float ripple = sin(st.y * 100.0 + random(vec2(st.x)) * 10.0) * 0.002;
    vec2 sunDistReflect = vec2(st.x - sunPos.x, horizon - st.y) + vec2(ripple, 0.0);
    sunDistReflect.x *= uResolution.x / uResolution.y;
    float dReflect = length(sunDistReflect);
    
    float reflectGlow = exp(-dReflect * (15.0 - glowIntensity * 5.0));
    vec3 waterColor = mix(water, sunGlow * 0.5, reflectGlow * glowIntensity);

    // 4. Composition
    color = mix(waterColor, skyColor + glowColor + sunMask * sunCore, skyMask);

    // 5. Atmospheric Mist / Noise
    float mist = random(st * 0.5) * 0.05 * mist;
    color += mist;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function WilliamTurnerSunset() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size.width, size.height, uniforms]);

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
