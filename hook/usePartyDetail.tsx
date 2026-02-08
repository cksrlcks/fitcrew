import { useMemo } from "react";
import { useAuth } from "./useAuth";
import {
  useDeletePartyMutation,
  useLeavePartyMutation,
  usePartyDetailQuery,
} from "@/query/party";
import { PartyDetail } from "@/lib/type";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formattedToOwnerFirst = (ownerId: string, data: PartyDetail) => {
  const ownerIndex = data.members.findIndex((m) => m.userId === ownerId);

  if (ownerIndex === -1) return data.members;

  const owner = data.members[ownerIndex];
  const others = data.members.filter((_, index) => index !== ownerIndex);
  return [owner, ...others];
};

export default function usePartyDetail(id: string) {
  const { session } = useAuth();
  const router = useRouter();
  const { data, isLoading } = usePartyDetailQuery(id || "");

  const formattedMembers = useMemo(() => {
    if (!data) return [];
    return formattedToOwnerFirst(data.data.ownerId, data.data);
  }, [data]);

  const isOwner = data?.data.ownerId === session?.user.id;

  const { mutateAsync: leaveParty, isPending: isLeaving } =
    useLeavePartyMutation();
  const { mutateAsync: deleteParty, isPending: isDeleting } =
    useDeletePartyMutation();

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteParty(id);
      toast.success("파티를 해산했습니다.");
      router.replace("/party");
    } catch (error) {
      console.error("Failed to delete party:", error);
      toast.error("에러가 발생했습니다.");
    }
  };

  const handleLeave = async () => {
    if (!id) return;
    try {
      await leaveParty(id);
      toast.success("파티에서 나갔습니다.");
      router.replace("/party");
    } catch (error) {
      console.error("Failed to leave party:", error);
      toast.error("에러가 발생했습니다.");
    }
  };

  const handleCopyInviteCode = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.data.inviteCode);
      toast.success("초대 코드를 복사했습니다.");
    } catch (error) {
      console.error("Failed to copy invite code:", error);
      toast.error("초대 코드 복사에 실패했습니다.");
    }
  };

  return {
    data,
    isLoading,
    formattedMembers,
    isOwner,
    isLeaving,
    isDeleting,
    handleDelete,
    handleLeave,
    handleCopyInviteCode,
  };
}
