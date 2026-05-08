import { Palette, Sparkles, Square, Wand2 } from "lucide-react";

export interface ShaderMetadata {
  title: string;
  slug: string;
  description?: string;
}

export interface ShaderCategory {
  title: string;
  icon: any;
  shaders: ShaderMetadata[];
}

export const shaderRegistry: ShaderCategory[] = [
  {
    title: "Basics",
    icon: Square,
    shaders: [
      {
        title: "Hello World",
        slug: "hello-world",
        description: "Shader version of 'Hello World!'",
      },
      {
        title: "Uniforms",
        slug: "uniforms",
        description: "Read-only inputs from the CPU to the GPU",
      },
      {
        title: "gl_FragCoord",
        slug: "gl-fragcoord",
        description:
          "Holds the screen coordinates of the pixel or screen fragment that the active thread is working on",
      },
      {
        title: "Exponential Shaping Function",
        slug: "shaping-functions",
        description: "AKA 'Mr. Miyagi's fence lesson'",
      },
      {
        title: "Step Function",
        slug: "step",
        description: "AKA 'Mr. Miyagi's fence lesson'",
      },
      {
        title: "Smooth Step Function",
        slug: "smoothstep",
        description: "AKA 'Mr. Miyagi's fence lesson'",
      },
    ],
  },
  {
    title: "Patterns",
    icon: Palette,
    shaders: [
      {
        title: "Voronoi",
        slug: "voronoi",
        description: "Cellular noise pattern",
      },
      { title: "Grid", slug: "grid", description: "Simple coordinate grid" },
    ],
  },
  {
    title: "Effects",
    icon: Sparkles,
    shaders: [
      { title: "Plasma", slug: "plasma", description: "Liquid color waves" },
      { title: "Grain", slug: "grain", description: "Film grain effect" },
    ],
  },
  {
    title: "Generative",
    icon: Wand2,
    shaders: [
      {
        title: "Perlin Noise",
        slug: "perlin",
        description: "Smooth gradient noise",
      },
      { title: "FBM", slug: "fbm", description: "Fractional Brownian Motion" },
    ],
  },
];
