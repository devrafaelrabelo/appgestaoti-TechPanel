import { APP_NAME } from "@/config"

export function SiteFooter() {
  return (
    <footer className="py-4">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Versão 1.0.0</span>
          <span>•</span>
          <a href="/privacy" className="hover:text-foreground transition-colors">
            Política de Privacidade
          </a>
          <span>•</span>
          <a href="/terms" className="hover:text-foreground transition-colors">
            Termos de Uso
          </a>
        </div>
      </div>
    </footer>
  )
}
