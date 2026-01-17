"use client";

import { LineChart, Line, XAxis, CartesianGrid, Dot, LabelList } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";

type ChartProps = {
  data: {
    date: string;
    weight: number | null;
  }[];
};

export default function Chart({ data }: ChartProps) {
  return (
    <ChartContainer
      config={{
        weight: {
          label: "체중",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="w-full"
    >
      <LineChart
        data={data}
        margin={{
          top: 40,
          left: 32,
          right: 32,
        }}
        
      >
        <CartesianGrid vertical={false} />
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
            console.log(payload);
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
  );
}
