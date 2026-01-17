import Quick from "@/components/Quick";
import { Separator } from "@/components/ui/separator";
import WeekStatus from "@/components/WeekStatus";

export default function Page() {
  return (
    <>
      <WeekStatus />
      <Separator className="h-2! bg-gray-100 my-3"/>
      <Quick />
    </>
  );
}
