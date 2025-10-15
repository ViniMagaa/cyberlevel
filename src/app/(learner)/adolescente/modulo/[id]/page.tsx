import { BackButton } from "@/components/back-button";
import { getUserSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TeenActivities } from "./_components/teen-activities";

type ModulePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ModulePage({ params }: ModulePageProps) {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const { id } = await params;
  const teenModule = await db.module.findUnique({
    where: { id },
    include: {
      archetype: true,
      activities: {
        include: { activityProgress: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!teenModule) return redirect("/adolescente");

  const primaryColor =
    teenModule.archetype?.primaryColor || "var(--color-primary-500)";

  return (
    <div className="flex w-full flex-col gap-4 py-4">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap gap-2 px-4">
        <BackButton size="icon" path="/adolescente" />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {teenModule.iconUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={teenModule.iconUrl}
                alt={teenModule.title}
                width={32}
                height={32}
                className="w-8 object-contain object-top"
              />
            )}
            <h1
              className="text-2xl font-bold sm:text-4xl"
              style={{ color: primaryColor }}
            >
              {teenModule.title}
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl text-xs sm:text-sm">
            {teenModule.description}
          </p>
        </div>
      </div>

      <TeenActivities module={teenModule} primaryColor={primaryColor} />
    </div>
  );
}
