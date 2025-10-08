import { getUserSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { TFakeNewsContent, TQuizContent } from "@/utils/activity-types";
import { redirect } from "next/navigation";
import { TeenFakeNews } from "./_components/teen-fake-news";
import { TeenQuiz } from "./_components/teen-quiz";

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
    case "THEMED_PASSWORD":
    case "FAKE_CHAT":
    case "POST_OR_NOT":
    case "INFORMATIVE_TEXT":
    default:
      return redirect("/adolescente");
  }
}
