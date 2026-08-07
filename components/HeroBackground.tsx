// Fond décoratif : dégradés dorés diffus sur noir, non interactif (z-0).
export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute -left-1/4 top-[-10%] h-[60vh] w-[60vh] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,39,0.55) 0%, rgba(201,162,39,0) 70%)",
        }}
      />
      <div
        className="absolute right-[-15%] top-[30%] h-[50vh] w-[50vh] rounded-full opacity-15 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(232,201,95,0.5) 0%, rgba(232,201,95,0) 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
