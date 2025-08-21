import { Paragraphs } from "@/components/paragraphs";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TMatchPairsContent } from "@/utils/activity-types";

type MatchPairsDetailsProps = {
  matchPairs: TMatchPairsContent;
};

export function MatchPairsDetails({ matchPairs }: MatchPairsDetailsProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">{matchPairs.title}</h2>
      <p className="text-sm">Limite: {matchPairs.timeLimit} segundos</p>
      <p className="text-sm">Tentativas: {matchPairs.maxAttempts}</p>
      <Separator />
      <ScrollArea className="h-[40vh]">
        <div className="space-y-2">
          <div className="space-y-4 py-2">
            {matchPairs.concepts.map((pair, index) => (
              <div key={index} className="flex items-center">
                <Card className="px-2 py-1">{pair.term}</Card>
                <div className="bg-primary-900 h-[1px] flex-1" />
                <Card className="px-2 py-1">{pair.definition}</Card>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      {matchPairs.feedback && (
        <>
          <Separator />
          <div className="space-y-2 text-sm">
            <span className="font-semibold">Feedback:</span>
            <Paragraphs text={matchPairs.feedback} />
          </div>
        </>
      )}
    </div>
  );
}
