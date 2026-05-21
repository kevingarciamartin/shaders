import {
  Brush,
  Fingerprint,
  Sparkles,
  Square,
  Wand2,
  type LucideIcon,
} from "lucide-react";

export interface ShaderMetadata {
  title: string;
  slug: string;
  description?: string;
}

export interface ShaderCategory {
  title: string;
  icon: LucideIcon;
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
      {
        title: "Color Mix",
        slug: "mix",
        description: "The path to interesting gradients",
      },
      {
        title: "Rectangle",
        slug: "rectangle",
      },
      {
        title: "Rectangle Outline",
        slug: "rectangle-outline",
      },
      {
        title: "Circle",
        slug: "circle",
      },
      {
        title: "Distance Field",
        slug: "distance-field",
      },
      {
        title: "Polar Shapes",
        slug: "polar-shapes",
      },
      {
        title: "Polygons",
        slug: "polygon",
      },
      {
        title: "Translation",
        slug: "translation",
        description: "Moving a shape",
      },
    ],
  },
  {
    title: "Patterns",
    icon: Fingerprint,
    shaders: [
      // {
      //   title: "Voronoi",
      //   slug: "voronoi",
      //   description: "Cellular noise pattern",
      // },
      // { title: "Grid", slug: "grid", description: "Simple coordinate grid" },
    ],
  },
  {
    title: "Effects",
    icon: Sparkles,
    shaders: [
      // { title: "Plasma", slug: "plasma", description: "Liquid color waves" },
      // { title: "Grain", slug: "grain", description: "Film grain effect" },
    ],
  },
  {
    title: "Generative",
    icon: Wand2,
    shaders: [
      // {
      //   title: "Perlin Noise",
      //   slug: "perlin",
      //   description: "Smooth gradient noise",
      // },
      // { title: "FBM", slug: "fbm", description: "Fractional Brownian Motion" },
    ],
  },
  {
    title: "Compositions",
    icon: Brush,
    shaders: [
      {
        title: "William Turner Sunset",
        slug: "william-turner-sunset",
        description:
          "An attempt at a composition that resembles the sunset in 'The Fighting Temeraire' (1838) by William Turner",
      },
      {
        title: "Piet Mondrian Painting",
        slug: "piet-mondrian",
        description:
          "An attempt at a composition that resembles the painting 'Tableau' (1921) by Piet Mondrian",
      },
    ],
  },
];
