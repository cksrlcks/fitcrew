import PartyControls from "@/components/PartyControls";
import PartyList from "@/components/PartyList";
import SafeInner from "@/components/SafeInner";

export default function PartyPage() {
  return (
    <div className="space-y-8">
      <SafeInner className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">파티</h2>
          <div className="text-foreground/50">
            친구들과 함께 체중 변화를 공유하세요
          </div>
        </div>
        <PartyControls />
      </SafeInner>

      <SafeInner>
        <PartyList />
      </SafeInner>
    </div>
  );
}
