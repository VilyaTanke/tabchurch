"use client";

import { useActionState, useEffect, useRef } from "react";
import { animate } from "animejs";
import type { FormState } from "@/app/actions";

type Props = {
  action: (s: FormState, f: FormData) => Promise<FormState>;
  submitLabel: string;
  children: React.ReactNode;
  resetOnOk?: boolean;
};

export default function ActionForm({ action, submitLabel, children, resetOnOk }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = ref.current;
    if (!form || !state || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const alert = form.querySelector(".alert");
    if (state.error) {
      animate(form, { translateX: [0, -10, 10, -7, 7, -3, 0], duration: 450, ease: "outQuad" });
    }
    if (alert) {
      animate(alert, { opacity: [0, 1], translateY: [-8, 0], scale: [0.96, 1], duration: 400, ease: "outBack" });
    }
  }, [state]);

  return (
    <form
      ref={ref}
      action={formAction}
      className="stack"
      key={resetOnOk && state?.ok ? state.ok : "f"}
    >
      {children}
      {state?.error && <div className="alert error" role="alert">{state.error}</div>}
      {state?.ok && <div className="alert ok" role="status">{state.ok}</div>}
      <button className="btn" disabled={pending}>{pending ? "Un momento…" : submitLabel}</button>
    </form>
  );
}

export function Field({
  label, name, type = "text", required = true, autoComplete,
}: { label: string; name: string; type?: string; required?: boolean; autoComplete?: string }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} required={required} autoComplete={autoComplete} className="input" />
    </div>
  );
}
