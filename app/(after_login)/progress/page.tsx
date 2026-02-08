import MonthScrollCalendar from "@/components/MonthScrollCalendar";
import MonthController from "@/components/MonthController";
import SafeInner from "@/components/SafeInner";
import HeaderLogAddButton from "@/components/HeaderLogAddButton";
import PageHeader from "@/components/PageHeader";
import Quick from "@/components/Quick";
import Chart from "@/components/Chart";

export default function ProgressPage() {
  return (
    <SafeInner className="space-y-7">
      <PageHeader title="몸무게 기록" desc="나의 체중 변화를 추적하세요">
        <HeaderLogAddButton />
      </PageHeader>
      <MonthController />
      <MonthScrollCalendar />
      <Quick />
      <Chart />
    </SafeInner>
  );
}
