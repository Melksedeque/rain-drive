"use client"

import { useActionState } from "react"
import { signup } from "@/actions/auth"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function SignupPage() {
  const [errorMessage, dispatch, isPending] = useActionState(signup, undefined)

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight">Crie sua conta</h1>
        <p className="text-muted-fg text-sm">
          Comece a armazenar seus arquivos na nuvem (seca).
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
            minLength={8}
            className="flex h-10 w-full rounded-md border border-input bg-bg px-3 py-2 text-sm ring-offset-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p className="text-xs text-muted-fg">Mínimo de 8 caracteres</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm text-red-500">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-fg hover:bg-primary/90 h-10 px-4 py-2 w-full cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            "Criar conta"
          )}
        </button>
      </form>

      <div className="text-center text-sm text-muted-fg">
        Já tem uma conta?{" "}
        <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
          Entrar
        </Link>
      </div>
    </div>
  )
}
