"use client";

import { updateEmail } from "@/actions/profile";
import {
  type UpdateEmailInput,
  updateEmailSchema,
} from "@/actions/profile/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SectionTitle } from "./section-title";

type EmailFormProps = {
  email: string;
};

export function EmailForm({ email }: EmailFormProps) {
  const router = useRouter();
  const form = useForm<UpdateEmailInput>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: { email },
  });

  async function handleSubmit(values: UpdateEmailInput) {
    const result = await updateEmail(values);

    if (!result.data?.success) {
      toast.error(result.serverError ?? "Não foi possível atualizar seu e-mail.");
      return;
    }

    toast.success("E-mail atualizado.");
    form.reset(values);
    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        className="border-b border-zinc-800 py-8"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <SectionTitle icon={Mail} title="E-mail">
          Endereço usado para entrar e receber comunicações.
        </SectionTitle>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Novo e-mail</FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  disabled={form.formState.isSubmitting}
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="mt-6"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting ? "Atualizando..." : "Atualizar e-mail"}
        </Button>
      </form>
    </Form>
  );
}
