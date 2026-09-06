"use server";

import { authenticatedAction } from "@/actions/authenticated-action";
import { UpdateAddress } from "@repo/core/modules/addresses/use-cases/update-address";
import { PrismaAddressRepository } from "@repo/db/repositories/prisma-address-repository";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getUpdateAddressErrorMessage } from "./errors";

const updateAddressSchema = z
  .object({
    id: z.string().min(1),
    recipientName: z.string().min(3).optional(),
    street: z.string().min(3).optional(),
    number: z.string().min(1).optional(),
    complement: z.string().nullable().optional(),
    city: z.string().min(2).optional(),
    neighborhood: z.string().min(2).optional(),
    zipCode: z.string().min(8).optional(),
    country: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    email: z.email().optional(),
    cpfOrCnpj: z.string().min(11).optional(),
  })
  .refine(({ id: _id, ...data }) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });

export const updateAddress = authenticatedAction
  .inputSchema(updateAddressSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const repository = new PrismaAddressRepository();
      const { id, ...data } = parsedInput;

      await new UpdateAddress(repository).execute({
        id,
        userId: ctx.userId,
        data,
      });

      revalidatePath("/", "layout");
      return { success: true };
    } catch (error) {
      throw new Error(getUpdateAddressErrorMessage(error));
    }
  });
