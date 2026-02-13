"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { DashboardLoader } from "@/components/ui/dashboard-loader";
import { authClient } from "@/lib/auth-client";

export function PageClient() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const hasRedirected = useRef(false);

  // Redirect to sign-up if no session after loading
  useEffect(() => {
    if (!isPending && !session && !hasRedirected.current) {
      hasRedirected.current = true;
      // Use replace instead of push to avoid adding to history
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  // Fallback: force redirect if useEffect didn't trigger within 200ms
  useEffect(() => {
    if (!isPending && !session) {
      const timer = setTimeout(() => {
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          window.location.href = "/sign-in";
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isPending, session]);

  // When authenticated, redirect directly to a default demo team's dashboard
  useEffect(() => {
    if (!isPending && session && !hasRedirected.current) {
      hasRedirected.current = true;
      // Use a fixed "demo" workspace so we don't depend on the teams API / database
      router.replace("/dashboard/demo/issues");
    }
  }, [isPending, session, router]);

  // If loading, show loader
  if (isPending && !hasRedirected.current) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <DashboardLoader
          message="Loading your workspace"
          submessage="Setting up your dashboard..."
        />
      </div>
    );
  }

  // If no session, show redirecting message
  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DashboardLoader message="Redirecting..." submessage="Please sign in to continue" />
      </div>
    );
  }

  // Fallback while redirecting (component may unmount quickly)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <DashboardLoader
        message="Redirecting..."
        submessage="Opening your dashboard"
      />
    </div>
  );
}