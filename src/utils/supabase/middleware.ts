import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Bloqueia não logado
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/") &&
    !request.nextUrl.pathname.startsWith("/entrar") &&
    !request.nextUrl.pathname.startsWith("/cadastrar")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    return NextResponse.redirect(url);
  }

  let role: string | null = null;

  // Busca role no Supabase
  if (user) {
    const { data, error } = await supabase
      .from("User")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      role = data.role;
    }
  }

  // Restrições de acesso
  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (path.startsWith("/aprendiz") && role !== "LEARNER") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (path.startsWith("/responsavel") && role !== "RESPONSIBLE") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Evita usuário logado voltar pro login/cadastro
  if (role && (path.startsWith("/entrar") || path.startsWith("/cadastrar"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
