import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import type { Address } from "@repo/core/modules/addresses/domain/address";
import { X } from "lucide-react";
import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form } from "@repo/ui/components/form";

type AddressFormProps = {
  address?: Address;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (values: AddressFormValues) => void;
};

const addressFormSchema = z.object({
  recipientName: z.string().trim().min(3, "Informe o nome completo."),
  street: z.string().trim().min(3, "Informe a rua."),
  number: z.string().trim().min(1, "Informe o número."),
  complement: z.string().trim().optional(),
  city: z.string().trim().min(2, "Informe a cidade."),
  neighborhood: z.string().trim().min(2, "Informe o bairro."),
  zipCode: z.string().trim().regex(/^\d{8}$/, "Informe um CEP com 8 números."),
  country: z.string().trim().min(2, "Informe o país."),
  phone: z.string().trim().min(10, "Informe um telefone válido."),
  email: z.email("Informe um e-mail válido."),
  cpfOrCnpj: z
    .string()
    .trim()
    .regex(/^(\d{11}|\d{14})$/, "Informe um CPF ou CNPJ somente com números."),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;

type AddressField = {
  name:
    | "recipientName"
    | "email"
    | "phone"
    | "cpfOrCnpj"
    | "zipCode"
    | "street"
    | "number"
    | "complement"
    | "neighborhood"
    | "city"
    | "country";
  label: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  maxLength?: number;
  numericOnly?: boolean;
};

const fields: AddressField[] = [
  {
    name: "recipientName",
    label: "Nome do destinatário",
    autoComplete: "name",
  },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
  { name: "phone", label: "Telefone", autoComplete: "tel" },
  {
    name: "cpfOrCnpj",
    label: "CPF ou CNPJ",
    maxLength: 14,
    numericOnly: true,
  },
  {
    name: "zipCode",
    label: "CEP",
    autoComplete: "postal-code",
    maxLength: 8,
    numericOnly: true,
  },
  { name: "street", label: "Rua", autoComplete: "address-line1" },
  { name: "number", label: "Número" },
  {
    name: "complement",
    label: "Complemento (opcional)",
    autoComplete: "address-line2",
  },
  { name: "neighborhood", label: "Bairro" },
  { name: "city", label: "Cidade", autoComplete: "address-level2" },
  { name: "country", label: "País", autoComplete: "country-name" },
];

export function AddressForm({
  address,
  isPending,
  onCancel,
  onSubmit,
}: AddressFormProps) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      recipientName: address?.recipientName ?? "",
      street: address?.street ?? "",
      number: address?.number ?? "",
      complement: address?.complement ?? "",
      city: address?.city ?? "",
      neighborhood: address?.neighborhood ?? "",
      zipCode: address?.zipCode ?? "",
      country: address?.country ?? "Brasil",
      phone: address?.phone ?? "",
      email: address?.email ?? "",
      cpfOrCnpj: address?.cpfOrCnpj ?? "",
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              {address ? "Editar endereço" : "Novo endereço"}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Dados usados na entrega e na nota do pedido.
            </p>
          </div>
          <Button
            aria-label="Fechar formulário"
            onClick={onCancel}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <X />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((fieldConfig) => {
            const wide = ["recipientName", "street", "complement"].includes(
              fieldConfig.name,
            );

            return (
              <FormField
                control={form.control}
                key={fieldConfig.name}
                name={fieldConfig.name}
                render={({ field }) => (
                  <FormItem className={wide ? "sm:col-span-2" : undefined}>
                    <FormLabel>{fieldConfig.label}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete={fieldConfig.autoComplete}
                        inputMode={fieldConfig.numericOnly ? "numeric" : undefined}
                        disabled={isPending}
                        maxLength={fieldConfig.maxLength}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          const value = fieldConfig.numericOnly
                            ? event.target.value.replace(/\D/g, "")
                            : event.target.value;

                          field.onChange(value);
                        }}
                        type={fieldConfig.type ?? "text"}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            disabled={isPending}
            onClick={onCancel}
            type="button"
            variant="ghost"
          >
            Cancelar
          </Button>
          <Button disabled={isPending} type="submit">
            {isPending ? "Salvando..." : "Salvar endereço"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
