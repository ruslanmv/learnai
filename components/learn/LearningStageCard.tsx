import Link from "next/link";

type Props = {
  title: string;
  age: string;
  icon: string;
  description: string;
  exampleLesson: string;
  href: string;
};

export default function LearningStageCard({
  title,
  age,
  icon,
  description,
  exampleLesson,
  href,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-3xl">{icon}</div>
      <p className="mt-3 text-sm font-semibold text-primary">Ages: {age}</p>
      <h3 className="mt-1 text-2xl font-bold text-dark">{title}</h3>
      <p className="mt-3 text-gray-600">{description}</p>
      <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
        Example: {exampleLesson}
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-secondary"
      >
        Start this journey
      </Link>
    </div>
  );
}
