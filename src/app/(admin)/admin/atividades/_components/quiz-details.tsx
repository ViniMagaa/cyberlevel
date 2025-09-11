import { Paragraphs } from "@/components/paragraphs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TQuizContent } from "@/utils/activity-types";
import { CheckIcon, X } from "lucide-react";

type QuizDetailsProps = {
  quiz: TQuizContent;
};

export function QuizDetails({ quiz }: QuizDetailsProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">{quiz.title}</h2>
      <ScrollArea className="h-[60vh]">
        <div className="space-y-4 py-2">
          {quiz.questions.map((question, index) => (
            <Card key={index} className="gap-2">
              <CardHeader>
                <CardTitle>{question.text}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc space-y-1">
                  {question.options.map((option, oIndex) => (
                    <li key={oIndex} className="ml-6 list-item font-light">
                      <div className="flex items-center gap-2">
                        {option.text}
                        {question.correctIndex === oIndex ? (
                          <div className="bg-primary-600 rounded-full p-1 text-white">
                            <CheckIcon size={14} />
                          </div>
                        ) : (
                          <div className="rounded-full p-1 text-red-500">
                            <X size={14} />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <Separator />
                <div className="space-y-2 text-sm">
                  <span className="font-semibold">Feedback da pergunta:</span>
                  <Paragraphs text={question.feedback} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
