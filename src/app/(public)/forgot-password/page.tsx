import { CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 sm:py-16">
      <div className="w-full max-w-md">
        <Card className="bg-card text-card-foreground shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-bold sm:text-2xl">Recuperar Acesso</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Informe seu usuário ou email para recuperar o acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
          <CardFooter className="flex justify-center border-t px-6 py-4">
            <Link
              href="/login"
              className="flex items-center text-sm text-custom-secondary hover:text-custom-secondary/80"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
