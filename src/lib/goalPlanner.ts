import { ai } from "./gemini";
const USE_MOCK_DATA = true;

export async function generatePlan(goal: string) {
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

  let lastError;

  for (let i = 0; i < 3; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
You are an expert goal planning assistant.

Break the user's goal into realistic projects and actionable tasks.

Return ONLY valid JSON.

Do not use markdown.
Do not use code blocks.
Do not explain anything.

Goal:
${goal}

Format:
{
  "projects": [
    {
      "title": "Project Name",
      "tasks": [
        "Task 1",
        "Task 2"
      ]
    }
  ]
}
`,
      });

      const text = response.text ?? "";

      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleaned);
    } catch (error) {
      lastError = error;

      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  throw lastError;
}
