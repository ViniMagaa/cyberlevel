import { TThemedPasswordRules } from "@/utils/activity-types";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

type RuleMessageProps = {
  rule: {
    type: TThemedPasswordRules;
    value?: string;
  };
  onlyText?: boolean;
  valid?: boolean;
};

export function RuleMessage({
  rule,
  onlyText = false,
  valid = true,
}: RuleMessageProps) {
  let message: string = "";

  switch (rule.type) {
    case "MIN_LENGTH":
      message = `A senha deve conter no mínimo ${rule.value} caractere${Number(rule.value) !== 1 ? "s" : ""}`;
      break;
    case "MAX_LENGTH":
      message = `A senha deve conter no máximo ${rule.value} caractere${Number(rule.value) !== 1 ? "s" : ""}`;
      break;
    case "UPPERCASE":
      message = "A senha deve conter pelo menos 1 letra maiúscula";
      break;
    case "LOWERCASE":
      message = "A senha deve conter pelo menos 1 letra minúscula";
      break;
    case "NUMBER":
      message = "A senha deve conter pelo menos 1 número";
      break;
    case "SPECIAL_CHAR":
      message = "A senha deve conter pelo menos 1 caractere especial";
      break;
    case "INCLUDE_WORD":
      message = `A senha deve conter a palavra "${rule.value}"`;
      break;
    case "EXCLUDE_WORD":
      message = `A senha não pode conter a palavra "${rule.value}"`;
      break;
    default:
      message = "Tipo incorreto da senha";
  }

  if (onlyText) return <>{message}</>;

  return (
    <Card
      className={cn(
        "rounded-full p-3 text-center",
        valid
          ? "border-primary-600 bg-primary-800"
          : "border-destructive/60 bg-destructive/40",
      )}
    >
      <CardContent className="p-0">{message}</CardContent>
    </Card>
  );
}
