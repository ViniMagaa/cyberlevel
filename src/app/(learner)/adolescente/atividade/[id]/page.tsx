import { getUserSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import {
  TFakeChatContent,
  TFakeNewsContent,
  TMatchPairsContent,
  TQuizContent,
  TThemedPasswordContent,
} from "@/utils/activity-types";
import { redirect } from "next/navigation";
import { TeenFakeChat } from "./_components/teen-fake-chat";
import { TeenFakeNews } from "./_components/teen-fake-news";
import { TeenMatchPairs } from "./_components/teen-match-pairs";
import { TeenQuiz } from "./_components/teen-quiz";
import { TeenThemedPassword } from "./_components/teen-themed-password";

type ActivityPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ActivityPage({ params }: ActivityPageProps) {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const { id } = await params;
  const activity = await db.activity.findUnique({
    include: {
      module: { select: { archetype: { select: { primaryColor: true } } } },
      activityProgress: {
        where: { userId: user.id },
      },
    },
    where: { id },
  });

  if (!activity) return redirect("/adolescente");

  const primaryColor =
    activity.module.archetype?.primaryColor || "var(--color-primary-500)";

  const content = activity.content as unknown;

  switch (activity.type) {
    case "QUIZ":
      return (
        <TeenQuiz
          activity={activity}
          primaryColor={primaryColor}
          quiz={content as TQuizContent}
          userId={user.id}
        />
      );
    case "FAKE_NEWS":
      return (
        <TeenFakeNews
          activity={activity}
          primaryColor={primaryColor}
          fakeNews={content as TFakeNewsContent}
          userId={user.id}
        />
      );
    case "MATCH_PAIRS":
      return (
        <TeenMatchPairs
          activity={activity}
          primaryColor={primaryColor}
          matchPairs={content as TMatchPairsContent}
          userId={user.id}
        />
      );
    case "THEMED_PASSWORD":
      return (
        <TeenThemedPassword
          activity={activity}
          primaryColor={primaryColor}
          themedPassword={content as TThemedPasswordContent}
          userId={user.id}
        />
      );
    case "FAKE_CHAT":
      return (
        <TeenFakeChat
          activity={activity}
          primaryColor={primaryColor}
          fakeChat={content as TFakeChatContent}
          userId={user.id}
        />
      );
    case "POST_OR_NOT":
    case "INFORMATIVE_TEXT":
    default:
      return redirect("/adolescente");
  }
}
