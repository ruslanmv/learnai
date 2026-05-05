export default function StageHero({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/90 p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-dark">{title}</h2>
      <p className="mt-2 text-gray-700">{description}</p>
    </div>
  );
}
