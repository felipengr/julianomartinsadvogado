"use client";

import { useActionState } from "react";
import { changePassword, type FormState } from "@/app/admin/actions";
import { Button, inputClass, Label, Notice } from "./form-ui";

export function PasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePassword, {});

  return (
    <form action={action} className="space-y-5">
      <div>
        <Label htmlFor="password">Nova senha</Label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>
      <div>
        <Label htmlFor="confirm">Repita a nova senha</Label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      {state.success && <Notice tone="success">{state.success}</Notice>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Salvando…" : "Salvar nova senha"}
      </Button>
    </form>
  );
}
