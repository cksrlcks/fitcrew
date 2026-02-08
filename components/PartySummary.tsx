import { usePartySummaryQuery } from "@/query/party";
import SummaryCard from "./SummaryCard";
import { Spinner } from "./ui/spinner";

export default function PartySummary({ partyId }: { partyId: string }) {
  const { data, isLoading, isError } = usePartySummaryQuery(partyId);

  return (
    <div className="space-y-4">
      <h3 className="text-sm text-muted-foreground">체중 기록 요약</h3>
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Spinner />
          </div>
        ) : (
          data?.data.members.map((item) => (
            <SummaryCard
              key={item.userId}
              name={item.name || "이름 없음"}
              current={item.stats.currentWeight || 0}
              totalChange={item.stats.totalChange || 0}
              lossRate={item.stats.lossRate || 0}
              recentLogs={item.recent7Days.days || []}
              streakDays={item.stats.streakDays || 0}
            />
          ))
        )}
      </div>
    </div>
  );
}
