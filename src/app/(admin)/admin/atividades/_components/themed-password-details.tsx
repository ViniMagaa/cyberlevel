import { Paragraphs } from "@/components/paragraphs";
import { RuleMessage } from "@/components/rule-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TThemedPasswordContent } from "@/utils/activity-types";

type ThemedPasswordDetailsProps = {
  themedPassword: TThemedPasswordContent;
};

export function ThemedPasswordDetails({
  themedPassword,
}: ThemedPasswordDetailsProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">{themedPassword.title}</h2>
      <Paragraphs text={themedPassword.mission} />
      <Separator />
      <ScrollArea className="h-[40vh]">
        <div className="space-y-2">
          <div className="space-y-4 py-2">
            {themedPassword.rules.map((rule, index) => (
              <RuleMessage key={index} rule={rule} />
            ))}
          </div>
        </div>
      </ScrollArea>
      <Separator />
      <div className="space-y-2 text-sm">
        <span className="font-semibold">Feedback:</span>
        <Paragraphs text={themedPassword.feedback} />
      </div>
    </div>
  );
}
