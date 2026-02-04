"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
})

export async function signup(prevState: string | undefined, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const validatedFields = signupSchema.safeParse({ email, password })

  if (!validatedFields.success) {
    return "Campos inválidos. Verifique os dados."
  }

  const { email: validatedEmail, password: validatedPassword } = validatedFields.data

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedEmail },
    })

    if (existingUser) {
      return "Este email já está em uso."
    }

    const hashedPassword = await bcrypt.hash(validatedPassword, 10)

    await prisma.user.create({
      data: {
        email: validatedEmail,
        passwordHash: hashedPassword,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return "Erro ao criar conta. Tente novamente."
  }
  
  // Login automático após signup
  try {
    await signIn("credentials", {
      email: validatedEmail,
      password: validatedPassword,
      redirectTo: "/drive",
    })
  } catch (error) {
    if (error instanceof AuthError) {
        switch (error.type) {
            case "CredentialsSignin":
                return "Credenciais inválidas."
            default:
                return "Erro no login automático."
        }
    }
    throw error // Redirect throws error, so we need to rethrow
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciais inválidas."
        default:
          return "Algo deu errado."
      }
    }
    throw error
  }
}
