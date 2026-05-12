"use client";

import { Html } from "@react-three/drei";
import { useEffect, useState } from "react";

interface ShaderLoaderProps {
  slug: string;
}

export function ShaderLoader({ slug }: ShaderLoaderProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let active = true;

    const loadComponent = async () => {
      try {
        const mod = await import(`./shaders/${slug}`);

        if (!active) return;

        let target: React.ComponentType | undefined;

        // 1. Check default export
        if (mod.default) {
          target = mod.default;
        } else {
          // 2. Check for a named export that might match the PascalCase version of the slug
          const pascalSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
          if (mod[pascalSlug]) {
            target = mod[pascalSlug];
          } else {
            // 3. Fallback to the first available export
            const firstExport = Object.values(mod).find(
              (val) => typeof val === "function"
            );
            if (firstExport) {
              target = firstExport as React.ComponentType;
            }
          }
        }

        if (target) {
          setComponent(() => target);
        } else {
          console.error(
            `No valid React component found in shader file: ${slug}`
          );
        }
      } catch (error) {
        if (active) {
          console.error(`Error loading shader component: ${slug}`, error);
        }
      }
    };

    loadComponent();

    return () => {
      active = false;
    };
  }, [slug]);

  if (!Component) {
    return (
      <Html center>
        <div className="flex items-center justify-center bg-black/50 p-4 rounded-lg text-muted-foreground animate-pulse whitespace-nowrap">
          Loading {slug}...
        </div>
      </Html>
    );
  }

  return <Component />;
}
