"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import { Html } from "@react-three/drei"

interface ShaderLoaderProps {
  slug: string
}

export function ShaderLoader({ slug }: ShaderLoaderProps) {
  const DynamicComponent = useMemo(() => {
    return dynamic(
      () =>
        import(`./shaders/${slug}`).then((mod) => {
          // Attempt to find a React component in the module
          // 1. Check default export
          if (mod.default) return mod.default
          
          // 2. Check for a named export that might match the PascalCase version of the slug
          const pascalSlug = slug.charAt(0).toUpperCase() + slug.slice(1)
          if (mod[pascalSlug]) return mod[pascalSlug]
          
          // 3. Fallback to the first available export
          const firstExport = Object.values(mod).find((val) => typeof val === "function")
          if (firstExport) return firstExport as React.ComponentType
          
          throw new Error(`No valid React component found in shader file: ${slug}`)
        }),
      {
        ssr: false,
        loading: () => (
          <Html center>
            <div className="flex items-center justify-center bg-black/50 p-4 rounded-lg text-muted-foreground animate-pulse whitespace-nowrap">
              Loading {slug}...
            </div>
          </Html>
        ),
      }
    )
  }, [slug])

  return <DynamicComponent />
}
