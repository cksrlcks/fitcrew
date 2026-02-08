"use client";

import { Button } from "./ui/button";
import AddPartyModal from "./AddPartyModal";
import JoinPartyModal from "./JoinPartyModal";

export default function PartyControls() {
  return (
    <>
      <div className="flex gap-1 items-center">
        <JoinPartyModal>
          <Button variant="outline" className="flex-1">
            초대코드로 가입
          </Button>
        </JoinPartyModal>
        <AddPartyModal>
          <Button variant="default" className="flex-1">
            파티 만들기
          </Button>
        </AddPartyModal>
      </div>
    </>
  );
}
