import { Paragraphs } from "@/components/paragraphs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TInformativeTextContent } from "@/utils/activity-types";
import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type InformativeTextDetailsProps = {
  informativeText: TInformativeTextContent;
};

export function InformativeTextDetails({
  informativeText,
}: InformativeTextDetailsProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">{informativeText.title}</h2>
      {informativeText.description && (
        <Paragraphs text={informativeText.description} />
      )}
      <ScrollArea className="h-[40vh]">
        <Card>
          <CardContent className="space-y-4">
            {informativeText.imageUrl && (
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={informativeText.imageUrl}
                  alt={informativeText.title}
                  fill
                  className="rounded-md object-cover"
                />
              </AspectRatio>
            )}
            <div className="prose prose-neutral dark:prose-invert">
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {informativeText.content}
              </Markdown>
            </div>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
