"use client";

import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Dot,
  LabelList,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";
import SafeInner from "./SafeInner";

type ChartProps = {
  data: {
    date: string;
    weight: number | null;
  }[];
};

export default function Chart({ data }: ChartProps) {
  return (
    <SafeInner className="space-y-3">
      <ChartContainer
        config={{
          weight: {
            label: "체중",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="w-full h-[200px]"
      >
        <LineChart
          data={data}
          margin={{
            left: 16,
            right: 16,
          }}
          height={100}
        >
          <CartesianGrid vertical={false} stroke="#ddd" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(date) => format(date, "M/dd")}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            dataKey="weight"
            type="monotone"
            connectNulls
            stroke="var(--primary)"
            strokeOpacity={0.2}
            strokeWidth={2}
            fill="var(--primary)"
            isAnimationActive={false}
            dot={({ payload, ...props }) => {
              return (
                <Dot
                  key={payload.date}
                  r={4}
                  cx={props.cx}
                  cy={props.cy}
                  fill="var(--primary)"
                />
              );
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
              formatter={(data: number) => Number(data).toString()}
            />
          </Line>
        </LineChart>
      </ChartContainer>
    </SafeInner>
  );
}
