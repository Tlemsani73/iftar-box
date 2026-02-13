"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { OrderConfig } from "@/lib/order";
import { RAMADAN_START, RAMADAN_END } from "@/lib/order";

/* ─── Helpers ─── */

const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d + n);
  return toDateStr(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDisplay(dateStr: string): string {
  const [, m, d] = dateStr.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[m - 1]} ${d}`;
}

function generateMonthCells(year: number, month: number): (number | null)[] {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

/* ─── Month Grid ─── */

function MonthGrid({
  title,
  year,
  month,
  cells,
  highlighted,
  startDate,
  isRamadanFn,
  isClickableFn,
  onClick,
}: {
  title: string;
  year: number;
  month: number;
  cells: (number | null)[];
  highlighted: Set<string>;
  startDate: string;
  isRamadanFn: (d: string) => boolean;
  isClickableFn: (d: string) => boolean;
  onClick: (d: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-bold text-foreground mb-2">{title}</p>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_HEADERS.map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] font-semibold text-muted-foreground py-0.5"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;

          const dateStr = toDateStr(year, month, day);
          const ramadan = isRamadanFn(dateStr);
          const lit = highlighted.has(dateStr);
          const clickable = isClickableFn(dateStr);
          const isStart = dateStr === startDate;

          if (!ramadan) {
            return (
              <div
                key={day}
                className="aspect-square rounded-lg flex items-center justify-center text-[11px] text-muted-foreground/20"
              >
                {day}
              </div>
            );
          }

          return (
            <div
              key={day}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              onClick={clickable ? () => onClick(dateStr) : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onClick(dateStr);
                      }
                    }
                  : undefined
              }
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center text-[11px] transition-all",
                lit
                  ? cn(
                      "bg-primary text-white font-bold",
                      isStart && "ring-2 ring-primary ring-offset-1"
                    )
                  : clickable
                    ? "bg-primary/5 text-foreground font-medium border border-primary/20 hover:bg-primary/20 cursor-pointer"
                    : "bg-muted/30 text-muted-foreground/40"
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── RamadanCalendar ─── */

interface RamadanCalendarProps {
  order: OrderConfig;
  onStartDateChange: (date: string) => void;
}

export default function RamadanCalendar({
  order,
  onStartDateChange,
}: RamadanCalendarProps) {
  const { orderType, subDuration, startDate } = order;
  const is30 = orderType === "subscription" && subDuration === 30;
  const is10 = orderType === "subscription" && subDuration === 10;

  /* Highlighted delivery dates */
  const highlighted = useMemo(() => {
    const set = new Set<string>();
    if (is30) {
      for (let i = 0; i < 30; i++) set.add(addDays(RAMADAN_START, i));
    } else if (startDate) {
      const count = is10 ? 10 : 1;
      for (let i = 0; i < count; i++) set.add(addDays(startDate, i));
    }
    return set;
  }, [is30, is10, startDate]);

  /* Last valid start for 10-day window */
  const maxStart10 = useMemo(() => addDays(RAMADAN_END, -9), []);

  function isRamadan(d: string) {
    return d >= RAMADAN_START && d <= RAMADAN_END;
  }

  function isClickable(d: string) {
    if (!isRamadan(d)) return false;
    if (is30) return false;
    if (is10) return d <= maxStart10;
    return true;
  }

  function handleClick(d: string) {
    if (isClickable(d)) onStartDateChange(d);
  }

  /* Helper text */
  let helperText: string;
  if (is30) {
    helperText = "All 30 nights of Ramadan";
  } else if (is10) {
    helperText = startDate
      ? `10 days: ${formatDisplay(startDate)} \u2013 ${formatDisplay(addDays(startDate, 9))}`
      : "Tap a date to choose your 10-day start";
  } else {
    helperText = startDate
      ? `Delivery on ${formatDisplay(startDate)}`
      : "Tap a date to choose your delivery day";
  }

  const febCells = useMemo(() => generateMonthCells(2026, 1), []);
  const marCells = useMemo(() => generateMonthCells(2026, 2), []);

  return (
    <section className="mt-10">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
        Delivery Schedule
      </h2>
      <p className="text-sm text-muted-foreground mb-5">
        Ramadan 2026 &middot; Feb 18 &ndash; Mar 19
      </p>

      <div className="rounded-2xl border-2 border-border bg-card p-4 sm:p-5">
        {/* Status line */}
        <p className="text-sm font-medium text-foreground mb-4">
          {helperText}
        </p>

        {/* Two month grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MonthGrid
            title="February"
            year={2026}
            month={1}
            cells={febCells}
            highlighted={highlighted}
            startDate={startDate}
            isRamadanFn={isRamadan}
            isClickableFn={isClickable}
            onClick={handleClick}
          />
          <MonthGrid
            title="March"
            year={2026}
            month={2}
            cells={marCells}
            highlighted={highlighted}
            startDate={startDate}
            isRamadanFn={isRamadan}
            isClickableFn={isClickable}
            onClick={handleClick}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-primary" />
            Delivery day
          </span>
          {!is30 && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary/10 border border-primary/30" />
              Available
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
