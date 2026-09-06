"use client";

import { createOrder } from "@/actions/order/create-order";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/form";
import { Check, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type CheckoutAddress = {
  id: string;
  recipientName: string;
  street: string;
  number: string;
  complement: string | null;
  city: string;
  neighborhood: string;
  zipCode: string;
};

type CheckoutFormProps = {
  addresses: CheckoutAddress[];
  disabled: boolean;
};

const checkoutFormSchema = z.object({
  shippingAddressId: z.string().min(1, "Selecione um endereço de entrega."),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export function CheckoutForm({ addresses, disabled }: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      shippingAddressId: addresses[0]?.id ?? "",
    },
  });

  function handleCreateOrder(values: CheckoutFormValues) {
    startTransition(async () => {
      const result = await createOrder(values);

      if (!result.data?.success) {
        toast.error(result.serverError ?? "Não foi possível criar o pedido.");
        return;
      }

      toast.success("Pedido criado com sucesso.");
      router.push("/orders");
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form className="mt-10" onSubmit={form.handleSubmit(handleCreateOrder)}>
        <section>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Endereço de entrega</h2>
            <Button asChild size="sm" variant="ghost">
              <Link href="/addresses">
                <Plus /> Adicionar
              </Link>
            </Button>
          </div>

          {addresses.length === 0 ? (
            <div className="mt-4 border border-zinc-800 p-6">
              <p className="font-medium">Cadastre um endereço para continuar.</p>
              <p className="mt-2 text-sm text-zinc-400">
                O endereço será copiado para o pedido e preservado no histórico.
              </p>
              <Button asChild className="mt-5">
                <Link href="/addresses">Cadastrar endereço</Link>
              </Button>
            </div>
          ) : (
            <FormField
              control={form.control}
              name="shippingAddressId"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormControl>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {addresses.map((address) => {
                        const selected = field.value === address.id;

                        return (
                          <label
                            className={`relative cursor-pointer border p-5 transition-colors focus-within:ring-2 focus-within:ring-primary ${
                              selected
                                ? "border-primary bg-primary/10"
                                : "border-zinc-800 hover:border-zinc-600"
                            }`}
                            key={address.id}
                          >
                            <input
                              checked={selected}
                              className="sr-only"
                              name={field.name}
                              onBlur={field.onBlur}
                              onChange={() => field.onChange(address.id)}
                              ref={field.ref}
                              type="radio"
                              value={address.id}
                            />
                            <div className="flex gap-3">
                              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                              <div>
                                <p className="font-semibold">{address.recipientName}</p>
                                <p className="mt-2 text-sm leading-6 text-zinc-400">
                                  {address.street}, {address.number}
                                  {address.complement
                                    ? `, ${address.complement}`
                                    : ""}
                                  <br />
                                  {address.neighborhood}, {address.city}
                                  <br />
                                  CEP {address.zipCode}
                                </p>
                              </div>
                            </div>
                            {selected && (
                              <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
                                <Check className="size-4" />
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            className="mt-7 w-full sm:w-auto"
            disabled={disabled || addresses.length === 0 || isPending}
            size="lg"
            type="submit"
          >
            {isPending ? "Criando pedido..." : "Confirmar pedido"}
          </Button>
        </section>
      </form>
    </Form>
  );
}
