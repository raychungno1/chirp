import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import filterUserForClient from "~/utils/filteredUser";

export const profileRouter = createTRPCRouter({
  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const { username } = input;

      const [user] = (
        await clerkClient.users.getUserList({
          username: [username],
        })
      ).map(filterUserForClient);

      return user;
    }),
});
