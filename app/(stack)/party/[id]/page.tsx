"use client";

import { Spinner } from "@/components/ui/spinner";
import PartySummary from "@/components/PartySummary";
import usePartyDetail from "@/hook/usePartyDetail";
import { useParams } from "next/navigation";
import PartyDetailControls from "@/components/PartyDetailControls";
import PartyDetailHeader from "@/components/PartyDetailHeader";
import PartyDetailMemberList from "@/components/PartyDetailMemberList";

export default function PartyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data,
    isLoading,
    formattedMembers,
    isOwner,
    isLeaving,
    isDeleting,
    handleDelete,
    handleLeave,
    handleCopyInviteCode,
  } = usePartyDetail(id);

  if (!id) {
    return <div>파티를 찾을 수 없습니다.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PartyDetailHeader
        name={data?.data.name || "이름 없음"}
        count={data?.data.members.length || 0}
        isOwner={isOwner}
        data={data?.data}
      />

      <PartyDetailMemberList //
        members={formattedMembers}
        data={data?.data}
      />

      <PartyDetailControls
        onCopy={handleCopyInviteCode}
        inviteCode={data?.data.inviteCode || ""}
        isOwner={isOwner}
        isDeleting={isDeleting}
        isLeaving={isLeaving}
        onDelete={handleDelete}
        onLeave={handleLeave}
      />

      <PartySummary partyId={id} />
    </div>
  );
}
