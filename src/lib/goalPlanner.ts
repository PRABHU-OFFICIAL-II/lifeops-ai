import { ai } from "./gemini";

const USE_MOCK_DATA = false;

interface GeneratedPlan {
  projects: {
    title: string;
    tasks: string[];
  }[];
}

function getFallbackPlan(goal: string): GeneratedPlan {
  return {
    projects: [
      {
        title: `${goal} - Foundation`,
        tasks: [
          "Research required skills",
          "Create learning roadmap",
          "Define milestones",
        ],
      },
      {
        title: `${goal} - Execution`,
        tasks: [
          "Complete practical exercises",
          "Build real-world project",
          "Track weekly progress",
        ],
      },
      {
        title: `${goal} - Growth`,
        tasks: [
          "Gather feedback",
          "Improve weak areas",
          "Prepare final assessment",
        ],
      },
    ],
  };
}

export async function generatePlan(goal: string): Promise<GeneratedPlan> {
  if (USE_MOCK_DATA) {
    return {
      projects: [
        {
          title: "Technical Excellence",
          tasks: [
            "Study system design",
            "Practice architecture reviews",
            "Improve code quality",
          ],
        },
        {
          title: "Leadership",
          tasks: [
            "Mentor engineers",
            "Lead technical discussions",
            "Drive project planning",
          ],
        },
      ],
    };
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
You are a senior engineering career coach.

Break the user's goal into 3-5 projects.

Each project should contain 3-6 actionable tasks.

Return ONLY valid JSON.

Example:

{
  "projects": [
    {
      "title": "Technical Excellence",
      "tasks": [
        "Study system design",
        "Practice architecture reviews"
      ]
    }
  ]
}

Goal:
${goal}
`,
      });

      const text = response.text ?? "";

      console.log("Gemini Raw Response:");
      console.log(text);

      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      if (
        !parsed ||
        !parsed.projects ||
        !Array.isArray(parsed.projects) ||
        parsed.projects.length === 0
      ) {
        throw new Error("Invalid plan structure returned from Gemini");
      }

      return parsed;
    } catch (error) {
      console.error(`Plan generation attempt ${attempt + 1} failed`, error);

      lastError = error;

      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  console.error(
    "Falling back to default plan because Gemini failed",
    lastError,
  );

  return getFallbackPlan(goal);
}
