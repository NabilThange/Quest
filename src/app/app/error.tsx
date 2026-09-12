'use client';

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="card-elevated my-8 space-y-4 text-center" role="alert">
    <p className="text-4xl" aria-hidden="true">❧</p>
    <h1 className="font-serif text-3xl">A small pause in the journey.</h1>
    <p className="text-text-secondary">The lodge could not load. Check your connection and try again. Your saved progress remains in your account.</p>
    <button className="btn-primary" onClick={reset}>Try again</button>
  </section>;
}
