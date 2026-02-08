import MonthScrollCalendar from "@/components/MonthScrollCalendar";
import MonthController from "@/components/MonthController";
import DailyLog from "@/components/DailyLog";
import SafeInner from "@/components/SafeInner";
import HeaderLogAddButton from "@/components/HeaderLogAddButton";

export default function ProgressPage() {
  return (
    <div className="space-y-7">
      <SafeInner className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">몸무게 기록</h2>
          <div className="text-foreground/50">나의 체중 변화를 추적하세요</div>
        </div>
        <HeaderLogAddButton />
      </SafeInner>

      <SafeInner>
        <MonthController />
        <MonthScrollCalendar />
      </SafeInner>

      <DailyLog />
    </div>
  );
}
