import Designer from "@/components/Designer";

export default function Home() {
  return (
    <main className="flex-1">
      <header className="mx-auto w-full max-w-6xl px-4 pt-8 pb-6 sm:px-6 sm:pt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold tracking-[0.28em] text-ink/40 uppercase">
              AI Fashion Design Studio
            </p>
            <h1 className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">
              뿡뽕의상실
            </h1>
          </div>
          <p className="max-w-md text-sm leading-relaxed break-keep text-ink/55 sm:text-right">
            옷 종류부터 디테일, 소품, 배경까지 순서대로 고르면 미리보기와 AI
            이미지가 함께 완성됩니다.
          </p>
        </div>
      </header>
      <Designer />
      <footer className="border-t border-ink/8 py-6 text-center text-xs text-ink/35">
        © {new Date().getFullYear()} 뿡뽕의상실 · Powered by Pollinations AI
      </footer>
    </main>
  );
}
