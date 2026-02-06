"use client"

import { useActionState } from "react"
import { authenticate } from "@/actions/auth"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined)

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta</h1>
        <p className="text-muted-fg text-sm">
          Entre com seu email e senha para acessar seus arquivos.
        </p>
      </div>

      <form action={dispatch} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            required
            className="flex h-10 w-full rounded-md border border-input bg-bg px-3 py-2 text-sm ring-offset-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Senha
            </label>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="flex h-10 w-full rounded-md border border-input bg-bg px-3 py-2 text-sm ring-offset-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm text-red-500">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-accent text-accent-fg hover:bg-accent/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-fg hover:bg-primary/90 h-10 px-4 py-2 w-full cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      <div className="text-center text-sm text-muted-fg">
        Não tem uma conta?{" "}
        <Link href="/auth/signup" className="underline underline-offset-4 hover:text-primary cursor-pointer">
          Crie agora
        </Link>
      </div>
    </div>
  )
}
