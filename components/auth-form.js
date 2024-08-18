"use client";

import { useFormState } from "react-dom";
import Link from "next/link";

import { login, signUp } from "@/actions/auth-actions";

export default function AuthForm({ mode }) {
  const authAction = mode === "signup" ? signUp : login;
  const [state, formAction] = useFormState(authAction, {});

  return (
    <form action={formAction} id="auth-form">
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon" />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      <ul id="form-errors">
        {state.errors && state.errors &&
          Object.keys(state.errors).map((error) => (
            <li>{state.errors[error]}</li>
          ))}
      </ul>
      <p>
        <button type="submit">
          {mode === "login" ? "Login" : "Create Account"}
        </button>
      </p>
      {mode === "login" && (
        <p>
          <Link href="/?mode=signup">Create An Account</Link>
        </p>
      )}
      {mode === "signup" && (
        <p>
          <Link href="/?mode=login">Login with existing account.</Link>
        </p>
      )}
    </form>
  );
}
