type ApiConfig = {
  baseUrl: string
  seleniumUrl: string
  userHubUrl: string
  wppUrl: string
  monitorhealth: string
  timeout: number
}

type AuthCookies = {
  access: string
  refresh: string
  twofa: string
  statusHeader: string
  statusCookie: string
}

type AppConfig = {
  appName: string
  logoUrl: string
  locale: string
  theme: string
  revalidateInterval: number
  allowedEmailDomain: string
}

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
    seleniumUrl: process.env.NEXT_PUBLIC_API_SELENIUM_URL || "/selenium",
    userHubUrl: process.env.NEXT_PUBLIC_API_USERHUB_URL || "/userhub",
    wppUrl: process.env.NEXT_PUBLIC_WPP_API_URL || "/wpp",
    monitorhealth: process.env.NEXT_PUBLIC_WPP_MONITORHEALTH || "/monitor",
    timeout: 10000,
  } as ApiConfig,

  cookies: {
    access: process.env.NEXT_PUBLIC_COOKIE_ACCESS || "__access",
    refresh: process.env.NEXT_PUBLIC_COOKIE_REFRESH || "__refresh",
    twofa: process.env.NEXT_PUBLIC_COOKIE_2FA || "__2fa",
    statusCookie: process.env.NEXT_PUBLIC_COOKIE_AUTH_STATUS || "auth_status",
    statusHeader: process.env.NEXT_PUBLIC_HEADER_AUTH_STATUS || "X-Auth-Status",
  } as AuthCookies,

  app: {
    appName: process.env.NEXT_PUBLIC_APP_NAME || "AppGestaoTI",
    logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || "/logo.svg",
    locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "pt-BR",
    theme: process.env.NEXT_PUBLIC_THEME || "dark",
    revalidateInterval: Number(process.env.NEXT_PUBLIC_REVALIDATE_INTERVAL || 30000),
    allowedEmailDomain: process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || "bemprotege",
  } as AppConfig,
}

// API endpoints
export const API_BASE = config.api.baseUrl
export const SELENIUM_BASE = config.api.seleniumUrl
export const MONITORHEALTH = config.api.monitorhealth
export const USERHUB_BASE = config.api.userHubUrl
export const WPP_BASE = config.api.wppUrl

// App brandingssw
export const APP_NAME = config.app.appName
export const LOGO_URL = config.app.logoUrl


export const ALLOWED_EMAIL_DOMAIN = config.app.allowedEmailDomain
