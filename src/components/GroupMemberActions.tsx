"use client";

import { UserMinus, LogOut } from "lucide-react";
import { removeGroupMember, updateMemberRole } from "@/app/groups-actions";

type Props = {
  groupId: number;
  memberId: number;
  memberRole: string;
  currentUserId: number;
  isOwner: boolean;
};

export default function GroupMemberActions({
  groupId,
  memberId,
  memberRole,
  currentUserId,
  isOwner,
}: Props) {
  const isSelf = memberId === currentUserId;
  const isMemberOwner = memberRole === "owner";

  return (
    <div className="row">
      {isOwner && !isSelf && !isMemberOwner && (
        <>
          <form action={updateMemberRole}>
            <input type="hidden" name="groupId" value={groupId} />
            <input type="hidden" name="userId" value={memberId} />
            <select
              name="role"
              className="input"
              style={{ minHeight: "34px", fontSize: "0.8rem", padding: "0 0.5rem" }}
              defaultValue={memberRole}
              onChange={(e) => e.target.form?.requestSubmit()}
            >
              <option value="member">Lector</option>
              <option value="editor">Editor</option>
            </select>
          </form>

          <form action={removeGroupMember}>
            <input type="hidden" name="groupId" value={groupId} />
            <input type="hidden" name="userId" value={memberId} />
            <button
              className="btn danger small"
              title="Quitar del grupo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 0.5rem",
              }}
            >
              <UserMinus size={13} />
            </button>
          </form>
        </>
      )}

      {isSelf && !isMemberOwner && (
        <form action={removeGroupMember}>
          <input type="hidden" name="groupId" value={groupId} />
          <input type="hidden" name="userId" value={memberId} />
          <button
            className="btn ghost small"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <LogOut size={13} />
            <span>Salir del grupo</span>
          </button>
        </form>
      )}
    </div>
  );
}
