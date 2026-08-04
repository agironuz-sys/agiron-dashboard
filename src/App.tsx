import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { BottomDock } from "./components/BottomDock";
import { DashboardPage } from "./pages/DashboardPage";
import { VazifalarPage } from "./pages/VazifalarPage";
import { MahsulotlarPage } from "./pages/MahsulotlarPage";
import { OmborPage } from "./pages/OmborPage";
import { JamoaPage } from "./pages/JamoaPage";
import { api } from "./lib/api";
import type { EmployeeInput } from "./lib/api";
import type { ChecklistItem, Employee, Task, TaskStatus } from "./lib/types";

type Theme = "light" | "dark";

const VALID_TABS = ["dashboard", "tasks", "products", "warehouse", "team"];

function App() {
  const [activeTab, setActiveTabState] = useState(() => {
    const fromHash = window.location.hash.slice(1);
    return VALID_TABS.includes(fromHash) ? fromHash : "dashboard";
  });

  function setActiveTab(tab: string) {
    setActiveTabState(tab);
    window.location.hash = tab;
  }
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("theme") as Theme) || "light");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    function onHashChange() {
      const fromHash = window.location.hash.slice(1);
      if (VALID_TABS.includes(fromHash)) setActiveTabState(fromHash);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [emps, tsks] = await Promise.all([api.getEmployees(), api.getTasks()]);
        if (!cancelled) {
          setEmployees(emps);
          setTasks(tsks);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 10_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  function handleChecklistChange(taskId: string, checklist: ChecklistItem[]) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, checklist } : t)));
    api.updateChecklist(taskId, checklist).catch((e) => console.error("updateChecklist failed:", e));
  }

  function handleTaskUpdate(
    taskId: string,
    patch: {
      description: string;
      assigneeId: string;
      status: TaskStatus;
      deadlineIso: string;
      deadlineDisplay: string;
      checklist: ChecklistItem[];
    }
  ) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t)));
    api.updateTask(taskId, patch).catch((e) => console.error("updateTask failed:", e));
  }

  function handleTaskDelete(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    api.deleteTask(taskId).catch((e) => console.error("deleteTask failed:", e));
  }

  async function handleTaskCreate(input: {
    createdBy: string;
    assigneeId: string;
    description: string;
    deadlineIso: string;
    deadlineDisplay: string;
  }) {
    const task = await api.createTask(input);
    setTasks((prev) => [task, ...prev]);
  }

  async function handleEmployeeCreate(input: EmployeeInput) {
    const employee = await api.createEmployee(input);
    setEmployees((prev) => [...prev, employee]);
  }

  async function handleEmployeeUpdate(id: string, input: EmployeeInput) {
    const employee = await api.updateEmployee(id, input);
    setEmployees((prev) => prev.map((e) => (e.id === id ? employee : e)));
  }

  async function handleEmployeeDelete(id: string) {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    api.deleteEmployee(id).catch((e) => console.error("deleteEmployee failed:", e));
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100%" }}>
      <Header activeTab={activeTab} theme={theme} onThemeChange={setTheme} />

      {loading ? (
        <div className="px-12 py-10 text-[14px]" style={{ color: "var(--ink-soft)" }}>
          Yuklanmoqda...
        </div>
      ) : error ? (
        <div className="px-12 py-10 text-[14px]" style={{ color: "var(--danger)" }}>
          Xatolik: {error}. Backend API ishga tushirilganini tekshiring (bot/npm run dev).
        </div>
      ) : activeTab === "dashboard" ? (
        <DashboardPage tasks={tasks} employees={employees} />
      ) : activeTab === "tasks" ? (
        <VazifalarPage
          tasks={tasks}
          employees={employees}
          onChecklistChange={handleChecklistChange}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onTaskCreate={handleTaskCreate}
        />
      ) : activeTab === "products" ? (
        <MahsulotlarPage employees={employees} />
      ) : activeTab === "warehouse" ? (
        <OmborPage employees={employees} />
      ) : (
        <JamoaPage
          employees={employees}
          onCreate={handleEmployeeCreate}
          onUpdate={handleEmployeeUpdate}
          onDelete={handleEmployeeDelete}
        />
      )}

      <BottomDock active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;
