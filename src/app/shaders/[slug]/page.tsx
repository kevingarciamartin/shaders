import { ShaderCanvas } from "@/components/ShaderCanvas";
import { ShaderLoader } from "@/components/ShaderLoader";
import { shaderRegistry } from "@/lib/shaders";
import { notFound } from "next/navigation";

interface ShaderPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ShaderPage({ params }: ShaderPageProps) {
  const { slug } = await params;

  const shader = shaderRegistry
    .flatMap((c) => c.shaders)
    .find((s) => s.slug === slug);

  if (!shader) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-muted/50">
        <h1 className="text-xl font-bold">{shader.title}</h1>
        {shader.description && (
          <p className="text-sm text-muted-foreground">{shader.description}</p>
        )}
      </div>
      <div className="flex-1 min-h-0 min-w-0">
        <ShaderCanvas>
          <ShaderLoader slug={slug} />
        </ShaderCanvas>
      </div>
    </div>
  );
}
