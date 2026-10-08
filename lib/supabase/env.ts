export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

// Sem as variáveis o site continua no ar com o conteúdo padrão;
// só o painel /admin deixa de funcionar.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const IMAGES_BUCKET = "site-images";
