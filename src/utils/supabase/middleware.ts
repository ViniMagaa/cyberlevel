"use server";

import { AgeGroup, User, UserRole } from "@prisma/client";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { publicRoutes } from "../public-routes";
import { ROLE_PATHS } from "../role-paths";

function getPathForRole(role?: UserRole | null, ageGroup?: AgeGroup | null) {
  if (role === "ADMIN") return ROLE_PATHS.ADMIN;
  if (role === "RESPONSIBLE") return ROLE_PATHS.RESPONSIBLE;
  if (role === "LEARNER") {
    if (ageGroup === "CHILD") return ROLE_PATHS.LEARNER.CHILD;
    if (ageGroup === "TEEN") return ROLE_PATHS.LEARNER.TEEN;
  }

  return "";
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  // Se for rota pública, deixa passar
  if (publicRoutes.includes(pathname)) return supabaseResponse;

  const supabase = await createServerClient(
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

  let userData: User | null = null;

  // Busca role no Supabase
  if (user) {
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      userData = data;
    }
  }

  // Bloqueia não logado
  if (
    (!user || !userData) &&
    !pathname.startsWith("/entrar") &&
    !pathname.startsWith("/cadastrar")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    return NextResponse.redirect(url);
  }

  // Restrições de acesso
  const url = request.nextUrl.clone();
  const expectedPath = getPathForRole(userData?.role, userData?.ageGroup);

  if (!url.pathname.startsWith(expectedPath)) {
    url.pathname = expectedPath;
    return NextResponse.redirect(url);
  }

  // Evita usuário logado voltar pro login/cadastro
  if (
    userData &&
    (url.pathname.startsWith("/entrar") ||
      url.pathname.startsWith("/cadastrar"))
  ) {
    url.pathname = expectedPath;
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith(expectedPath)) {
    return supabaseResponse;
  }

  return NextResponse.redirect(new URL(expectedPath, request.url));
}
