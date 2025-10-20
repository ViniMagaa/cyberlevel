"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { activityType } from "@/utils/enums";
import type { ActivityProgress, ActivityType } from "@prisma/client";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

type ChartBarByTypeProps = {
  data: (ActivityProgress & {
    activity: { type: ActivityType };
  })[];
};

const chartConfig = {
  amount: {
    label: "Quantidade",
    color: "var(--color-primary-700)",
  },
} satisfies ChartConfig;

export function ChartBarByType({ data }: ChartBarByTypeProps) {
  const chartData = useMemo(() => {
    const grouped = data.reduce(
      (acc, curr) => {
        if (curr.status !== "COMPLETED") return acc;
        const type = curr.activity.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<ActivityType, number>,
    );

    return Object.entries(grouped).map(([type, amount]) => ({
      type: activityType[type as unknown as ActivityType],
      amount,
    }));
  }, [data]);

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Tipos de atividades concluídas
        </CardTitle>
        <CardDescription>Distribuição por tipo de atividade</CardDescription>
      </CardHeader>
      <CardContent className="h-full min-h-0">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} margin={{ top: 24 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="type" tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="amount" radius={6} fill="var(--color-primary-700)">
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground text-center text-sm">
              Nenhuma atividade concluída ainda.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 text-lg leading-none font-semibold">
          Desempenho por tipo <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Mostrando quantas atividades foram concluídas de cada tipo
        </div>
      </CardFooter>
    </Card>
  );
}
