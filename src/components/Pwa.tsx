"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "ppung-install-dismissed";

export default function Pwa() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  // 서비스 워커 등록 (프로덕션에서만 — dev 캐싱 혼선 방지)
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }
    const register = () =>
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    // effect는 load 이후에 실행되므로, 이미 완료됐으면 즉시 등록한다.
    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  // 설치 프롬프트 가로채기 (Android/Chrome)
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice.catch(() => undefined);
    setDeferred(null);
    setVisible(false);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-ink/10 bg-white/95 p-3 pl-4 shadow-[0_12px_40px_-12px_rgba(35,33,31,0.35)] backdrop-blur sm:inset-x-0"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-paper">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">앱으로 설치하기</p>
            <p className="text-xs text-ink/55">홈 화면에 추가하면 전체화면으로 사용할 수 있어요.</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 rounded-full px-2 py-1.5 text-xs text-ink/45 hover:text-ink"
          >
            나중에
          </button>
          <button
            type="button"
            onClick={install}
            className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-transform active:scale-95"
          >
            설치
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
