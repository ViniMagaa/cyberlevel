import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "./server";
import { User } from "@prisma/client";
import { publicRoutes } from "../public-routes";

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
    return NextResponse.redirect(new URL("/entrar", request.url));
  }

  // Evita usuário logado voltar pro login/cadastro
  if (
    user &&
    userData &&
    (pathname.startsWith("/entrar") || pathname.startsWith("/cadastrar"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
