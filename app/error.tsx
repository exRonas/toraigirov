"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
      <p className="font-serif text-6xl font-bold text-primary">500</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-text">
        Қате орын алды / Произошла ошибка
      </h1>
      <p className="mt-2 max-w-md text-text-muted">
        Серверде күтпеген қате. Кейінірек қайталап көріңіз.
        <br />
        Непредвиденная ошибка сервера. Попробуйте позже.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-primary px-5 py-2.5 font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Қайталау / Повторить
        </button>
        <a
          href="/"
          className="rounded-md border border-border bg-surface px-5 py-2.5 font-medium text-text transition-colors hover:border-primary"
        >
          Басты бетке / На главную
        </a>
      </div>
    </div>
  );
}
