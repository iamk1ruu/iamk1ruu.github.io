import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase";

function getLetterSlug() {
  if (typeof window === "undefined") return "my-love";
  const parts = window.location.pathname.split("/").filter(Boolean);
  const letterIndex = parts.indexOf("letter");
  if (letterIndex === -1) return "my-love";
  return parts[letterIndex + 1] || "my-love";
}

function getConfigFromUrl() {
  if (typeof window === "undefined") {
    return {
      title: "For Your Eyes Only",
      subtitle: "Warning: once played, every line is open.",
      expectedPin: "2508",
      to: "Dear My Love,",
      body: "This letter is pin-locked for you. Every word here is intentional, private, and written from the heart.",
      from: "Your Name",
    };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    title: params.get("title") || "For Your Eyes Only",
    subtitle: params.get("subtitle") || "Warning: once played, every line is open.",
    expectedPin: params.get("pin") || "2508",
    to: params.get("to") || "Dear My Love,",
    body:
      params.get("content") ||
      "This letter is pin-locked for you. Every word here is intentional, private, and written from the heart.",
    from: params.get("from") || "Your Name",
  };
}

const defaultConfig = {
  title: "For Your Eyes Only",
  subtitle: "Warning: once played, every line is open.",
  expectedPin: "2508",
  to: "Dear My Love,",
  body: "This letter is pin-locked for you. Every word here is intentional, private, and written from the heart.",
  from: "Your Name",
};

export default function LetterPage() {
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [status, setStatus] = useState("locked"); // locked | envelope | opened
  const [error, setError] = useState("");
  const [sparkle, setSparkle] = useState(false);
  const [isLoadingLetter, setIsLoadingLetter] = useState(true);
  const [config, setConfig] = useState(defaultConfig);

  const slug = useMemo(() => getLetterSlug(), []);
  const urlConfig = useMemo(() => getConfigFromUrl(), []);

  const today = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadLetter() {
      try {
        setIsLoadingLetter(true);
        const snap = await getDoc(doc(db, "letterC", slug));
        if (cancelled) return;

        if (snap.exists()) {
          const data = snap.data() || {};
          setConfig({
            title: data.title || defaultConfig.title,
            subtitle: data.subtitle || defaultConfig.subtitle,
            expectedPin: String(data.pin || defaultConfig.expectedPin),
            to: data.to || defaultConfig.to,
            body: data.content || defaultConfig.body,
            from: data.from || defaultConfig.from,
          });
          return;
        }

        // Fallback allows preview links with query params before publishing a document.
        setConfig(urlConfig);
      } catch {
        setConfig(urlConfig);
      } finally {
        if (!cancelled) setIsLoadingLetter(false);
      }
    }

    loadLetter();
    return () => {
      cancelled = true;
    };
  }, [slug, urlConfig]);

  const submitPin = () => {
    const entered = pinDigits.join("");
    if (entered !== config.expectedPin) {
      setError("Wrong pin. Try again.");
      return;
    }
    setError("");
    setStatus("envelope");
  };

  const onPinChange = (index, value) => {
    const next = value.replace(/\D/g, "").slice(-1);
    setPinDigits((prev) => {
      const copy = [...prev];
      copy[index] = next;
      return copy;
    });
  };

  const openLetter = () => {
    setSparkle(true);
    setStatus("opened");
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-cover bg-center px-4 py-10 text-slate-100"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center">
        {isLoadingLetter ? (
          <section className="w-full max-w-md rounded-3xl border border-white/30 bg-white/15 p-8 text-center shadow-2xl backdrop-blur-md">
            <p className="text-sm text-white/90">Loading letter...</p>
          </section>
        ) : null}
        {!isLoadingLetter && status === "locked" ? (
          <section className="w-full max-w-md rounded-3xl border border-white/30 bg-white/15 p-8 text-center shadow-2xl backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/75">{slug}</p>
            <h1 className="mt-2 text-4xl font-semibold">{config.title}</h1>
            <p className="mt-1 text-sm text-white/80">{config.subtitle}</p>

            <div className="mx-auto mt-8 h-24 w-20 rounded-t-[40px] border-8 border-white/75 border-b-0" />
            <div className="mx-auto -mt-3 max-w-[260px] rounded-[28px] bg-pink-300/90 px-5 py-6 text-slate-900 shadow-xl">
              <div className="flex justify-center gap-2">
                {pinDigits.map((digit, index) => (
                  <input
                    key={String(index)}
                    value={digit}
                    onChange={(event) => onPinChange(index, event.target.value)}
                    className="h-12 w-10 rounded-md border border-pink-100 bg-white text-center text-xl font-semibold outline-none"
                    inputMode="numeric"
                    maxLength={1}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={submitPin}
                className="mt-4 rounded-full bg-slate-900 px-5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white"
              >
                Enter
              </button>
            </div>
            {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
          </section>
        ) : null}

        {!isLoadingLetter && status === "envelope" ? (
          <section className="w-full max-w-sm text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/80">Unlocked</p>
            <button
              type="button"
              onClick={openLetter}
              className="mx-auto block w-full rounded-2xl border border-white/40 bg-white/20 p-6 shadow-2xl backdrop-blur-md transition hover:scale-[1.02]"
            >
              <div className="mx-auto h-28 w-full max-w-[280px] rounded-xl bg-rose-50 p-3 shadow-inner">
                <div className="relative h-full rounded-lg bg-rose-100">
                  <div className="absolute left-0 right-0 top-0 h-0 border-l-[120px] border-r-[120px] border-t-[70px] border-l-transparent border-r-transparent border-t-rose-200" />
                  <div className="absolute bottom-5 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-rose-700 shadow" />
                </div>
              </div>
            </button>
          </section>
        ) : null}

        {!isLoadingLetter && status === "opened" ? (
          <section className="w-full max-w-3xl rounded-3xl border border-amber-100/70 bg-amber-50/95 p-7 text-slate-700 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-violet-500">{sparkle ? "opened" : ""}</p>
                <p className="mt-2 text-3xl">Dearly Yours</p>
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{today}</p>
            </div>

            <p className="mb-4 text-2xl font-semibold italic text-slate-700">{config.to}</p>
            <p className="min-h-[220px] whitespace-pre-wrap text-lg leading-8">{config.body}</p>
            <div className="mt-10 text-right">
              <p className="text-lg text-slate-500">With love,</p>
              <p className="text-3xl italic text-slate-800">{config.from}</p>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
