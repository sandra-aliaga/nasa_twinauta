import { useEffect, useRef, useState, type ReactNode } from "react";
import { tr, msg } from "../i18n";

const SEEN_KEY = "twinauta.introSeen";

type Step = { title: string; body: string; art: ReactNode };

/** Body silhouette with a pulsing beacon on the thigh. */
const ART_BEACON = (
  <svg viewBox="0 0 160 110" className="h-28 w-40" aria-hidden="true">
    <circle cx="80" cy="18" r="9" className="fill-slate-600" />
    <rect
      x="66"
      y="30"
      width="28"
      height="36"
      rx="10"
      className="fill-slate-600"
    />
    <rect
      x="67"
      y="64"
      width="11"
      height="40"
      rx="5.5"
      className="fill-slate-600"
    />
    <rect
      x="82"
      y="64"
      width="11"
      height="40"
      rx="5.5"
      className="fill-step-now"
    />
    <circle
      cx="87.5"
      cy="80"
      r="14"
      className="fill-none stroke-step-do"
      strokeWidth="2"
      opacity="0.45"
    />
    <circle
      cx="87.5"
      cy="80"
      r="8"
      className="fill-none stroke-step-do"
      strokeWidth="2"
    />
    <circle cx="87.5" cy="80" r="3.5" className="fill-step-do" />
  </svg>
);

/** The three steps of a zone as a route. */
const ART_STEPS = (
  <svg viewBox="0 0 200 110" className="h-28 w-48" aria-hidden="true">
    <path
      d="M36 55 H164"
      className="stroke-slate-700"
      strokeWidth="3"
      strokeDasharray="2 7"
      strokeLinecap="round"
    />
    <circle cx="36" cy="55" r="17" className="fill-step-now" />
    <circle cx="100" cy="55" r="17" className="fill-step-next" />
    <circle cx="164" cy="55" r="17" className="fill-step-do" />
    <g
      className="fill-slate-950 font-display"
      fontSize="15"
      textAnchor="middle"
    >
      <text x="36" y="60.5">
        1
      </text>
      <text x="100" y="60.5">
        2
      </text>
      <text x="164" y="60.5">
        3
      </text>
    </g>
  </svg>
);

/** A small relation map: where a conclusion comes from. */
const ART_MAP = (
  <svg viewBox="0 0 200 110" className="h-28 w-48" aria-hidden="true">
    <path
      d="M52 30 L104 55 L52 82 M104 55 H156"
      className="fill-none stroke-slate-600"
      strokeWidth="2"
    />
    <rect
      x="22"
      y="18"
      width="48"
      height="24"
      rx="8"
      className="fill-slate-700"
    />
    <rect
      x="22"
      y="70"
      width="48"
      height="24"
      rx="8"
      className="fill-slate-700"
    />
    <rect
      x="80"
      y="43"
      width="48"
      height="24"
      rx="8"
      className="fill-step-now"
    />
    <rect
      x="140"
      y="43"
      width="42"
      height="24"
      rx="8"
      className="fill-step-next"
    />
  </svg>
);

const STEPS: Step[] = [
  {
    title: msg("Mira el gemelo"),
    body: msg(
      "Es un astronauta virtual de práctica. Las balizas marcan las zonas donde hay algo por revisar.",
    ),
    art: ART_BEACON,
  },
  {
    title: msg("Toca una zona"),
    body: msg(
      "Verás tres pasos, siempre en este orden: qué pasa, qué puede pasar y qué hacer.",
    ),
    art: ART_STEPS,
  },
  {
    title: msg("Pregunta de dónde sale"),
    body: msg(
      "Cada paso trae su mapa de datos y estudios. Nada aquí es un diagnóstico ni reemplaza al equipo médico.",
    ),
    art: ART_MAP,
  },
];

function readSeen(): boolean {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    // Storage can be blocked (private mode, policy): show the guide.
    return false;
  }
}

function writeSeen(): void {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Not remembering is acceptable; the guide can be closed again.
  }
}

/**
 * Three-screen welcome for first-time viewers. Opens once per browser and
 * again from the header button.
 */
export function IntroGuide({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setStep(0);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function close() {
    writeSeen();
    onClose();
  }

  const current = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="intro-title"
      onCancel={(event) => {
        // Esc closes through the same path as the buttons.
        event.preventDefault();
        close();
      }}
      className="twin-dialog m-auto w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-slate-700 bg-slate-900 p-0 text-slate-200 shadow-2xl shadow-black/50"
    >
      <div className="p-6 text-center">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={close}
            className="text-xs text-slate-400 hover:text-slate-100"
          >
            {tr("Saltar")}
          </button>
        </div>

        <div key={step} className="animate-rise-in">
          <div className="flex h-32 items-center justify-center">
            {current.art}
          </div>
          <h2
            id="intro-title"
            className="mt-3 font-display text-xl text-slate-50"
          >
            {tr(current.title)}
          </h2>
          <p className="mx-auto mt-2 max-w-[19rem] text-sm leading-relaxed text-slate-300">
            {tr(current.body)}
          </p>
        </div>

        <div
          className="mt-5 flex justify-center gap-1.5"
          role="img"
          aria-label={tr("Paso {{current}} de {{total}}", {
            current: step + 1,
            total: STEPS.length,
          })}
        >
          {STEPS.map((item, index) => (
            <span
              key={item.title}
              className={`h-1.5 rounded-full transition-all ${
                index === step ? "w-6 bg-sky-400" : "w-1.5 bg-slate-700"
              }`}
            />
          ))}
        </div>

        <div className="mt-5 flex gap-2">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
            >
              {tr("Atrás")}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => (last ? close() : setStep(step + 1))}
            className="flex-1 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
          >
            {last ? tr("Empezar") : tr("Siguiente")}
          </button>
        </div>
      </div>
    </dialog>
  );
}

/** True when the guide should open automatically on this browser. */
export function shouldShowIntro(): boolean {
  return !readSeen();
}
