import { FakeChatDetails } from "@/app/(admin)/admin/atividades/_components/fake-chat-details";
import { FakeNewsDetails } from "@/app/(admin)/admin/atividades/_components/fake-news-details";
import { InformativeTextDetails } from "@/app/(admin)/admin/atividades/_components/informative-text-details";
import { MatchPairsDetails } from "@/app/(admin)/admin/atividades/_components/match-pairs-details";
import { PostOrNotDetails } from "@/app/(admin)/admin/atividades/_components/post-or-not-details";
import { QuizDetails } from "@/app/(admin)/admin/atividades/_components/quiz-details";
import { ThemedPasswordDetails } from "@/app/(admin)/admin/atividades/_components/themed-password-details";
import {
  TFakeChatContent,
  TFakeNewsContent,
  TInformativeTextContent,
  TMatchPairsContent,
  TPostOrNotContent,
  TQuizContent,
  TThemedPasswordContent,
} from "@/utils/activity-types";
import { activityType } from "@/utils/enums";
import { Activity } from "@prisma/client";
import { Eye } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Separator } from "./ui/separator";

type ActivityDialogDetailsProps = {
  activity: Activity;
};

export function ActivityDialogDetails({
  activity,
}: ActivityDialogDetailsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-neutral-700!">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-7xl">
        <DialogHeader>
          <DialogTitle>{activity.title}</DialogTitle>
          <DialogDescription>{activityType[activity.type]}</DialogDescription>
        </DialogHeader>
        <Separator />
        {activity.type === "FAKE_NEWS" && (
          <FakeNewsDetails
            fakeNews={activity.content as unknown as TFakeNewsContent}
          />
        )}
        {activity.type === "POST_OR_NOT" && (
          <PostOrNotDetails
            postOrNot={activity.content as unknown as TPostOrNotContent}
          />
        )}
        {activity.type === "QUIZ" && (
          <QuizDetails quiz={activity.content as unknown as TQuizContent} />
        )}
        {activity.type === "THEMED_PASSWORD" && (
          <ThemedPasswordDetails
            themedPassword={
              activity.content as unknown as TThemedPasswordContent
            }
          />
        )}
        {activity.type === "FAKE_CHAT" && (
          <FakeChatDetails
            fakeChat={activity.content as unknown as TFakeChatContent}
          />
        )}
        {activity.type === "MATCH_PAIRS" && (
          <MatchPairsDetails
            matchPairs={activity.content as unknown as TMatchPairsContent}
          />
        )}
        {activity.type === "INFORMATIVE_TEXT" && (
          <InformativeTextDetails
            informativeText={
              activity.content as unknown as TInformativeTextContent
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
