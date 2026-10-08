import { IMAGES_BUCKET } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";

const MAX_SIDE = 2000;
const QUALITY = 0.85;

function canvasToBlob(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY));
}

// Fotos do celular chegam com 5–10 MB: reduz para no máximo 2000px e
// comprime no próprio navegador antes de enviar.
async function compressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Esse arquivo não é uma foto. Escolha uma imagem JPG ou PNG.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Não consegui abrir essa foto. Tente outra, de preferência em JPG.");
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  // Navegadores sem suporte a WebP devolvem PNG: nesse caso, usa JPG.
  const webp = await canvasToBlob(canvas, "image/webp");
  if (webp?.type === "image/webp") return webp;
  const jpeg = await canvasToBlob(canvas, "image/jpeg");
  if (jpeg) return jpeg;
  throw new Error("Não consegui preparar essa foto. Tente outra.");
}

export async function uploadImage(file: File): Promise<string> {
  const blob = await compressImage(file);
  const extension = blob.type === "image/webp" ? "webp" : "jpg";
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;

  const supabase = createClient();
  const { error } = await supabase.storage.from(IMAGES_BUCKET).upload(path, blob, {
    contentType: blob.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    console.error("Erro no upload:", error.message);
    throw new Error("Não foi possível enviar a foto. Confira sua internet e tente de novo.");
  }

  return supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
}
