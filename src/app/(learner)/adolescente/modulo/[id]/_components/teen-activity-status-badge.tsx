import { Badge } from "@/components/ui/badge";
import { progressStatus } from "@/utils/enums";
import { ProgressStatus } from "@prisma/client";

type ActivityStatusBadgeProps = {
  status: ProgressStatus;
  primaryColor: string;
};

export function TeenActivityStatusBadge({
  status,
  primaryColor,
}: ActivityStatusBadgeProps) {
  const message = progressStatus[status];

  if (status === "COMPLETED") {
    return <Badge style={{ backgroundColor: primaryColor }}>{message}</Badge>;
  }

  if (status === "IN_PROGRESS") {
    return <Badge variant="outline">{message}</Badge>;
  }

  return <Badge variant="secondary">{message}</Badge>;
}
