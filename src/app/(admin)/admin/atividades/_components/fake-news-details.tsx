import { Paragraphs } from "@/components/paragraphs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TFakeNewsContent } from "@/utils/activity-schemas";
import { format } from "date-fns";
import { BadgeCheckIcon, BadgeX, Globe } from "lucide-react";
import Image from "next/image";

type FakeNewsDetailsProps = {
  fakeNews: TFakeNewsContent;
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
      <ScrollArea className="h-[60vh]">
        <div className="space-y-2 text-justify">
          {fakeNews.imageUrl && (
            <AspectRatio ratio={16 / 9}>
              <Image
                src={fakeNews.imageUrl}
                alt={fakeNews.title}
                fill
                className="rounded-md object-cover"
              />
            </AspectRatio>
          )}
          <div>
            <h2 className="text-2xl font-bold">{fakeNews.title}</h2>
            <h3 className="text-lg font-semibold">{fakeNews.subtitle}</h3>
            <p className="text-sm">
              {fakeNews.author ? fakeNews.author : "Sem autor"}
            </p>
            <p className="text-sm">
              Data de publicação:{" "}
              {fakeNews.publicationDate
                ? format(fakeNews.publicationDate, "dd/MM/yyyy")
                : "Sem data"}
            </p>
          </div>
          <Paragraphs text={fakeNews.text} />
          <Separator />
          <div className="text-sm">
            <span className="font-semibold">Feedback ao acertar:</span>
            <Paragraphs text={fakeNews.feedback} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
