import { shaderRegistry } from "@/lib/shaders";
import { ChevronRight, VectorSquare } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 text-center max-w-4xl mx-auto">
      <div className="mb-8 p-4 rounded-full bg-primary/10">
        <VectorSquare className="size-12 text-primary" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        Shader Sandbox
      </h1>
      <p className="text-xl text-muted-foreground">
        A collection of shader experiments created with GLSL, React Three Fiber
        and Next.js.
      </p>
      <p className="text-xl text-muted-foreground">
        Some examples are taken from{" "}
        <Link
          href={"https://thebookofshaders.com/"}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          The Book of Shaders
        </Link>.
      </p>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {shaderRegistry.map((category) => (
          <div
            key={category.title}
            className="flex flex-col gap-4 p-6 rounded-xl border bg-card text-card-foreground shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <category.icon className="size-5 text-primary" />
              <h2 className="text-lg font-semibold">{category.title}</h2>
            </div>
            <ul className="space-y-2 text-left">
              {category.shaders.map((shader) => (
                <li key={shader.slug}>
                  <Link
                    href={`/shaders/${shader.slug}`}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors group"
                  >
                    <span className="text-sm">{shader.title}</span>
                    <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div> */}
    </div>
  );
}
