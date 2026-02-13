import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full px-4 py-3">
      <ol className="flex items-center justify-between">
        {steps.map((label, i) => {
          const completed = i < currentStep;
          const active = i === currentStep;

          return (
            <li key={label} className="flex flex-1 items-center last:flex-initial">
              <div className="flex flex-col items-center gap-1.5">
                {/* Circle */}
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-300",
                    completed &&
                      "size-8 border-primary bg-primary text-primary-foreground scale-100",
                    active &&
                      "size-10 border-primary bg-primary text-primary-foreground text-base scale-100",
                    !completed &&
                      !active &&
                      "size-8 border-border bg-card text-muted-foreground"
                  )}
                >
                  {completed ? (
                    <Check className="size-4" strokeWidth={3} />
                  ) : (
                    <span className={cn(active ? "text-sm" : "text-xs")}>{i + 1}</span>
                  )}
                </div>

                {/* Label — hidden on mobile */}
                <span
                  className={cn(
                    "hidden text-xs md:block transition-colors duration-300",
                    completed && "text-primary font-medium",
                    active && "text-primary font-bold",
                    !completed && !active && "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="mx-2 flex-1 self-center mb-5 md:mb-0 relative h-0.5">
                  {/* Background track */}
                  <div className="absolute inset-0 rounded-full bg-border" />
                  {/* Filled overlay */}
                  {i < currentStep && (
                    <div className="absolute inset-0 rounded-full bg-primary animate-line-fill" />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
