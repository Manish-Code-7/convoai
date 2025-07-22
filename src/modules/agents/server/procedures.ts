import { z } from "zod";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import { and, count, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  // ✅ Get one agent by ID
  getOne: protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    const [existingAgent] = await db
      .select({
        meetingCount: sql<number>`5`, // Replace with actual count later
        ...getTableColumns(agents),
      })
      .from(agents)
      .where(
        and(
          eq(agents.id, input.id),
          eq(agents.userId, ctx.auth.user.id)
        )
      );
      if(!existingAgent){
        throw new TRPCError({code :"NOT_FOUND",message: "Agent not found "})
      }

    return existingAgent;
  }),


  // ✅ Get many agents with pagination and search
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search } = input;

      const whereConditions = [
        eq(agents.userId, ctx.auth.user.id),
        search ? ilike(agents.name, `%${search}%`) : undefined,
      ].filter(Boolean);

      const data = await db
        .select({
          meetingCount: sql<number>`5`, // Your static meetingCount
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(
            and(...whereConditions))
        .orderBy(agents.createdAt) // ✅ Ordering by createdAt
        .limit(pageSize)
        .offset((page - 1) * pageSize);
        
        const [total]= await db
            .select({count: count()})
            .from(agents)
            .where(
                and(...whereConditions
                )
            );

        const totalPages = Math.ceil(total.count /pageSize)

      return {
        items : data,
        total : total.count,
        totalPages
      };
    }),

  // ✅ Create new agent
  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return createdAgent;
    }),
});
