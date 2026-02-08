import { PartyDetail } from "@/lib/type";
import { DEFAULT_COLORS, getColorByString } from "@/lib/utils";
import { Crown } from "lucide-react";

type PartyDetailMemberListProps = {
  members: PartyDetail["members"];
  data?: PartyDetail;
};

export default function PartyDetailMemberList({
  members,
  data,
}: PartyDetailMemberListProps) {
  return (
    <div className="mt-4 flex overflow-x-auto pb-4 py-2">
      {members.map((member) => {
        const colorCode = getColorByString(member.user.name[0], DEFAULT_COLORS);
        const isOwner = member.userId === data?.ownerId;

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
  );
}
