export function ProgressBar({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <div className="flex w-full gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1 flex-1 rounded-full transition-colors duration-300"
          style={{
            backgroundColor: i <= current ? "var(--color-brand-500)" : "var(--color-ink-line)",
          }}
        />
      ))}
    </div>
  );
}
