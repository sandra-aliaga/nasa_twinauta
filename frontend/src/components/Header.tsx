import type { Case } from "../api";

type HeaderProps = {
  cases: Case[];
  caseId: string | null;
  onCaseChange: (caseId: string) => void;
  day: number;
  onDayChange: (day: number) => void;
  evaluatedDay: number | null;
  canEvaluate: boolean;
  onEvaluate: () => void;
  isDemo: boolean;
  referenceMode?: boolean;
  cardiacAvailable: boolean;
  cardiacOpen: boolean;
  onToggleCardiac: () => void;
  libraryOpen: boolean;
  onToggleLibrary: () => void;
  onOpenGuide: () => void;
};

/** Top bar: case selector, mission day slider with explicit evaluate button. */
export function Header({
  cases,
  caseId,
  onCaseChange,
  day,
  onDayChange,
  evaluatedDay,
  canEvaluate,
  onEvaluate,
  isDemo,
  referenceMode = false,
  cardiacAvailable,
  cardiacOpen,
  onToggleCardiac,
  libraryOpen,
  onToggleLibrary,
  onOpenGuide,
}: HeaderProps) {
  const selectedCase = cases.find((item) => item.id === caseId) ?? null;
  const maxDay = selectedCase?.duration_days ?? 0;
  const dayChanged = evaluatedDay !== null && evaluatedDay !== day;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 px-4 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <h1 className="flex items-center gap-2 font-display text-base font-medium text-slate-50">
          <svg aria-hidden="true" viewBox="0 0 32 32" className="h-7 w-7">
            <rect width="32" height="32" rx="8" fill="#141842" />
            <ellipse
              cx="16"
              cy="16"
              rx="12"
              ry="5.5"
              fill="none"
              stroke="#5aa0ff"
              strokeWidth="1.6"
              transform="rotate(-28 16 16)"
            />
            <circle cx="16" cy="16" r="4.2" fill="#e2e8f0" />
            <circle cx="26" cy="10.6" r="2" fill="#5aa0ff" />
          </svg>
          TwinNauta
        </h1>

        {referenceMode ? (
          <p className="flex-1 text-xs text-slate-300">
            NASA · estudios musculares · muestras de vuelo · pruebas de
            ejercicio
          </p>
        ) : (
          <>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              Caso
              <select
                value={caseId ?? ""}
                onChange={(event) => onCaseChange(event.target.value)}
                className="max-w-[13rem] truncate rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-slate-100 2xl:max-w-none"
              >
                {cases.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                    {item.is_virtual ? " (virtual)" : ""}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-1 flex-wrap items-center gap-3 text-sm text-slate-300">
              <label htmlFor="mission-day" className="whitespace-nowrap">
                Día de misión
              </label>
              <input
                id="mission-day"
                type="range"
                min={0}
                max={maxDay}
                value={day}
                disabled={!selectedCase}
                onChange={(event) => onDayChange(Number(event.target.value))}
                className="w-32 accent-sky-400 sm:w-36 xl:w-40 2xl:w-56"
              />
              <span className="w-16 tabular-nums text-slate-100">
                {day} / {maxDay}
              </span>
              <button
                type="button"
                onClick={onEvaluate}
                disabled={!canEvaluate}
                title={
                  canEvaluate
                    ? "Crear una evaluación para este día"
                    : "Seleccione una región del cuerpo"
                }
                className="rounded-full bg-sky-500 px-4 py-1 font-semibold text-slate-950 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                Evaluar día {day}
              </button>
              {dayChanged ? (
                <span className="text-xs text-amber-300">
                  La evaluación mostrada es del día {evaluatedDay}.
                </span>
              ) : null}
            </div>
          </>
        )}
        {cardiacAvailable ? (
          <button
            type="button"
            aria-pressed={cardiacOpen}
            onClick={onToggleCardiac}
            className={`rounded-md border px-3 py-1 text-sm ${
              cardiacOpen
                ? "border-violet-400 bg-violet-500/20 text-violet-100"
                : "border-slate-700 text-slate-200 hover:border-slate-500"
            }`}
          >
            Pulso de ejemplo
          </button>
        ) : null}

        <button
          type="button"
          aria-pressed={libraryOpen}
          onClick={onToggleLibrary}
          className={`rounded-md border px-3 py-1 text-sm ${
            libraryOpen
              ? "border-sky-400 bg-sky-500/20 text-sky-100"
              : "border-slate-700 text-slate-200 hover:border-slate-500"
          }`}
        >
          Biblioteca científica
        </button>

        <button
          type="button"
          onClick={onOpenGuide}
          aria-label="Cómo leer esta demo"
          title="Cómo leer esta demo"
          className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:border-slate-500"
        >
          Guía
        </button>

        {isDemo ? (
          <span
            className="rounded-md border border-amber-400/60 bg-amber-400/10 px-2 py-1 text-xs font-medium text-amber-200"
            title="Los datos provienen de contracts/examples: son sintéticos y no son resultados del backend."
          >
            Demo
          </span>
        ) : null}
      </div>
    </header>
  );
}
