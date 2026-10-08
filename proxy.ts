import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "@/lib/supabase/env";

const LOGIN_PATH = "/admin/login";

// Renova a sessão do painel e manda para o login quem não estiver logado.
// A permissão de verdade é checada no banco (RLS) e nas server actions.
export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        for (const [key, value] of Object.entries(headers ?? {})) {
          response.headers.set(key, value);
        }
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const loggedIn = Boolean(data?.claims);
  const onLogin = request.nextUrl.pathname === LOGIN_PATH;

  if (!loggedIn && !onLogin) {
    return redirectKeepingCookies(request, LOGIN_PATH, response);
  }
  if (loggedIn && onLogin) {
    return redirectKeepingCookies(request, "/admin", response);
  }
  return response;
}

function redirectKeepingCookies(request: NextRequest, path: string, from: NextResponse) {
  const redirect = NextResponse.redirect(new URL(path, request.url));
  for (const cookie of from.cookies.getAll()) redirect.cookies.set(cookie);
  return redirect;
}

export const config = {
  matcher: ["/admin/:path*"],
};
