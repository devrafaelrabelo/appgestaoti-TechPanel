import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/login", "/forgot-password", "/register", "/test", "/help"]
const apiRoutes = ["/api"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log(`🔍 Middleware: ${pathname}`)

  // Ignorar rotas da API
  if (apiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Ignorar arquivos estáticos
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/.well-known/") ||
    pathname.includes("/favicon") ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot|json|xml|txt|map)$/)
  ) {
    return NextResponse.next()
  }

  // Verificar cookies de autenticação básicos
  const cookies = request.headers.get("cookie") || ""
  const hasAuthCookies = [process.env.NEXT_PUBLIC_COOKIE_ACCESS, process.env.NEXT_PUBLIC_COOKIE_REFRESH, process.env.NEXT_PUBLIC_COOKIE_2FA].some((cookieName) =>
    cookies.includes(`${cookieName}=`),
  )

  console.log(`🍪 Cookies de auth encontrados: ${hasAuthCookies}`)

  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // Função para criar resposta com headers de auth
  const createResponse = (response: NextResponse, isAuthenticated: boolean) => {
    response.headers.set("X-Auth-Status", isAuthenticated ? "authenticated" : "unauthenticated")

    // Cookie não-HttpOnly para o JavaScript ler
    response.cookies.set("auth_status", isAuthenticated ? "authenticated" : "unauthenticated", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60,
      path: "/",
    })

    return response
  }

  // Rota raiz - redirecionar baseado na autenticação
  if (pathname === "/") {
    if (hasAuthCookies) {
      const redirectCookie = request.cookies.get("redirect_after_login")?.value
      const destination = redirectCookie || "/modules"
      console.log(`🏠 Redirecionando autenticado para: ${destination}`)
      const response = NextResponse.redirect(new URL(destination, request.url))
      if (redirectCookie) response.cookies.delete("redirect_after_login")
      return createResponse(response, true)
    } else {
      console.log(`🏠 Redirecionando não autenticado para: /login`)
      const response = NextResponse.redirect(new URL("/login", request.url))
      return createResponse(response, false)
    }
  }

  // Bloquear acesso a rotas protegidas sem cookies de auth
  if (!isPublicRoute && !hasAuthCookies) {
    console.log(`🚫 Bloqueando acesso não autenticado a: ${pathname}`)
    const response = NextResponse.redirect(new URL("/login", request.url))

    // Salvar rota para redirecionamento após login
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
  if (pathname === "/login" && hasAuthCookies) {
    const redirectCookie = request.cookies.get("redirect_after_login")?.value
    const destination = redirectCookie || "/modules"
    console.log(`🔄 Redirecionando usuário autenticado do login para: ${destination}`)
    const response = NextResponse.redirect(new URL(destination, request.url))
    response.cookies.delete("redirect_after_login")
    return createResponse(response, true)
  }

  // Permitir acesso
  console.log(`✅ Permitindo acesso a: ${pathname}`)
  const response = NextResponse.next()
  return createResponse(response, hasAuthCookies)
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
}
