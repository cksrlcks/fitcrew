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
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { Spinner } from "./ui/spinner";

type PartyDetailControlsProps = {
  inviteCode: string;
  isOwner: boolean;
  isDeleting: boolean;
  isLeaving: boolean;
  onCopy: () => void;
  onDelete: () => void;
  onLeave: () => void;
};

export default function PartyDetailControls({
  onCopy,
  inviteCode,
  isOwner,
  isDeleting,
  isLeaving,
  onDelete,
  onLeave,
}: PartyDetailControlsProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-full">
        <Button
          type="button"
          className="w-full"
          variant="outline"
          onClick={onCopy}
        >
          <Copy className="w-3!" />
          초대 코드: {inviteCode}
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
              <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
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
                onClick={onLeave}
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
  );
}
