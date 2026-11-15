import { useEffect, useRef, useState, type ReactNode } from "react";

import { HEART_RATE_ENABLED } from "../lib/config";

const SEEN_KEY = "twinauta.introSeen";

type Step = { title: string; body: ReactNode };

const STEPS: Step[] = [
  {
    title: "Qué es TwinNauta",
    body: (
      <>
        <p>
          Prototipo exploratorio para seguir la salud muscular de un astronauta
          en misiones largas y decidir qué comprobar a continuación.
        </p>
        <ul>
          <li>
            El caso es <strong>sintético</strong>: no hay datos de un astronauta
            real.
          </li>
          <li>
            No diagnostica ni prescribe. Las acciones son comprobaciones de
            datos con un responsable humano.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Elegir región y día",
    body: (
      <>
        <p>
          Seleccione el cuádriceps en el cuerpo o en «Regiones». Mueva el{" "}
          <strong>día de misión</strong> y pulse «Evaluar».
        </p>
        <ul>
          <li>
            Cada evaluación es una instantánea con los datos disponibles hasta
            ese día.
          </li>
          <li>
            Los colores del cuerpo solo marcan qué se puede seleccionar; no
            indican estado de salud.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Leer las tres pestañas",
    body: (
      <ul>
        <li>
          <strong>Evaluación de la zona:</strong> indicadores con su
          procedencia. Un dato ausente se muestra como ausente, nunca como cero.
        </li>
        <li>
          <strong>Evolución del escenario:</strong> qué se sabe de la evolución
          sin seguimiento y con qué supuestos. No es un pronóstico individual.
        </li>
        <li>
          <strong>Siguientes pasos:</strong> comprobaciones propuestas, su
          elegibilidad y el registro de seguimiento.
        </li>
        <li>
          Cuando existe una síntesis preparada, cada pestaña la muestra marcada
          como generada por modelo y pendiente de revisión.
        </li>
      </ul>
    ),
  },
  {
    title: "Evidencia y biblioteca",
    body: (
      <>
        <ul>
          <li>
            «¿Por qué?» y los grafos muestran de qué datos y fuentes sale cada
            conclusión.
          </li>
          <li>
            La <strong>Biblioteca científica</strong> reúne los artículos del
            corpus con su resumen, análisis y aplicabilidad. Las citas de la
            síntesis abren el artículo correspondiente.
          </li>
          <li>
            La evidencia sigue pendiente de revisión por el equipo de Medicina;
            una relación en el grafo no prueba eficacia.
          </li>
        </ul>
        {HEART_RATE_ENABLED ? (
          <p>
            La <strong>frecuencia cardíaca</strong> es una grabación terrestre
            de otra persona en cinta: solo didáctica, no pertenece al
            astronauta.
          </p>
        ) : null}
      </>
    ),
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
 * Short walkthrough for first-time viewers (jury, team). Opens once per
 * browser and again from the header button.
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
      className="m-auto w-[min(36rem,calc(100vw-2rem))] rounded-xl border border-slate-700 bg-slate-900 p-0 text-slate-200 backdrop:bg-slate-950/70"
    >
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-400">
              Cómo leer esta demo · paso {step + 1} de {STEPS.length}
            </p>
            <h2
              id="intro-title"
              className="mt-1 text-lg font-semibold text-slate-50"
            >
              {current.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar guía"
            className="rounded-md px-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            ×
          </button>
        </div>

        <div className="space-y-2 text-sm leading-relaxed [&_li]:ml-4 [&_li]:list-disc [&_ul]:space-y-1">
          {current.body}
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex gap-1.5" aria-hidden="true">
            {STEPS.map((item, index) => (
              <span
                key={item.title}
                className={`h-1.5 w-6 rounded-full ${
                  index === step ? "bg-sky-400" : "bg-slate-700"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:border-slate-500"
              >
                Anterior
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => (last ? close() : setStep(step + 1))}
              className="rounded-md bg-sky-500 px-3 py-1 text-sm font-medium text-slate-950 hover:bg-sky-400"
            >
              {last ? "Empezar" : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

/** True when the guide should open automatically on this browser. */
export function shouldShowIntro(): boolean {
  return !readSeen();
}
