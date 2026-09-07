"use client";

import { updateProfile } from "@/actions/profile";
import {
  type UpdateProfileInput,
  updateProfileSchema,
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
import { UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SectionTitle } from "./section-title";

type ProfileFormProps = {
  name: string;
};

export function ProfileForm({ name }: ProfileFormProps) {
  const router = useRouter();
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name },
  });

  async function handleSubmit(values: UpdateProfileInput) {
    const result = await updateProfile(values);

    if (!result.data?.success) {
      toast.error(result.serverError ?? "Não foi possível atualizar seu perfil.");
      return;
    }

    toast.success("Perfil atualizado.");
    form.reset(values);
    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        className="border-b border-zinc-800 py-8"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <SectionTitle icon={UserRound} title="Dados pessoais">
          Nome usado na identificação da conta.
        </SectionTitle>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  autoComplete="name"
                  disabled={form.formState.isSubmitting}
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
          {form.formState.isSubmitting ? "Salvando..." : "Salvar dados"}
        </Button>
      </form>
    </Form>
  );
}
