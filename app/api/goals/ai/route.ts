import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/src/lib/mongodb";
import { generatePlan } from "@/src/lib/goalPlanner";
import { logActivity } from "@/src/lib/activityLogger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const db = await getDb();

    // Create Goal
    const goalResult = await db.collection("goals").insertOne({
      title: body.title,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const goalId = goalResult.insertedId;

    // Generate Plan
    const plan = await generatePlan(body.title);
    // console.log("PLAN:");
    // console.log(JSON.stringify(plan, null, 2));
    await logActivity(
      "AI_PLAN_GENERATED",
      `Generated AI plan for ${body.title}`,
    );

    let projectsCreated = 0;
    let tasksCreated = 0;

    for (const project of plan.projects) {
      const projectResult = await db.collection("projects").insertOne({
        goalId,
        title: project.title,
        status: "not_started",
        createdAt: new Date(),
      });

      projectsCreated++;

      const projectId = projectResult.insertedId;

      for (const task of project.tasks) {
        await db.collection("tasks").insertOne({
          goalId,
          projectId,
          title: task,
          completed: false,
          createdAt: new Date(),
        });

        tasksCreated++;
      }
    }

    return NextResponse.json({
      success: true,
      goalId,
      projectsCreated,
      tasksCreated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
