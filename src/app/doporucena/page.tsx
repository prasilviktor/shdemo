"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Sloučeno do „Najít péči" (/search) — doporučená jsou tam výchozí pohled. */
export default function DoporucenaRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/search");
  }, [router]);
  return null;
}
