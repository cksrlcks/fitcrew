"use client";

import { usePartyQuery } from "@/query/party";
import { Spinner } from "./ui/spinner";
import { format } from "date-fns";
import Link from "next/link";
import { Ticket } from "lucide-react";

export default function PartyList() {
  const { data, isFetching, isError } = usePartyQuery();

  if (isError) {
    return (
      <div className="text-red-500">
        파티 정보를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data?.data.length === 0 && (
        <div className="text-foreground/50 text-center py-10">
          가입된 파티가 없습니다.
        </div>
      )}
      
      {data?.data.map((party) => (
        <Link
          key={party.id}
          href={`/party/${party.id}`}
          className="block bg-card p-6 rounded-lg space-y-3"
        >
          <div className="text-sm text-primary flex items-center gap-2">
            <Ticket size={14}/>
            {party.inviteCode}
          </div>
          <div className="font-semibold text-xl">{party.name}</div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-foreground/70 ">
              멤버 {party.memberCount}명
            </span>
            <span className="text-foreground/30 text-xs">
              {format(new Date(party.createdAt), "yyyy.MM.dd")}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
