"use client";

import { useEffect, useState } from "react";
import StatCard from "@/src/components/StatCard";

export default function Dashboard() {
  interface Review {
    totalGoals: number;
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    progress: number;
  }

  interface WeeklyReview {
    productivityScore: number;
    completedThisWeek: number;
    summary: string;
  }

  interface Goal {
    _id: string;
    title: string;
  }

  interface Project {
    _id: string;
    title: string;
  }

  interface Task {
    _id: string;
    title: string;
    completed: boolean;
  }

  interface ActivityItem {
    _id: string;
    message: string;
  }

  const [review, setReview] = useState<Review | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [weeklyReview, setWeeklyReview] = useState<WeeklyReview | null>(null);

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
    const initialize = async () => {
      await loadData();
    };
    initialize();
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

  async function toggleTask(task: Task) {
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

  if (!review || !weeklyReview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">LifeOps AI</h1>

            <p className="text-slate-500 mt-1">AI-powered execution system</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 px-6 py-4 shadow-sm">
            <div className="text-xs text-slate-500">Productivity</div>

            <div className="text-3xl font-bold text-indigo-600">
              {weeklyReview.productivityScore}%
            </div>
          </div>
        </div>

        {/* Goal Input */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
          <div className="flex gap-4">
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Become Staff Engineer in 6 months..."
              className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={createGoal}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-medium transition"
            >
              {loading ? "Generating..." : "Generate Plan"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <h2 className="text-2xl font-bold mb-4">📊 Progress Overview</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard title="Goals" value={review.totalGoals} />
          <StatCard title="Projects" value={review.totalProjects} />
          <StatCard title="Tasks" value={review.totalTasks} />
          <StatCard title="Completed" value={review.completedTasks} />
          <StatCard
            title="Productivity"
            value={weeklyReview?.productivityScore ?? 0}
          />
        </div>

        {/* AI Review */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            AI Weekly Review
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="mt-5">
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600"
                  style={{
                    width: `${weeklyReview.productivityScore}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <p className="mt-6 opacity-90">{weeklyReview.summary}</p>
        </div>

        {/* Goals */}
        <h2 className="text-2xl font-bold mb-4">🎯 Goals</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {goals.map((goal) => (
            <div
              key={goal._id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{goal.title}</h3>

                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Projects + Tasks */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-4">📁 Projects</h2>

            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="border rounded-xl p-4 hover:bg-slate-50"
                >
                  <div className="flex justify-between items-center">
                    <span>{project.title}</span>

                    <span className="text-xs text-slate-500">Project</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-4">✅ Tasks</h2>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {tasks.map((task) => (
                <label
                  key={task._id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                  />

                  <span
                    className={
                      task.completed
                        ? "line-through text-slate-400"
                        : "text-slate-700"
                    }
                  >
                    {task.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold mb-4">📜 Recent Activity</h2>

          <div className="max-h-[300px] overflow-y-auto">
            {activity.map((item) => (
              <div key={item._id} className="flex gap-4 mb-4">
                <div className="w-3 h-3 rounded-full bg-indigo-600 mt-2" />

                <div className="flex-1 bg-slate-50 rounded-xl p-3">
                  {item.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
