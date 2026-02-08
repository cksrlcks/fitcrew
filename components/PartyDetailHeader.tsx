import AddPartyModal from "./AddPartyModal";
import { Button } from "./ui/button";
import { PartyDetail } from "@/lib/type";

type PartyDetailHeaderProps = {
  name: string;
  count: number;
  isOwner: boolean;
  data?: PartyDetail;
};

export default function PartyDetailHeader({
  name,
  count,
  isOwner,
  data,
}: PartyDetailHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <div className="text-xl">{name}</div>
        <div className="text-foreground/50 text-sm">멤버 {count}명</div>
      </div>

      {isOwner && (
        <AddPartyModal mode="edit" partyData={data}>
          <Button type="button" variant="secondary">
            수정
          </Button>
        </AddPartyModal>
      )}
    </div>
  );
}
