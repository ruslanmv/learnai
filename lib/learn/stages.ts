export type LearnerStage =
  | "LITTLE_LEARNER"
  | "EXPLORER"
  | "BUILDER"
  | "SCHOLAR"
  | "UNIVERSITY"
  | "PROFESSIONAL"
  | "SENIOR";

export type LearnerProfile = {
  id: string;
  name: string;
  stage: LearnerStage;
  age?: number;
  language: string;
  attentionMinutes: number;
  interests: string[];
};

export const LEARNING_STAGES: Array<{
  stage: LearnerStage;
  title: string;
  age: string;
  icon: string;
  description: string;
  exampleLesson: string;
  href: string;
}> = [
  {
    stage: "LITTLE_LEARNER",
    title: "Little Learner",
    age: "3–6",
    icon: "🦉",
    description: "Stories, numbers, letters, colors, and emotions.",
    exampleLesson: "Count jungle animals with Milo",
    href: "/onboarding?stage=LITTLE_LEARNER",
  },
  {
    stage: "EXPLORER",
    title: "Explorer",
    age: "7–11",
    icon: "🚀",
    description: "Science, reading, math games, and curiosity quests.",
    exampleLesson: "Discover how volcanoes work",
    href: "/onboarding?stage=EXPLORER",
  },
  {
    stage: "BUILDER",
    title: "Builder",
    age: "12–15",
    icon: "🛠️",
    description: "Projects, coding, logic, and problem solving.",
    exampleLesson: "Build a simple calculator in Python",
    href: "/onboarding?stage=BUILDER",
  },
  {
    stage: "SCHOLAR",
    title: "Scholar",
    age: "16–18",
    icon: "🎓",
    description: "Exam preparation, study plans, and career discovery.",
    exampleLesson: "Trigonometry mastery sprint",
    href: "/onboarding?stage=SCHOLAR",
  },
  {
    stage: "PROFESSIONAL",
    title: "Professional",
    age: "18+",
    icon: "💼",
    description: "Certifications, AI, coding, cloud, and career skills.",
    exampleLesson: "AWS networking review: VPC essentials",
    href: "/onboarding?stage=PROFESSIONAL",
  },
  {
    stage: "SENIOR",
    title: "Senior Learner",
    age: "Older adults",
    icon: "🌿",
    description: "Digital literacy, memory practice, and patient guidance.",
    exampleLesson: "How to identify scam messages",
    href: "/onboarding?stage=SENIOR",
  },
];

export function stageToPath(stage: LearnerStage): string {
  switch (stage) {
    case "LITTLE_LEARNER":
      return "/learn/kids";
    case "EXPLORER":
      return "/learn/explorer";
    case "BUILDER":
      return "/learn/builder";
    case "SCHOLAR":
      return "/learn/scholar";
    case "UNIVERSITY":
    case "PROFESSIONAL":
      return "/learn/adult";
    case "SENIOR":
      return "/learn/senior";
    default:
      return "/onboarding";
  }
}
