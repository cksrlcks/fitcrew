"use client";

import { Plus } from "lucide-react";
import { useLogContext } from "./provider/LogProvider";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";

export default function HeaderLogAddButton() {
  const { onOpen, date, isLoading } = useLogContext();

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={() => onOpen(true, "weight", date)}
        disabled={isLoading}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Plus strokeWidth={2} size={20} />
            <span>기록 추가</span>
          </>
        )}
      </Button>
    </>
  );
}
