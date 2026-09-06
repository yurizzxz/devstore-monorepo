"use client";

import { createAddress, removeAddress, updateAddress } from "@/actions/address";
import type { Address } from "@repo/core/modules/addresses/domain/address";
import { Button } from "@repo/ui/components/button";

import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { AddressForm, AddressFormValues } from "./address-form";

type AddressManagerProps = {
  addresses: Address[];
};

export function AddressManager({ addresses }: AddressManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(addresses.length === 0);

  function closeForm() {
    setEditingAddress(null);
    setShowForm(false);
  }

  function handleSubmit(values: AddressFormValues) {
    startTransition(async () => {
      const result = editingAddress
        ? await updateAddress({ id: editingAddress.id, ...values })
        : await createAddress(values);

      if (!result.data?.success) {
        toast.error(
          result.serverError ?? "Não foi possível salvar o endereço.",
        );
        return;
      }

      toast.success(
        editingAddress ? "Endereço atualizado." : "Endereço adicionado.",
      );
      closeForm();
      router.refresh();
    });
  }

  function handleRemove(address: Address) {
    if (!window.confirm(`Remover o endereço de ${address.recipientName}?`))
      return;

    startTransition(async () => {
      const result = await removeAddress({ id: address.id });

      if (!result.data?.success) {
        toast.error(
          result.serverError ?? "Não foi possível remover o endereço.",
        );
        return;
      }

      toast.success("Endereço removido.");
      router.refresh();
    });
  }

  return (
    <div
      className={
        showForm
          ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-start"
          : undefined
      }
    >
      <section>
        <div className="flex flex-col gap-5 border-b border-zinc-800 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Sua conta</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Endereços de entrega
            </h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Mantenha seus destinos prontos para finalizar compras com menos
              etapas.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingAddress(null);
              setShowForm(true);
            }}
            type="button"
          >
            <Plus /> Novo endereço
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="py-16 text-center">
            <MapPin className="mx-auto size-10 text-primary" />
            <h2 className="mt-5 text-xl font-semibold">
              Nenhum endereço salvo
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
              Cadastre seu primeiro endereço para liberar o checkout.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {addresses.map((address) => (
              <li className="flex gap-4 py-6" key={address.id}>
                <MapPin className="mt-1 size-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{address.recipientName}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    {address.street}, {address.number}
                    {address.complement ? `, ${address.complement}` : ""}
                    <br />
                    {address.neighborhood}, {address.city} · CEP{" "}
                    {address.zipCode}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    aria-label={`Editar endereço de ${address.recipientName}`}
                    disabled={isPending}
                    onClick={() => {
                      setEditingAddress(address);
                      setShowForm(true);
                    }}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    aria-label={`Remover endereço de ${address.recipientName}`}
                    disabled={isPending}
                    onClick={() => handleRemove(address)}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 className="text-red-400" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside
        className={`border-zinc-800 bg-zinc-900/40 p-5 sm:p-7 lg:sticky lg:top-44 ${
          showForm ? "border" : "hidden"
        }`}
      >
        <AddressForm
          address={editingAddress ?? undefined}
          isPending={isPending}
          key={editingAddress?.id ?? "new"}
          onCancel={closeForm}
          onSubmit={handleSubmit}
        />
      </aside>
    </div>
  );
}
