// contexts/AuthContext.tsx
"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type UserProfile = {
  id: string;
  auth_user_id: string;
  name: string | null;
  email: string | null;
  role?: string | null;
  is_active?: boolean | null;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/planos",
  "/solucoes",
  "/contato",
];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

async function getProfile(authUserId: string) {
  return null;
}
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshProfile = React.useCallback(async () => {
    const currentUser = user;

    if (!currentUser) {
      setProfile(null);
      return;
    }

    const profileData = await getProfile(currentUser.id);
    setProfile(profileData);
  }, [user]);

  React.useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        setIsLoading(true);

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        // Handle refresh token errors gracefully
        if (error) {
          const errorMessage = error.message.toLowerCase();
          if (errorMessage.includes("refresh") || errorMessage.includes("token")) {
            console.warn("Refresh token inválido ou expirado, limpando sessão...", error);
            // Clear invalid session
            await supabase.auth.signOut();
          }
          throw error;
        }

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const profileData = await getProfile(session.user.id);

          if (!mounted) return;

          setProfile(profileData);
        } else {
          setProfile(null);

          if (!isPublicRoute(pathname)) {
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Erro ao validar sessão:", errorMessage);

        if (!mounted) return;

        setSession(null);
        setUser(null);
        setProfile(null);

        if (!isPublicRoute(pathname)) {
          router.replace("/login");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const profileData = await getProfile(newSession.user.id);
        setProfile(profileData);
      } else {
        setProfile(null);

        if (!isPublicRoute(pathname)) {
          router.replace("/login");
        }
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();

    setSession(null);
    setUser(null);
    setProfile(null);

    router.replace("/login");
    router.refresh();
  }, [router]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      isLoading,
      isAuthenticated: Boolean(user && session),
      refreshProfile,
      signOut,
    }),
    [user, session, profile, isLoading, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider");
  }

  return context;
}