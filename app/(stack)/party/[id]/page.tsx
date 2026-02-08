"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hook/useAuth";
import { PartyDetail } from "@/lib/type";
import {
  useDeletePartyMutation,
  useLeavePartyMutation,
  usePartyDetailQuery,
} from "@/query/party";
import { Copy, Crown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import AddPartyModal from "@/components/AddPartyModal";

export type HexColor = `#${string}`;
export const DEFAULT_COLORS = [
  "#7AC555",
  "#760DDE",
  "#FFA500",
  "#76A5EA",
  "#FF6B6B",
  "#4ECDC4",
  "#FFD93D",
  "#5F6CAF",
  "#D7263D",
] as const satisfies HexColor[];

export function getColorByString(value: string, colorArray: readonly string[]) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash *= 16777619;
  }

  const index = Math.abs(hash) % colorArray.length;
  return colorArray[index];
}

const formattedToOwnerFirst = (ownerId: string, data: PartyDetail) => {
  const ownerIndex = data.members.findIndex((m) => m.userId === ownerId);

  if (ownerIndex === -1) return data.members;

  const owner = data.members[ownerIndex];
  const others = data.members.filter((_, index) => index !== ownerIndex);
  return [owner, ...others];
};

export default function PartyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { session } = useAuth();
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
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-xl">{data?.data.name}</div>
            <div className="text-foreground/50 text-sm">
              멤버 {formattedMembers.length}명
            </div>
          </div>

          {isOwner && (
            <AddPartyModal mode="edit" partyData={data?.data}>
              <Button type="button" variant="secondary">
                수정
              </Button>
            </AddPartyModal>
          )}
        </div>
        <div className="mt-4 flex overflow-x-auto pb-4 py-2">
          {formattedMembers.map((member) => {
            const colorCode = getColorByString(
              member.user.name[0],
              DEFAULT_COLORS,
            );
            const isOwner = member.userId === data?.data.ownerId;

            return (
              <div
                key={member.userId}
                className="inline-flex flex-col items-center mr-4"
              >
                <div
                  className="w-15 h-15 rounded-full bg-card flex items-center justify-center text-2xl font-semibold mb-2 relative"
                  style={{
                    backgroundColor: colorCode,
                  }}
                >
                  {isOwner && (
                    <span className="absolute top-0 -right-1 bg-primary text-black w-6 h-6 rounded-full flex items-center justify-center outline-background outline-2">
                      <Crown size={14} />
                    </span>
                  )}
                  {member.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {member.user.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <div className="w-full">
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={handleCopyInviteCode}
          >
            <Copy className="w-3!" />
            초대 코드: {data?.data.inviteCode}
          </Button>
        </div>
        {isOwner ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="ghost" className="opacity-40">
                {isDeleting ? <Spinner /> : "파티 해산하기"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>파티 해산하기</AlertDialogTitle>
                <AlertDialogDescription>
                  정말 파티를 해산하시겠습니까?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  variant="destructive"
                  disabled={isDeleting}
                >
                  {isDeleting ? <Spinner /> : "파티 해산하기"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="ghost" className="opacity-40">
                {isLeaving ? <Spinner /> : "파티 나가기"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>파티 나가기</AlertDialogTitle>
                <AlertDialogDescription>
                  정말 파티에서 나가시겠습니까?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLeaving}>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLeave}
                  variant="destructive"
                  disabled={isLeaving}
                >
                  {isLeaving ? <Spinner /> : "파티 나가기"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
