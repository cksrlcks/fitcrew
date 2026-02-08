import PageHeader from "@/components/PageHeader";
import PartyControls from "@/components/PartyControls";
import PartyList from "@/components/PartyList";
import SafeInner from "@/components/SafeInner";

export default function PartyPage() {
  return (
    <SafeInner className="space-y-7">
      <PageHeader
        title="파티 관리"
        desc="함께 운동하는 친구들과 파티를 만들어보세요"
      />
      <PartyControls />
      <PartyList />
    </SafeInner>
  );
}
