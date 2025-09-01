"use client"

import { LoginForm } from "@/features/auth/components/login-form"
import { APP_NAME, LOGO_URL } from "@/config"
import { useAuth } from "@/features/auth/context/auth-context"


export default function LoginPage() {
  const { isInitialLoading } = useAuth()

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Lado esquerdo - Formulário de login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-background">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <img
                src={LOGO_URL || "/placeholder.svg"}
                alt={`${APP_NAME} Logo`}
                className="h-8 w-8 object-contain mr-2"
              />
              <h1 className="text-2xl font-bold text-foreground">{APP_NAME}</h1>
            </div>
          </div>

          {/* Adicione mx-auto aqui para centralizar o card do formulário */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h1 className="text-3xl font-bold mb-2 text-card-foreground">Bem-vindo de volta</h1>
              <p className="text-muted-foreground mb-8">Acesse sua conta para continuar</p>

              <LoginForm />

              <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>
                  Precisa de ajuda?{" "}
                  <a href="#" className="text-primary hover:underline">
                    Entre em contato com o suporte
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Visual */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br overflow-hidden relative items-center justify-center">
        <div className="relative z-10 flex flex-col justify-center items-center p-16 text-white h-full w-full">
          <div className="mb-8">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-center">Gestão Ambiental Inteligente</h2>
          <p className="text-center text-white/80 max-w-md">
            Plataforma completa para monitoramento e gestão de recursos ambientais com tecnologia de ponta e relatórios
            em tempo real.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-white/80">Precisão nos dados</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-white/80">Monitoramento</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-2xl font-bold">+500</div>
              <div className="text-sm text-white/80">Empresas</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-2xl font-bold">+30</div>
              <div className="text-sm text-white/80">Países</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 text-white/60 text-sm">
          © 2025 {APP_NAME}. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}
