// src/components/GoldStandardBadge.tsx
export function GoldStandardBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-900 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-100">
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Gold Standard Exemplar
    </div>
  );
}
