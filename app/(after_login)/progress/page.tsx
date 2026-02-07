import MonthScrollCalendar from "@/components/MonthScrollCalendar";
import MonthController from "@/components/MonthController";
import DailyLog from "@/components/DailyLog";

export default function ProgressPage() {
  return (
    <>
      <MonthController />
      <MonthScrollCalendar />
    
      <div className="h-8"></div>

      <DailyLog />
    </>
  );
}
