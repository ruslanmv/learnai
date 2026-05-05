export default function ProgressStars({
  total = 5,
  earned = 3,
}: {
  total?: number;
  earned?: number;
}) {
  return (
    <div className="flex gap-1" aria-label="progress stars">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className="text-2xl">
          {i < earned ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  );
}
