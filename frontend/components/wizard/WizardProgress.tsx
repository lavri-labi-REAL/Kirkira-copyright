import { clsx } from "clsx";
import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "Describe" },
  { n: 2, label: "Requirements" },
  { n: 3, label: "Profile & Owners" },
  { n: 4, label: "Details" },
  { n: 5, label: "Review" },
  { n: 6, label: "Filing" },
];

export function WizardProgress({ current }: { current: number }) {
  return (
    <div>
      {/* Desktop full stepper */}
      <div className="hidden sm:flex items-start">
        {STEPS.map((step, idx) => {
          const done   = current > step.n;
          const active = current === step.n;
          return (
            <div key={step.n} className="flex items-start flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    "step-bubble w-9 h-9 text-sm transition-all duration-300",
                    done   && "bg-green-500 text-white shadow-sm shadow-green-200",
                    active && "bg-primary text-white shadow-md shadow-primary/30 scale-110",
                    !done && !active && "bg-gray-100 text-gray-400"
                  )}
                >
                  {done ? <Check className="w-4 h-4" strokeWidth={3} /> : step.n}
                </div>
                <span
                  className={clsx(
                    "mt-2 text-xs font-semibold whitespace-nowrap transition-colors",
                    done   && "text-green-600",
                    active && "text-primary",
                    !done && !active && "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="flex-1 mt-[18px] mx-1">
                  <div
                    className={clsx(
                      "h-0.5 rounded-full transition-colors duration-500",
                      current > step.n ? "bg-green-400" : "bg-gray-200"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: slim bar + label */}
      <div className="sm:hidden">
        <div className="flex gap-1 mb-2">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className={clsx(
                "flex-1 h-1.5 rounded-full transition-colors duration-300",
                current > step.n   ? "bg-green-400" :
                current === step.n ? "bg-primary"    : "bg-gray-200"
              )}
            />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs font-semibold text-primary">
            Step {current} — {STEPS[current - 1]?.label}
          </p>
          <p className="text-xs text-gray-400">{current} / {STEPS.length}</p>
        </div>
      </div>
    </div>
  );
}
