<<<<<<< HEAD
import { AgeGroup, User, UserRole } from "@prisma/client";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { ROLE_PATHS } from "../role-paths";

function getPathForRole(role?: UserRole | null, ageGroup?: AgeGroup | null) {
  if (role === "ADMIN") return ROLE_PATHS.ADMIN;
  if (role === "RESPONSIBLE") return ROLE_PATHS.RESPONSIBLE;
  if (role === "LEARNER") {
    if (ageGroup === "CHILD") return ROLE_PATHS.LEARNER.CHILD;
    if (ageGroup === "TEEN") return ROLE_PATHS.LEARNER.TEEN;
  }

  return "/";
}
=======
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "./server";
import { User } from "@prisma/client";
import { publicRoutes } from "../public-routes";
>>>>>>> 774d0193b4bae464265fff6bb89c0711d3c7c445

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  // Se for rota pública, deixa passar
  if (publicRoutes.includes(pathname)) return supabaseResponse;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userData = user?.id
    ? ((await supabase.from("User").select("*").eq("id", user.id).single())
        .data as User)
    : null;

  // Bloqueia não logado
  if (
    (!user || !userData) &&
    !pathname.startsWith("/entrar") &&
    !pathname.startsWith("/cadastrar")
  ) {
<<<<<<< HEAD
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    return NextResponse.redirect(url);
  }

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

  // Restrições de acesso
  const url = request.nextUrl.clone();
  const expectedPath = getPathForRole(userData?.role, userData?.ageGroup);

  if (!url.pathname.startsWith(expectedPath)) {
    url.pathname = expectedPath;
    return NextResponse.redirect(url);
=======
    return NextResponse.redirect(new URL("/entrar", request.url));
>>>>>>> 774d0193b4bae464265fff6bb89c0711d3c7c445
  }

  // Evita usuário logado voltar pro login/cadastro
  if (
<<<<<<< HEAD
    userData &&
    (url.pathname.startsWith("/entrar") ||
      url.pathname.startsWith("/cadastrar"))
  ) {
    url.pathname = expectedPath;
    return NextResponse.redirect(url);
=======
    user &&
    userData &&
    (pathname.startsWith("/entrar") || pathname.startsWith("/cadastrar"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
>>>>>>> 774d0193b4bae464265fff6bb89c0711d3c7c445
  }

  // Calcula dashboard esperada
  let expectedPath = "/";
  switch (userData?.role) {
    case "ADMIN":
      expectedPath = "/admin";
      break;
    case "LEARNER":
      if (userData.ageGroup === "CHILD") {
        expectedPath = "/aprendiz/crianca";
      } else if (userData.ageGroup === "TEEN") {
        expectedPath = "/aprendiz/adolescente";
      }
      break;
    case "RESPONSIBLE":
      expectedPath = "/responsavel";
      break;
  }

  if (pathname.startsWith(expectedPath)) {
    return supabaseResponse;
  }

  return NextResponse.redirect(new URL(expectedPath, request.url));
}
