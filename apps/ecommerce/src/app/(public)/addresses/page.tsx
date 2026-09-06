import { requireCustomer } from "@/lib/require-customer";
import { ListUserAddresses } from "@repo/core/modules/addresses/use-cases/list-user-addresses";
import { PrismaAddressRepository } from "@repo/db/repositories/prisma-address-repository";
import type { Metadata } from "next";

import { AddressManager } from "./_components/address-manager";

export const metadata: Metadata = {
  title: "Meus endereços",
};

export default async function AddressesPage() {
  const session = await requireCustomer();
  const addresses = await new ListUserAddresses(
    new PrismaAddressRepository(),
  ).execute(session.user.id);

  return (
    <main className="mx-auto min-h-[70vh] max-w-360 px-4 py-10 sm:px-6 lg:py-16">
      <AddressManager addresses={addresses} />
    </main>
  );
}
