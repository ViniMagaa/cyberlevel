type ParagraphsProps = {
  text: string;
};

export function Paragraphs({ text }: ParagraphsProps) {
  return text.split("\n").map((paragraph, i) => (
    <p className="text-muted-foreground" key={i}>
      {paragraph}
    </p>
  ));
}
