"use server";

import { authenticatedAction } from "@/actions/authenticated-action";
import { CreateAddress } from "@repo/core/modules/addresses/use-cases/create-address";
import { PrismaAddressRepository } from "@repo/db/repositories/prisma-address-repository";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAddressErrorMessage } from "./errors";

const createAddressSchema = z.object({
  recipientName: z.string().min(3),
  street: z.string().min(3),
  number: z.string().min(1),
  complement: z.string().optional(),
  city: z.string().min(2),
  neighborhood: z.string().min(2),
  zipCode: z.string().min(8),
  country: z.string().default("Brasil"),
  phone: z.string().min(10),
  email: z.email(),
  cpfOrCnpj: z.string().min(11),
});

export const createAddress = authenticatedAction
  .inputSchema(createAddressSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const repository = new PrismaAddressRepository();

      await new CreateAddress(repository).execute({
        ...parsedInput,
        userId: ctx.userId,
      });

      revalidatePath("/", "layout");
      return { success: true };
    } catch (error) {
      throw new Error(getAddressErrorMessage(error));
    }
  });
