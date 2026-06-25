import Link from "next/link";

const features = [
  {
    title: "Carousel, done",
    desc: "A hook-first, swipe-ready 6–8 slide carousel built straight from your notes.",
    icon: "🖼️",
  },
  {
    title: "Reel script, timed",
    desc: "A 30-second script with hook, beats and CTA — timestamped so you just press record.",
    icon: "🎬",
  },
  {
    title: "Caption + hashtags",
    desc: "An engaging caption with a question that drives comments, plus 8–12 niche hashtags.",
    icon: "✍️",
  },
  {
    title: "Hook score",
    desc: "Every pack is rated for scroll-stopping power, with fixes to make it sharper.",
    icon: "⚡",
  },
];

const steps = [
  { n: "1", t: "Set your niche & voice", d: "Pick your niche and paste one old post so Noted learns how you sound." },
  { n: "2", t: "Drop your study material", d: "A topic, your notes, or a chapter summary. That's the input." },
  { n: "3", t: "Get a full content pack", d: "Carousel, reel script, caption, hashtags — in seconds." },
  { n: "4", t: "Edit, copy, post", d: "Tweak anything, copy it out, and ship it before the moment passes." },
];

const tiers = [
  {
    name: "Free",
    price: "₹0",
    tagline: "Build the habit",
    points: ["5 content packs / month", "1 saved brand voice", "Carousel + reel + caption", "Hook score"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹199",
    suffix: "/mo",
    tagline: "For creators who post to grow",
    points: [
      "Unlimited content packs",
      "3 brand voices",
      "No watermark on exports",
      "Post scheduler + hooks library",
    ],
    cta: "Go Pro",
    highlight: true,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">N</span>
            Noted
          </div>
          <Link
            href="/app"
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Open app
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-white" />
        <div className="mx-auto max-w-6xl px-5 py-20 text-center sm:py-28">
          <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
            For student creators · studygram, exam-prep, explainers
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-6xl">
            Study once.{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Post everywhere.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
            You already do the hard part — studying. Noted turns your notes into a ready-to-post
            carousel, reel script, caption and hashtags, in your own voice. Stop posting twice.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/app"
              className="w-full rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 sm:w-auto"
            >
              Generate a content pack →
            </Link>
            <a
              href="#how"
              className="w-full rounded-full border border-zinc-200 px-8 py-3.5 text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 sm:w-auto"
            >
              See how it works
            </a>
          </div>
          <p className="mt-4 text-sm text-zinc-400">No login needed for the demo · works instantly</p>
        </div>
      </section>

      {/* Problem */}
      <section className="border-y border-zinc-100 bg-zinc-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl">The problem nobody fixes</h2>
            <p className="mt-4 text-zinc-600">
              Studygram creators do the work <em>twice</em>: first they study, then they spend another
              hour turning it into a post. During exams that second job disappears — so they go quiet,
              lose momentum, and growth stalls.
            </p>
            <p className="mt-4 text-zinc-600">
              Generic AI writers don&apos;t get academic content or a creator&apos;s voice, and a Canva +
              ChatGPT + scheduler stack costs more than a student will pay.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ["⏳", "1+ hour per post", "Reformatting notes into slides and scripts every single time."],
              ["📉", "Inconsistent posting", "Exam season kills the content streak — and the algorithm punishes it."],
              ["🧩", "Wrong tools", "Generic AI ignores academic depth and the creator's own tone."],
            ].map(([icon, t, d]) => (
              <div key={t} className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="font-semibold text-zinc-900">{t}</p>
                  <p className="text-sm text-zinc-600">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
          One input. A full content pack.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-zinc-600">
          Paste your notes once and get everything you need to post — not just a caption.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-zinc-200 p-6 transition-shadow hover:shadow-md">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 font-semibold text-zinc-900">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-zinc-100 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">How it works</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">{s.t}</h3>
                <p className="mt-2 text-sm text-zinc-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">Freemium, built for students</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-zinc-600">
          Free hooks the habit. The 5-pack limit and exam-season spikes are what tip creators into Pro.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-3xl border p-8 ${
                t.highlight ? "border-indigo-600 bg-indigo-50/40 shadow-lg" : "border-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-900">{t.name}</h3>
                {t.highlight && (
                  <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-500">{t.tagline}</p>
              <p className="mt-4 text-4xl font-extrabold text-zinc-900">
                {t.price}
                {t.suffix && <span className="text-base font-medium text-zinc-500">{t.suffix}</span>}
              </p>
              <ul className="mt-6 space-y-3">
                {t.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-zinc-700">
                    <span className="text-indigo-600">✓</span> {p}
                  </li>
                ))}
              </ul>
              <Link
                href="/app"
                className={`mt-8 block rounded-full px-6 py-3 text-center text-sm font-semibold transition-colors ${
                  t.highlight
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border border-zinc-300 text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">Your next post is one paste away.</h2>
          <p className="mx-auto mt-3 max-w-lg text-indigo-100">
            Try the live demo — turn any topic or notes into a content pack right now.
          </p>
          <Link
            href="/app"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
          >
            Open Noted →
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-100 py-8 text-center text-sm text-zinc-400">
        Noted · built for the LIT AI SaaS Builder Challenge · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
