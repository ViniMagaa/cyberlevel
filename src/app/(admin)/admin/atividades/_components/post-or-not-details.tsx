import { Paragraphs } from "@/components/paragraphs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TPostOrNotContent } from "@/utils/activity-types";
import { BadgeCheckIcon, BadgeX } from "lucide-react";
import Image from "next/image";

type PostOrNotDetailsProps = {
  postOrNot: TPostOrNotContent;
};

export function PostOrNotDetails({ postOrNot }: PostOrNotDetailsProps) {
  return (
    <div className="space-y-2">
      {postOrNot.isSafe ? (
        <Badge
          variant="secondary"
          className="bg-green-500 text-white dark:bg-green-600"
        >
          <BadgeCheckIcon />
          Publicação segura
        </Badge>
      ) : (
        <Badge variant="destructive">
          <BadgeX /> Publicação insegura
        </Badge>
      )}
      <ScrollArea className="h-[60vh]">
        <div className="space-y-2">
          <div>
            <h2 className="text-2xl font-bold">{postOrNot.title}</h2>
            <h3 className="text-lg font-semibold">{postOrNot.description}</h3>
          </div>
          {postOrNot.imageUrl && (
            <AspectRatio ratio={4 / 5}>
              <Image
                src={postOrNot.imageUrl}
                alt={postOrNot.title}
                fill
                className="rounded-md object-cover"
              />
            </AspectRatio>
          )}
          <Separator />
          <div className="space-y-2 text-sm">
            <span className="font-semibold">Justificativa ao acertar:</span>
            <Paragraphs text={postOrNot.justification} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
