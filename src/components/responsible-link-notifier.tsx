"use client";

import { ResponsibleLink } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

type ResponsibleLinkNotifierProps = {
  responsibleLinks: ResponsibleLink[];
  redirectTo: string;
};

export function ResponsibleLinkNotifier({
  responsibleLinks,
  redirectTo,
}: ResponsibleLinkNotifierProps) {
  const router = useRouter();
  const hasShown = useRef(false);

  useEffect(() => {
    if (
      !hasShown.current &&
      responsibleLinks.some(({ status }) => status === "PENDING")
    ) {
      hasShown.current = true;
      toast("Você possui solicitações de responsáveis pendentes", {
        action: {
          label: "Verificar",
          onClick: () => router.push(redirectTo),
        },
      });
    }
  }, [responsibleLinks, redirectTo, router]);

  return null;
}
