import { Paragraphs } from "@/components/paragraphs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TFakeNews } from "@/utils/activity-schemas";
import { BadgeCheckIcon, BadgeX, Globe } from "lucide-react";

type FakeNewsDetailsProps = {
  fakeNews: TFakeNews;
};

export function FakeNewsDetails({ fakeNews }: FakeNewsDetailsProps) {
  return (
    <div className="space-y-2">
      {fakeNews.isFake ? (
        <Badge variant="destructive">
          <BadgeX /> Falsa
        </Badge>
      ) : (
        <Badge
          variant="secondary"
          className="bg-green-500 text-white dark:bg-green-600"
        >
          <BadgeCheckIcon />
          Verdadeira
        </Badge>
      )}
      <div className="flex items-center gap-2">
        <Globe />
        <Input disabled value={fakeNews.source} />
      </div>
      <ScrollArea className="h-[50vh]">
        <div className="space-y-2 text-justify">
          {fakeNews.imageUrl && (
            <AspectRatio ratio={16 / 9}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fakeNews.imageUrl}
                alt={fakeNews.title}
                className="h-full w-full rounded-md object-cover"
              />
            </AspectRatio>
          )}
          <h2 className="text-2xl font-bold">{fakeNews.title}</h2>
          <Paragraphs text={fakeNews.text} />
        </div>
      </ScrollArea>
      <Separator />
      <div className="text-sm">
        <span className="font-semibold">Feedback ao acertar:</span>
        <Paragraphs text={fakeNews.feedback} />
      </div>
    </div>
  );
}
