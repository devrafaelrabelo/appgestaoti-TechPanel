/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // Removendo qualquer referência a variáveis de ambiente
  env: {}, // Objeto vazio para garantir que não há variáveis definidas aqui
  // Desativando qualquer verificação de variáveis de ambiente
  experimental: {
    // Configurações experimentais sem dependências de variáveis de ambiente
  },
  // Garantindo que não há configurações de servidor que dependam de variáveis de ambiente
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},
}

export default nextConfig
