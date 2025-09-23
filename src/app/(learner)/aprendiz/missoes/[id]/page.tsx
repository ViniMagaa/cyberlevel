import { db } from "@/lib/prisma";
import { TFakeNewsContent, TQuizContent } from "@/utils/activity-types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ChildFakeNews } from "./_components/child-fake-news";
import { ChildQuiz } from "./_components/child-quiz";

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

  switch (activity.type) {
    case "QUIZ":
      return (
        <ChildQuiz
          activity={activity}
          quiz={activity.content as unknown as TQuizContent}
          userId={user.id}
        />
      );
    case "FAKE_NEWS":
      return (
        <ChildFakeNews
          activity={activity}
          fakeNews={activity.content as unknown as TFakeNewsContent}
          userId={user.id}
        />
      );
    default:
      return null;
  }
}
