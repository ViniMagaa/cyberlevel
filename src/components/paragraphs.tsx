import { cn } from "@/lib/utils";

type ParagraphsProps = {
  text: string;
  className?: string;
};

export function Paragraphs({ text, className }: ParagraphsProps) {
  return text.split("\n").map((paragraph, i) => (
    <p className={cn("text-muted-foreground", className)} key={i}>
      {paragraph}
    </p>
  ));
}
