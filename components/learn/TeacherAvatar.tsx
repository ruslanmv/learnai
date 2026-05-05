export default function TeacherAvatar({ name, emoji }: { name: string; emoji: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow">
      <span className="text-2xl">{emoji}</span>
      <span className="font-semibold text-dark">{name}</span>
    </div>
  );
}
