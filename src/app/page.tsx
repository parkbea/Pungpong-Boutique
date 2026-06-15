import Designer from "@/components/Designer";

export default function Home() {
  return (
    <main className="flex-1">
      <header className="mx-auto w-full max-w-6xl px-4 pt-10 pb-8 text-center sm:px-6 sm:pt-14">
        <p className="mb-2 text-[11px] font-semibold tracking-[0.35em] text-ink/40 uppercase">
          AI Fashion Design Studio
        </p>
        <h1 className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">
          뿡뽕의상실
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed break-keep text-ink/55">
          옷 종류부터 핏 · 소매 · 넥라인 · 색상 · 소재까지,
          <br className="hidden sm:block" />
          취향대로 고르면 AI가 나만의 의상을 화보로 완성해 드려요.
        </p>
      </header>
      <Designer />
      <footer className="border-t border-ink/8 py-6 text-center text-xs text-ink/35">
        © {new Date().getFullYear()} 뿡뽕의상실 · Powered by Pollinations AI
      </footer>
    </main>
  );
}
