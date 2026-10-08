"use client";

import { useActionState } from "react";
import { signIn, type FormState } from "@/app/admin/actions";
import { Button, inputClass, Label, Notice } from "./form-ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {});

  return (
    <form action={action} className="space-y-5">
      <div>
        <Label htmlFor="email">E-mail</Label>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
