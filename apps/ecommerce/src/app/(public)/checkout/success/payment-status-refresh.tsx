"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type PaymentStatusRefreshProps = {
  active: boolean;
};

export function PaymentStatusRefresh({ active }: PaymentStatusRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;

    let attempts = 0;
    const interval = window.setInterval(() => {
      attempts += 1;
      router.refresh();

      if (attempts >= 15) {
        window.clearInterval(interval);
      }
    }, 2_000);

    return () => window.clearInterval(interval);
  }, [active, router]);

  return null;
}
