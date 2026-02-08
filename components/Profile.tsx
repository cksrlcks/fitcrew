"use client";

import { useAuth } from "@/hook/useAuth";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";

export default function Profile() {
  const { session, isLogoutPending, handleLogout } = useAuth();
  const [isDeletePending, startTransition] = useTransition();

  const handleDeleteUser = async () => {
    startTransition(async () => {
      await authClient.deleteUser();
      window.location.href = "/";
    });
  };

  return (
    <div className="flex flex-col items-center space-y-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <figure className="w-30 h-30">
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt="profile"
              width={120}
              height={120}
              className="rounded-full"
            />
          )}
        </figure>
        <div className="space-y-1">
          <div className="text-lg font-semibold">{session?.user?.name}</div>
          <div className="text-sm text-muted-foreground">
            {session?.user?.email}
          </div>
          {session?.user?.createdAt && (
            <div className="text-sm text-muted-foreground">
              가입일 :{" "}
              {format(new Date(session?.user?.createdAt), "yyyy년 MM월 dd일")}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="secondary">
              로그아웃
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>로그아웃</DialogTitle>
              <DialogDescription>정말 로그아웃 하시겠습니까?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleLogout}
                disabled={isLogoutPending}
              >
                로그아웃
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="destructive">
              탈퇴하기
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>탈퇴하기</DialogTitle>
              <DialogDescription>정말 탈퇴하시겠습니까?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteUser}
                disabled={isDeletePending}
              >
                탈퇴하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
