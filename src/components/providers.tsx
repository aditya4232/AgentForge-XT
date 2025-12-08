"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./auth-provider";
import { OnboardingProvider } from "./onboarding";

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <AuthProvider>
            <OnboardingProvider>
                {children}
            </OnboardingProvider>
        </AuthProvider>
    );
}
