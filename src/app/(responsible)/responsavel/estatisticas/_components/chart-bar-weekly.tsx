"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";
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

type WeeklyData = { day: string; activities: number };

const chartConfig = {
  activities: {
    label: "Atividades",
    color: "var(--color-primary-500)",
  },
} satisfies ChartConfig;

export function ChartBarWeekly({ data }: { data: WeeklyData[] }) {
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Atividades da semana
        </CardTitle>
        <CardDescription>Últimos 7 dias</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data} margin={{ top: 24 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="activities"
              fill="var(--color-primary-500)"
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 text-lg leading-none font-semibold">
          Constância semanal <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Mostrando atividades concluídas por dia
        </div>
      </CardFooter>
    </Card>
  );
}
