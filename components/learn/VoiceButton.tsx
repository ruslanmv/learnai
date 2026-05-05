export default function VoiceButton({ label = "Listen" }: { label?: string }) {
  return (
    <button className="rounded-xl bg-secondary px-5 py-3 font-semibold text-white hover:opacity-90">
      🎙️ {label}
    </button>
  );
}
