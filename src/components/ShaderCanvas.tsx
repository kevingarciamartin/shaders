"use client";

import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Suspense } from "react";

interface ShaderCanvasProps {
  controls?: boolean;
  children: React.ReactNode;
}

export function ShaderCanvas({ controls = true, children }: ShaderCanvasProps) {
  return (
    <div className="w-full h-full bg-black">
      <Canvas>
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
      <Leva
        theme={{
          colors: {
            elevation1: "#151515",
            elevation2: "#202020",
            elevation3: "#252525",
            accent1: "#444",
            accent2: "#666",
            accent3: "#888",
          },
        }}
        hidden={!controls}
      />
    </div>
  );
}
