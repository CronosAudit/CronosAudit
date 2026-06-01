// lib/auth.ts
import { supabase } from "@/lib/supabase"

/**
 * Refreshes the user session, handling token errors gracefully
 */
export async function refreshSession() {
  try {
    const { data, error } = await supabase.auth.refreshSession()
    
    if (error) {
      const errorMessage = error.message.toLowerCase()
      
      if (errorMessage.includes("refresh") || errorMessage.includes("token")) {
        console.warn("Refresh token inválido, limpando sessão...", error)
        await supabase.auth.signOut()
        return null
      }
      
      throw error
    }
    
    return data.session
  } catch (error) {
    console.error("Erro ao renovar sessão:", error)
    return null
  }
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        name: name.trim(),
      },
      emailRedirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined,
    },
  })

  if (error) {
    const message = error.message.toLowerCase()

    if (error.status === 429 || message.includes("rate")) {
      throw new Error(
        "Muitas tentativas de cadastro. Aguarde alguns minutos antes de tentar novamente."
      )
    }

    throw new Error(error.message)
  }

  return data
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function sendPasswordReset(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : undefined,
    }
  )

  if (error) {
    const message = error.message.toLowerCase()

    if (error.status === 429 || message.includes("rate")) {
      throw new Error(
        "Muitas solicitações de redefinição. Aguarde alguns minutos antes de tentar novamente."
      )
    }

    throw new Error(error.message)
  }

  return data
}

export async function updateUserPassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw new Error(error.message)
  }

  return data.session
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  return data.user
}