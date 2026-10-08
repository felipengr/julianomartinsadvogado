export function JsonLd({ graph }: { graph: object[] }) {
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });

  return (
    <script
      type="application/ld+json"
      // Escapa "<" para o conteúdo editável não conseguir fechar a tag <script>.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
    />
  );
}
