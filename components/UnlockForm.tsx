"use client";

import { FormEvent, useState } from "react";
import { Localized } from "./Localized";

export function UnlockForm({ nextPath }: { nextPath: string }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setMessage("That key didn’t turn. Please try again. / 密码不正确，请重试。");
        return;
      }
      window.location.assign(nextPath);
    } catch {
      setMessage("The lock is temporarily unavailable. / 暂时无法验证，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="unlock-form" onSubmit={submit}>
      <label htmlFor="portfolio-password"><Localized en="Shared password" zh="访问密码" /></label>
      <div className="unlock-row">
        <input
          id="portfolio-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required
          autoFocus
        />
        <button type="submit" disabled={loading}>
          <Localized en={loading ? "Opening…" : "Open case ↗"} zh={loading ? "正在打开…" : "进入案例 ↗"} />
        </button>
      </div>
      <p className="form-message" role="status">{message}</p>
    </form>
  );
}
