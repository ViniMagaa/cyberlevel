import { db } from "@/lib/prisma";
import {
  TFakeChatContent,
  TFakeNewsContent,
  TMatchPairsContent,
  TPostOrNotContent,
  TQuizContent,
  TThemedPasswordContent,
} from "@/utils/activity-types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ChildFakeNews } from "./_components/child-fake-news";
import { ChildQuiz } from "./_components/child-quiz";
import { ChildMatchPairs } from "./_components/child-match-pairs";
import { ChildThemedPassword } from "./_components/child-themed-password";
import { ChildFakeChat } from "./_components/child-fake-chat";
import { ChildPostOrNot } from "./_components/child-post-or-not";

type ActivityPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ActivityPage({ params }: ActivityPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/dashboard");

  const { id } = await params;
  const activity = await db.activity.findUnique({
    include: {
      activityProgress: {
        where: { userId: user.id },
      },
    },
    where: { id },
  });

  if (!activity) return redirect("/dashboard");

  const content = activity.content as unknown;

  switch (activity.type) {
    case "QUIZ":
      return (
        <ChildQuiz
          activity={activity}
          quiz={content as TQuizContent}
          userId={user.id}
        />
      );
    case "FAKE_NEWS":
      return (
        <ChildFakeNews
          activity={activity}
          fakeNews={content as TFakeNewsContent}
          userId={user.id}
        />
      );
    case "MATCH_PAIRS":
      return (
        <ChildMatchPairs
          activity={activity}
          matchPairs={content as TMatchPairsContent}
          userId={user.id}
        />
      );
    case "THEMED_PASSWORD":
      return (
        <ChildThemedPassword
          activity={activity}
          themedPassword={content as TThemedPasswordContent}
          userId={user.id}
        />
      );
    case "FAKE_CHAT":
      return (
        <ChildFakeChat
          activity={activity}
          fakeChat={content as TFakeChatContent}
          userId={user.id}
        />
      );
    case "POST_OR_NOT":
      return (
        <ChildPostOrNot
          activity={activity}
          postOrNot={content as TPostOrNotContent}
          userId={user.id}
        />
      );
    default:
      return redirect("/dashboard");
  }
}
