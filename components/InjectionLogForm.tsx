"use client";

import z from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldContent,
  FieldTitle,
  FieldDescription,
} from "./ui/field";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLogContext } from "./provider/LogProvider";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const injectionLogFormSchema = z.object({
  userId: z.string(),
  logDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  drugType: z.enum(["MOUNJARO", "WEGOVY"]).optional(),
  dosage: z.number().optional(),
  note: z.string().optional(),
});

export type InjectionLogFormType = z.infer<typeof injectionLogFormSchema>;

export type InjectionLogFormProps = {
  submitPortalRef?: React.RefObject<HTMLElement | null> | null;
  onClose?: () => void;
};

export default function InjectionLogForm({
  onClose,
}: InjectionLogFormProps) {
  const { data: session } = authClient.useSession();
  const { currentData, date } = useLogContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InjectionLogFormType>({
    resolver: zodResolver(injectionLogFormSchema),
    defaultValues: {
      userId: session?.user.id || "",
      logDate: format(date || new Date(), "yyyy-MM-dd"),
      drugType: currentData?.injection?.drugType ?? undefined,
      dosage: currentData?.injection?.dosage ?? undefined,
      note: currentData?.injection?.note ?? undefined,
    },
  });

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async (data: InjectionLogFormType) => {
      const response = await fetch("/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, type: "injection" }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit injection log");
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
          <FieldLabel>약물 종류</FieldLabel>
          <RadioGroup defaultValue="MOUNJARO">
            <FieldLabel htmlFor="mounjaro">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>마운자로</FieldTitle>
                  <FieldDescription>
                    티르제파티드 (Tirzepatide)
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="MOUNJARO" id="mounjaro" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="wegovy">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>위고비</FieldTitle>
                  <FieldDescription>
                    세마글루타이드 (Semaglutide)
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="WEGOVY" id="wegovy" />
              </Field>
            </FieldLabel>
          </RadioGroup>
          <FieldError>{errors.drugType?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>투약량(mg)</FieldLabel>
          <Input
            type="number"
            step="0.01"
            placeholder="투약량을 입력해주세요"
            {...register("dosage", {
              setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
            })}
          />
          <FieldError>{errors.dosage?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>메모</FieldLabel>
          <Textarea placeholder="메모를 입력해주세요" {...register("note")} />
          <FieldError>{errors.note?.message}</FieldError>
        </Field>
      </FieldGroup>
      <div className="flex gap-2 mt-8 mb-4">
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
