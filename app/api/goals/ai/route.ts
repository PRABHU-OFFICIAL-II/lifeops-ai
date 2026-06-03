import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/src/lib/mongodb";
import { generatePlan } from "@/src/lib/goalPlanner";
import { logActivity } from "@/src/lib/activityLogger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const db = await getDb();

    const goalResult = await db.collection("goals").insertOne({
      title: body.title,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const goalId = goalResult.insertedId;

    const plan = await generatePlan(body.title);

    console.log(
      "Generated Plan:",
      JSON.stringify(plan, null, 2),
    );

    await logActivity(
      "GOAL_CREATED",
      `Created goal: ${body.title}`,
    );

    let projectsCreated = 0;
    let tasksCreated = 0;

    for (const project of plan.projects) {
      const projectResult = await db.collection("projects").insertOne({
        goalId,
        title: project.title,
        status: "not_started",
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      projectsCreated++;

      await logActivity(
        "PROJECT_CREATED",
        `Created project: ${project.title}`,
      );

      const projectId = projectResult.insertedId;

      const priorities = ["High", "Medium", "Low"];

      for (const task of project.tasks) {
        const priority =
          priorities[
            Math.floor(Math.random() * priorities.length)
          ];

        await db.collection("tasks").insertOne({
          goalId,
          projectId,
          title: task,
          completed: false,
          priority,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        tasksCreated++;

        await logActivity(
          "TASK_CREATED",
          `Created task: ${task}`,
        );
      }
    }

    await logActivity(
      "AI_PLAN_GENERATED",
      `Generated execution plan for ${body.title}`,
    );

    return NextResponse.json({
      success: true,
      goalId,
      projectsCreated,
      tasksCreated,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}