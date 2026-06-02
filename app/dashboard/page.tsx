"use client";

import { useEffect, useState } from "react";
import StatCard from "@/src/components/StatCard";

export default function Dashboard() {
  const [review, setReview] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<any[]>([]);
  const [weeklyReview, setWeeklyReview] = useState<any>(null);

  async function loadData() {
    const reviewRes = await fetch("/api/review");
    const reviewData = await reviewRes.json();

    const goalsRes = await fetch("/api/goals");
    const goalsData = await goalsRes.json();

    const projectsRes = await fetch("/api/projects");
    const projectsData = await projectsRes.json();

    const tasksRes = await fetch("/api/tasks");
    const tasksData = await tasksRes.json();

    const activityRes = await fetch("/api/activity");
    const activityData = await activityRes.json();

    const weeklyRes = await fetch("/api/review/weekly");

    const weeklyData = await weeklyRes.json();

    setReview(reviewData);
    setGoals(goalsData);
    setProjects(projectsData);
    setTasks(tasksData);
    setActivity(activityData);
    setWeeklyReview(weeklyData);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createGoal() {
    if (!goal.trim()) return;

    setLoading(true);

    try {
      await fetch("/api/goals/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: goal,
        }),
      });

      setGoal("");
      await loadData();
    } finally {
      setLoading(false);
    }
  }

  async function toggleTask(task: any) {
    await fetch(`/api/tasks/${task._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    });

    await loadData();
  }

  if (!review) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white mb-8">
        <h1 className="text-5xl font-bold">🚀 LifeOps AI</h1>

        <p className="mt-2 text-lg">
          Turn goals into executable plans automatically
        </p>
      </div>

      <hr />

      <div style={{ marginTop: 20 }}>
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Become Staff Engineer in 6 months"
          style={{
            width: "70%",
            padding: 12,
            marginRight: 10,
          }}
        />

        <button onClick={createGoal} disabled={loading}>
          {loading ? "Generating..." : "Generate AI Plan"}
        </button>
      </div>

      <hr />

      <h2 className="text-2xl font-bold mb-4">📊 Progress Overview</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Goals" value={review.totalGoals} />

        <StatCard title="Projects" value={review.totalProjects} />

        <StatCard title="Tasks" value={review.totalTasks} />

        <StatCard title="Completed" value={review.completedTasks} />
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">🤖 Weekly AI Review</h3>

        <p>
          Productivity Score:
          <span className="font-bold ml-2 text-green-600">
            {weeklyReview.productivityScore}%
          </span>
        </p>

        <p>
          Tasks Completed:
          <span className="font-bold ml-2">
            {weeklyReview.completedThisWeek}
          </span>
        </p>

        <p className="mt-3 text-slate-600">{weeklyReview.summary}</p>
      </div>

      <div
        style={{
          width: 400,
          border: "1px solid #ccc",
          height: 20,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: `${review.progress}%`,
            height: "100%",
            backgroundColor: "green",
          }}
        />
      </div>

      <div>{review.progress}% Complete</div>

      <hr />

      <h2>🎯 Goals</h2>

      {goals.map((goal) => (
        <div
          key={goal._id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 10,
          }}
        >
          {goal.title}
        </div>
      ))}

      <hr />
      <hr />

      <h2>📁 Projects & Tasks</h2>

      {projects.map((project) => {
        const projectTasks = tasks.filter(
          (task) => String(task.projectId) === String(project._id),
        );

        return (
          <div
            key={project._id}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 12,
            }}
          >
            <h3>{project.title}</h3>

            {projectTasks.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              projectTasks.map((task) => (
                <div
                  key={task._id}
                  style={{
                    marginLeft: 20,
                    marginBottom: 8,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                  />{" "}
                  {task.title}
                </div>
              ))
            )}
          </div>
        );
      })}

      <hr />

      <h2>📜 Recent Activity</h2>

      {activity.map((item) => (
        <div
          key={item._id}
          style={{
            borderBottom: "1px solid #eee",
            padding: "8px 0",
          }}
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
