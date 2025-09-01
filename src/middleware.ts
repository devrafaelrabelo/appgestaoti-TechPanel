import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Configurações iniciais
const publicRoutes = new Set(["/login", "/forgot-password", "/help"])
const staticFileRegex = /\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot|json|xml|txt|map)$/
const authCookies = [
  process.env.NEXT_PUBLIC_COOKIE_ACCESS,
  process.env.NEXT_PUBLIC_COOKIE_REFRESH,
  process.env.NEXT_PUBLIC_COOKIE_2FA,
]

// Função para verificar se a rota é pública
const isPublicRoute = (pathname: string) =>
  [...publicRoutes].some((route) => pathname === route || pathname.startsWith(`${route}/`))

// Função para verificar se o caminho é de um arquivo estático
const isStaticFile = (pathname: string) =>
  pathname.startsWith("/_next/") ||
  pathname.startsWith("/static/") ||
  pathname.startsWith("/.well-known/") ||
  pathname.includes("/favicon") ||
  staticFileRegex.test(pathname)

// Função para verificar se os cookies de autenticação estão presentes
const hasAuthCookies = (cookies: string) =>
  authCookies.some((cookieName) => cookies.includes(`${cookieName}=`))

// Função para criar uma resposta com headers de autenticação
const createResponse = (response: NextResponse, isAuthenticated: boolean) => {
  response.headers.set("X-Auth-Status", isAuthenticated ? "authenticated" : "unauthenticated")
  response.cookies.set("auth_status", isAuthenticated ? "authenticated" : "unauthenticated", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60,
    path: "/",
  })
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cookies = request.headers.get("cookie") || ""

  // Ignorar rotas da API e arquivos estáticos
  if (isStaticFile(pathname)) {
    return NextResponse.next()
  }

  const userHasAuth = hasAuthCookies(cookies)

  // Redirecionar baseado na autenticação
  if (pathname === "/") {
    const destination = userHasAuth
      ? request.cookies.get("redirect_after_login")?.value || "/modules"
      : "/login"
    const response = NextResponse.redirect(new URL(destination, request.url))
    if (userHasAuth) response.cookies.delete("redirect_after_login")
    return createResponse(response, userHasAuth)
  }

  // Bloquear acesso a rotas protegidas sem autenticação
  if (!isPublicRoute(pathname) && !userHasAuth) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.set("redirect_after_login", pathname, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 300,
      path: "/",
    })
    return createResponse(response, false)
  }

  // Redirecionar usuários autenticados da página de login
  if (pathname === "/login" && userHasAuth) {
    const destination = request.cookies.get("redirect_after_login")?.value || "/modules"
    const response = NextResponse.redirect(new URL(destination, request.url))
    response.cookies.delete("redirect_after_login")
    return createResponse(response, true)
  }

  // Permitir acesso
  return createResponse(NextResponse.next(), userHasAuth)
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
}