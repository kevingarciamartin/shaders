"use client"

import { useMemo } from "react"
import { useControls } from "leva"
import * as THREE from "three"

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv;
    float d = length(p - 0.5);
    float pulse = 0.5 + 0.5 * sin(uTime + d * 10.0);
    gl_FragColor = vec4(uColor * pulse, 1.0);
  }
`

export function TestShader() {
  const { color } = useControls({
    color: "#ff0066",
  })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#ff0066") },
    }),
    []
  )

  // Update uniform values
  useMemo(() => {
    uniforms.uColor.value.set(color)
  }, [color, uniforms])

  // Simple r3f loop to update time
  // In a real r3f component we use useFrame, but this is a placeholder
  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
