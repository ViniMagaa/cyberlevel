import { db } from "@/lib/prisma";
import {
  TFakeNewsContent,
  TMatchPairsContent,
  TQuizContent,
} from "@/utils/activity-types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ChildFakeNews } from "./_components/child-fake-news";
import { ChildQuiz } from "./_components/child-quiz";
import { ChildMatchPairs } from "./_components/child-match-pairs";

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
    default:
      return null;
  }
}
