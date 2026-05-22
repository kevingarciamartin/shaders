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

  #define PI 3.14159265358979323846

  vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
  }

  vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
  }

  float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
  }
  
  void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st.x *= uResolution.x/uResolution.y;
    vec3 color = vec3(0.0);

    float zoom = 5.5;

    // Base grid
    vec2 grid_st = tile(st, zoom);
    float base_square = box(grid_st, vec2(0.98));
    
    // Intersection grid (offset by 0.5)
    vec2 intersect_st = tile(st + 0.5/zoom, zoom);
    intersect_st = rotate2D(intersect_st, PI*0.25);
    
    // Diamond with border
    float diamond_border = box(intersect_st, vec2(0.34));
    float diamond_fill = box(intersect_st, vec2(0.3));

    // Composite
    // Start with base squares (white)
    color = vec3(base_square);
    
    // Substract/Overlay the diamond border (black)
    color = mix(color, vec3(0.0), diamond_border);
    
    // Add the diamond fill (white)
    color = mix(color, vec3(1.0), diamond_fill);

    gl_FragColor = vec4(color,1.0);
  }
`;

export function DiamondTiles() {
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
