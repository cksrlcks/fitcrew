"use client";

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
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod/v4";
import { Spinner } from "./ui/spinner";
import { useJoinPartyMutation } from "@/query/party";

const JoinPartyFormSchema = z.object({
  inviteCode: z
    .string()
    .min(1, "초대 코드를 입력해주세요")
    .max(8, "초대 코드는 8자 입니다."),
});

export type JoinPartyFormType = z.infer<typeof JoinPartyFormSchema>;

export default function JoinPartyModal({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinPartyFormType>({
    resolver: zodResolver(JoinPartyFormSchema),
    defaultValues: {
      inviteCode: "",
    },
  });

  const { mutateAsync, isPending } = useJoinPartyMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync(data);
      toast.success("파티에 참여되었습니다.");
      setOpen(false);
    } catch (error) {
      console.error("파티 참여 실패:", error);
      toast.error("파티 참여에 실패했습니다.");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form className="flex-1 space-y-6" onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>파티 참여하기</DialogTitle>
            <DialogDescription>
              초대 코드를 입력하여 파티에 참여하세요
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">파티 이름</Label>
              <Input
                id="inviteCode"
                placeholder="초대 코드를 입력해주세요"
                {...register("inviteCode")}
              />
              <FieldError>{errors.inviteCode?.message}</FieldError>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                취소
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "파티 참여하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
