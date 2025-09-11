import { Paragraphs } from "@/components/paragraphs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TFakeChatContent } from "@/utils/activity-types";
import { CheckIcon } from "lucide-react";

type FakeChatDetailsProps = {
  fakeChat: TFakeChatContent;
};

export function FakeChatDetails({ fakeChat }: FakeChatDetailsProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">{fakeChat.title}</h2>
      <ScrollArea className="h-[60vh]">
        <div className="space-y-8">
          {fakeChat.messages.map((message, index) => (
            <div className="space-y-4 py-2" key={index}>
              <Separator />
              <div className="space-y-2">
                <p className="text-muted-foreground mb-2 text-sm">
                  Desconhecido
                </p>
                <Card className="w-fit gap-2 rounded-bl-none px-4 py-2">
                  <CardContent className="p-0">
                    {message.characterMessage}
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground text-right text-sm">Opções</p>
              <div className="flex flex-col items-end gap-4 text-right">
                {message.options.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <Card
                      className={cn(
                        "rounded-br-none px-4 py-2",
                        option.isSafe
                          ? "border-primary-600 bg-primary-400 dark:border-primary-600 dark:bg-primary-800"
                          : "bg-destructive dark:bg-destructive/60 dark:border-destructive border-red-900",
                      )}
                    >
                      <CardContent className="flex items-center gap-2 p-0">
                        {option.isSafe && (
                          <div className="bg-primary-500 dark:bg-primary-600 rounded-full p-1 text-white">
                            <CheckIcon size={14} />
                          </div>
                        )}
                        {option.text}
                      </CardContent>
                    </Card>
                    <div className="space-y-2 text-sm">
                      <span className="font-semibold">Feedback:</span>
                      <Paragraphs text={option.feedback} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
