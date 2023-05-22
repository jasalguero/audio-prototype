import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const teachersRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({ where: { role: "teacher" } });
  }),
});
