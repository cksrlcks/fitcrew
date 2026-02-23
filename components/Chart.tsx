"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  LabelList,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { eachDayOfInterval, format, parse } from "date-fns";
import { useLogContext } from "./provider/LogProvider";
import { DailyLog } from "@/lib/type";

const buildChartData = (data?: Record<string, DailyLog>) => {
  if (!data) return [];

  const keys = Object.keys(data).filter((key) => data[key]?.body != null);
  if (keys.length === 0) return [];

  let startKey = keys[0];
  let endKey = keys[0];

  for (const key of keys) {
    if (key < startKey) startKey = key;
    if (key > endKey) endKey = key;
  }

  const startDate = parse(startKey, "yyyy-MM-dd", new Date());
  const endDate = parse(endKey, "yyyy-MM-dd", new Date());

  return eachDayOfInterval({ start: startDate, end: endDate }).map((d) => {
    const key = format(d, "yyyy-MM-dd");

    return {
      date: key,
      weight: data[key]?.body?.weight ?? null,
    };
  });
};

export default function Chart() {
  const { data } = useLogContext();
  const chartData = buildChartData(data);

  const xTicks = (() => {
    if (chartData.length === 0) return [];

    const lastIndex = chartData.length - 1;
    const mid1 = Math.floor(lastIndex / 3);
    const mid2 = Math.floor((lastIndex * 2) / 3);

    return [
      chartData[0].date,
      chartData[mid1].date,
      chartData[mid2].date,
      chartData[lastIndex].date,
    ];
  })();

  return (
    <ChartContainer
      config={{
        weight: {
          label: "체중",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="w-full h-[200px]"
    >
      <AreaChart
        data={chartData}
        height={100}
        margin={{ top: 20, left: 0, right: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fillWeight" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--primary)"
              stopOpacity={0.2}
            />
            <stop
              offset="95%"
              stopColor="var(--primary)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke="#333" strokeDasharray="3 6" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(date) => format(date, "M/dd")}
          ticks={xTicks}
          interval="preserveStartEnd"
        />
        <YAxis domain={["dataMin - 2", "dataMax + 2"]} axisLine={false} hide />
        <ChartTooltip content={<ChartTooltipContent />} />

        <Area
          dataKey="weight"
          type="monotone"
          connectNulls
          stroke="var(--primary)"
          strokeWidth={3}
          fill="url(#fillWeight)"
          isAnimationActive={false}
          dot={false}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
            content={({ x, y, value, index }) => {
              if (value == null || index == null) return null;
              const lastIndex = chartData.length - 1;
              const shouldRender = index === 0 || index === lastIndex;
              if (!shouldRender) return null;

              return (
                <text
                  x={
                    index === 0 ? 20 : index === lastIndex ? Number(x) - 18 : x
                  }
                  y={Number(y || 0) - 10}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize={12}
                >
                  {value}
                </text>
              );
            }}
          />
        </Area>
      </AreaChart>
    </ChartContainer>
  );
}
