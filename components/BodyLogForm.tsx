"use client";

import z from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { Field, FieldLabel, FieldError, FieldGroup } from "./ui/field";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLogContext } from "./provider/LogProvider";

const bodyLogFormSchema = z.object({
  userId: z.string(),
  logDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  weight: z.number().optional(),
  bodyFatRate: z.number().optional(),
  muscleMass: z.number().optional(),
});

export type BodyLogFormType = z.infer<typeof bodyLogFormSchema>;

export type BodyLogFormProps = {
  submitPortalRef?: React.RefObject<HTMLElement | null> | null;
  onClose?: () => void;
};

export default function BodyLogForm({ onClose }: BodyLogFormProps) {
  const { data: session } = authClient.useSession();
  const { currentData, date } = useLogContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BodyLogFormType>({
    resolver: zodResolver(bodyLogFormSchema),
    defaultValues: {
      userId: session?.user.id || "",
      logDate: format(date || new Date(), "yyyy-MM-dd"),
      weight: currentData?.body?.weight ?? undefined,
      bodyFatRate: currentData?.body?.bodyFatRate ?? undefined,
      muscleMass: currentData?.body?.muscleMass ?? undefined,
    },
  });

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async (data: BodyLogFormType) => {
      const response = await fetch("/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, type: "body" }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit body log");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync(data);

      toast.success("저장되었습니다.");

      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast.error("저장에 실패했습니다.");
      console.error(error);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="text-lg font-semibold text-left tracking-tight">
        {format(date || new Date(), "yy년 M월 dd일")} 기록하기
      </div>
      <Separator className="my-4" />
      <FieldGroup>
        <Field>
          <FieldLabel>체중(kg)</FieldLabel>
          <Input
            type="number"
            step="0.01"
            placeholder="체중을 입력해주세요"
            {...register("weight", {
              setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
            })}
          />
          <FieldError>{errors.weight?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>체지방률(%)</FieldLabel>
          <Input
            type="number"
            step="0.01"
            placeholder="체지방률을 입력해주세요"
            {...register("bodyFatRate", {
              setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
            })}
          />
          <FieldError>{errors.bodyFatRate?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>근육량(kg)</FieldLabel>
          <Input
            type="number"
            step="0.01"
            placeholder="근육량을 입력해주세요"
            {...register("muscleMass", {
              setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
            })}
          />
          <FieldError>{errors.muscleMass?.message}</FieldError>
        </Field>
      </FieldGroup>
      <div className="flex gap-2 mt-4 mb-4 pt-4 sticky bottom-0 bg-white">
        {onClose && (
          <Button
            type="button"
            onClick={onClose}
            className="w-[40%]"
            size="lg"
            variant="outline"
          >
            취소
          </Button>
        )}
        <Button type="submit" className="w-full flex-1" size="lg">
          저장하기
        </Button>
      </div>
    </form>
  );
}
