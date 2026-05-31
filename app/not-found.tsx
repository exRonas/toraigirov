import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
      <p className="font-serif text-7xl font-bold text-primary">404</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-text">
        Бет табылмады / Страница не найдена
      </h1>
      <p className="mt-2 max-w-md text-text-muted">
        Сұралған бет жоқ немесе жойылған.
        <br />
        Запрашиваемая страница не существует или была удалена.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-primary px-5 py-2.5 font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Басты бетке / На главную
      </Link>
    </div>
  );
}
