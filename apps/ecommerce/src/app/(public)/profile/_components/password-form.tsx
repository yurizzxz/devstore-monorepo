"use client";

import { changePassword } from "@/actions/profile";
import {
  type ChangePasswordInput,
  changePasswordSchema,
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
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SectionTitle } from "./section-title";

export function PasswordForm() {
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      passwordConfirmation: "",
    },
  });

  async function handleSubmit(values: ChangePasswordInput) {
    const result = await changePassword(values);

    if (!result.data?.success) {
      toast.error(result.serverError ?? "Não foi possível alterar sua senha.");
      return;
    }

    toast.success("Senha alterada.");
    form.reset();
  }

  return (
    <Form {...form}>
      <form className="py-8" onSubmit={form.handleSubmit(handleSubmit)}>
        <SectionTitle icon={KeyRound} title="Senha">
          Confirme sua senha atual antes de definir uma nova.
        </SectionTitle>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Senha atual</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="current-password"
                    disabled={form.formState.isSubmitting}
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova senha</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="new-password"
                    disabled={form.formState.isSubmitting}
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar nova senha</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="new-password"
                    disabled={form.formState.isSubmitting}
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          className="mt-6"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting ? "Alterando..." : "Alterar senha"}
        </Button>
      </form>
    </Form>
  );
}
