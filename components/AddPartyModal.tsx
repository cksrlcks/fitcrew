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
import { useAddPartyMutation } from "@/query/party";

export const PARTY_NAME_PRESETS = [
  "하루한결",
  "같이걷기",
  "오늘도한발",
  "천천히감량",
  "소소한변화",
  "같이해요",
  "한걸음파티",
  "가벼운약속",
  "서로응원",
  "작은습관",

  "함께감량",
  "리듬있는몸",
  "다시시작",
  "같이버티기",
  "한몸팀",
  "밸런스메이트",
  "서로체크",
  "꾸준클럽",
  "팀리셋",
  "우리루틴",

  "비온몸",
  "라온핏",
  "하루핏",
  "온몸결",
  "소하핏",
  "모아핏",
  "라이트온",
  "밸런스온",
  "데일리핏",
  "온리듬",

  "모린핏",
  "두아온",
  "라세핏",
  "하로온",
  "소민결",
  "네오핏",
  "타린온",
  "루아핏",
  "비로온",
  "케민핏",

  "핏메이트",
  "함께핏",
  "핏동무",
  "팀핏온",
  "핏파티",
  "온핏클럽",
  "우리핏",
  "핏루프",
  "핏라운드",
  "밸런스팀",
];

const getRandomPartyName = () =>
  PARTY_NAME_PRESETS[Math.floor(Math.random() * PARTY_NAME_PRESETS.length)];

const PartyFormSchema = z.object({
  name: z
    .string()
    .min(1, "파티 이름을 입력해주세요")
    .max(30, "파티 이름은 최대 30자까지 가능합니다"),
});

export type PartyFormType = z.infer<typeof PartyFormSchema>;

export default function AddPartyModal({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartyFormType>({
    resolver: zodResolver(PartyFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutateAsync, isPending } = useAddPartyMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync(data);
      toast.success("파티가 생성되었습니다.");
      setOpen(false);
    } catch (error) {
      console.error("파티 생성 실패:", error);
      toast.error("파티 생성에 실패했습니다.");
    }
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (nextOpen) {
          reset({
            name: getRandomPartyName(),
          });
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form className="flex-1 space-y-6" onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>새 파티 만들기</DialogTitle>
            <DialogDescription>
              파티 생성 후 초대코드가 자동으로 생성됩니다
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">파티 이름</Label>
              <Input
                id="name"
                placeholder="파티 이름을 입력해주세요"
                {...register("name")}
              />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                취소
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "파티 만들기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
