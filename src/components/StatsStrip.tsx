const STATS = [
  { value: "5000+", label: "Happy Drivers" },
  { value: "20+", label: "Cars in Fleet" },
  { value: "300km", label: "Free Per Day" },
  { value: "24/7", label: "Support" },
];

const StatsStrip = () => {
  return (
    <section className="relative overflow-hidden bg-charcoal py-8 md:py-12">
      <div className="absolute -top-16 left-1/4 w-72 h-72 rounded-full bg-primary/25 blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-64 h-64 rounded-full bg-primary/15 blur-[110px] pointer-events-none" />
      <div className="container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              data-aos="zoom-in"
              data-aos-delay={i * 60}
              className="glass-panel rounded-2xl px-3 py-4 text-center"
            >
              <div className="font-heading text-xl md:text-3xl font-extrabold text-white leading-none">{s.value}</div>
              <div className="mt-1.5 text-[10px] md:text-xs uppercase tracking-wider text-white/70 font-semibold">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
