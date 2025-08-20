import { TThemedPasswordRules } from "@/utils/activity-types";
import { Card, CardContent } from "./ui/card";

type RuleMessageProps = {
  rule: {
    type: TThemedPasswordRules;
    value?: string;
  };
};

export function RuleMessage({ rule }: RuleMessageProps) {
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
      message = `A senha pode conter a palavra "${rule.value}"`;
      break;
    case "EXCLUDE_WORD":
      message = `A senha não pode conter a palavra "${rule.value}"`;
      break;
    default:
      message = "Tipo incorreto da senha";
  }

  return (
    <Card className="border-primary-600 bg-primary-400 dark:border-primary-600 dark:bg-primary-800 p-3 text-center">
      <CardContent className="p-0">{message}</CardContent>
    </Card>
  );
}
