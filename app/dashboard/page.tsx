/* eslint-disable react-hooks/purity */
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
    progress?: number;
  }

  interface Task {
    _id: string;
    title: string;
    completed: boolean;
    projectId: string;
    priority?: string;
  }

  interface ActivityItem {
    _id: string;
    message: string;
    createdAt: string;
  }

  function getPriorityColor(priority?: string) {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-amber-100 text-amber-700";

      default:
        return "bg-green-100 text-green-700";
    }
  }

  function getProjectProgress(projectId: string) {
    const projectTasks = tasks.filter(
      (task: Task) => String(task.projectId) === String(projectId),
    );

    if (projectTasks.length === 0) {
      return 0;
    }

    const completed = projectTasks.filter(
      (task: Task) => task.completed,
    ).length;

    return Math.round((completed / projectTasks.length) * 100);
  }

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours} hrs ago`;

    const days = Math.floor(hours / 24);

    return `${days} days ago`;
  }

  const [review, setReview] = useState<Review | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [weeklyReview, setWeeklyReview] = useState<WeeklyReview | null>(null);
  const [error, setError] = useState("");
  const nextTask = tasks.find((t) => !t.completed);

  async function loadData() {
    try {
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
    } catch (err) {
      setError("Unable to load dashboard.");
    }
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
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-600">LifeOps AI</div>

          <div className="mt-3 text-slate-500">
            Loading your execution system...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
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

        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 rounded-2xl p-4 mb-6">
            {error}
          </div>
        )}

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

        <div className="bg-slate-900 text-white rounded-3xl p-8 mb-10">
          <div className="text-sm uppercase tracking-wider text-slate-400 mb-2">
            AI Recommendation
          </div>

          {(() => {
            const nextTask = tasks.find((t) => !t.completed);

            return (
              <>
                <h2 className="text-3xl font-bold mb-3">
                  {nextTask ? nextTask.title : "All Tasks Completed 🎉"}
                </h2>

                <p className="text-slate-300">
                  {nextTask
                    ? "This is the next highest-impact action to move your goal forward."
                    : "Great work. Your current execution queue is empty."}
                </p>
              </>
            );
          })()}
        </div>

        {/* Stats */}
        <h2 className="text-2xl font-bold mb-4">📊 Progress Overview</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border">
            <div className="text-sm text-slate-500">Completion Rate</div>

            <div className="text-3xl font-bold">{review.progress}%</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border">
            <div className="text-sm text-slate-500">Remaining Tasks</div>

            <div className="text-3xl font-bold">
              {review.totalTasks - review.completedTasks}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border">
            <div className="text-sm text-slate-500">Weekly Output</div>

            <div className="text-3xl font-bold">
              {weeklyReview.completedThisWeek}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Goals" value={review.totalGoals} />
          <StatCard title="Projects" value={review.totalProjects} />
          <StatCard title="Tasks" value={review.totalTasks} />
          <StatCard title="Completed" value={review.completedTasks} />
        </div>

        {/* AI Review */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="text-sm text-slate-500 mb-2">
                Productivity Score
              </div>

              <div className="text-5xl font-bold text-indigo-600">
                {weeklyReview.productivityScore}%
              </div>
            </div>

            <div className="flex-1">
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{
                    width: `${weeklyReview.productivityScore}%`,
                  }}
                />
              </div>

              <p className="mt-4 text-slate-600">{weeklyReview.summary}</p>
            </div>
          </div>
        </div>

        {/* Goals */}
        <h2 className="text-2xl font-bold mb-4">🎯 Goals</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {goals.map((goal) => {
            const goalProjects = projects.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (project: any) => String(project.goalId) === String(goal._id),
            );

            const goalTasks = tasks.filter((task) =>
              goalProjects.some(
                (project) => String(project._id) === String(task.projectId),
              ),
            );

            const completedTasks = goalTasks.filter(
              (task) => task.completed,
            ).length;

            const progress =
              goalTasks.length === 0
                ? 0
                : Math.round((completedTasks / goalTasks.length) * 100);

            return (
              <div
                key={goal._id}
                className="bg-white rounded-3xl border border-slate-200 p-6"
              >
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold text-lg">{goal.title}</h3>

                  <span className="text-indigo-600 font-semibold">
                    {progress}%
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div className="mt-3 text-sm text-slate-500">
                  {completedTasks}/{goalTasks.length} tasks completed
                </div>
              </div>
            );
          })}
        </div>

        {/* Projects + Tasks */}
        <div className="grid lg:grid-cols-12 gap-6 mb-10">
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4">📁 Projects</h2>

            <div className="space-y-3">
              {projects.map((project) => {
                const projectTasks = tasks.filter(
                  (t) => t.projectId === project._id,
                );

                const completed = projectTasks.filter(
                  (t) => t.completed,
                ).length;

                const progress =
                  projectTasks.length === 0
                    ? 0
                    : Math.round((completed / projectTasks.length) * 100);

                return (
                  <div
                    key={project._id}
                    className="border rounded-2xl p-5 hover:bg-slate-50"
                  >
                    <div className="flex justify-between mb-3">
                      <span className="font-medium">{project.title}</span>

                      <span className="text-sm text-slate-500">
                        {progress}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      {completed}/{projectTasks.length} completed
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4">✅ Tasks</h2>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {tasks.map((task) => (
                <label
                  key={task._id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
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
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                        task.priority,
                      )}`}
                    >
                      {task.priority || "Low"}
                    </span>

                    <span
                      className={
                        task.completed
                          ? "text-green-600 text-sm font-medium"
                          : "text-amber-600 text-sm font-medium"
                      }
                    >
                      {task.completed ? "Done" : "Pending"}
                    </span>
                  </div>
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
              <div key={item._id} className="relative pl-8 pb-6">
                <div className="absolute left-0 top-2 h-3 w-3 rounded-full bg-indigo-600" />

                <div className="absolute left-[5px] top-5 bottom-0 w-px bg-slate-200" />

                <div className="bg-slate-50 rounded-2xl p-4">
                  <div>{item.message}</div>

                  <div className="text-xs text-slate-400 mt-2">
                    {formatTimeAgo(item.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
