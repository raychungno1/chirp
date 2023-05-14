import { type User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

const filterUserForClient = ({ id, username, profileImageUrl }: User) => {
  if (!username) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }
  return { id, username, profileImageUrl };
};

export default filterUserForClient;
