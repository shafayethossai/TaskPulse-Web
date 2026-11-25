import { useState, useEffect, useMemo } from "react"
import { getTasks, updateTask } from "../api/tasks"
import TaskList from "../components/tasks/TaskList"
import Skeleton from "../components/ui/Skeletion"
import StateCard from '../components/tasks/StateCard';

export default function DashboardPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryCount, setRetryCount] = useState(0);

    const handleToggleStatus = async (taskId, nextStatus) => {
        const previousTasks = tasks;
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === taskId ? { ...task, status: nextStatus } : task
            )
        );

        try {
            await updateTask(taskId, { status: nextStatus });
        } catch (err) {
            setTasks(previousTasks);
            alert(err.message || "Failed to update task status");
        }
    };

    useEffect(() => {
        const controller = new AbortController();

        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await getTasks({}, controller.signal);
                setTasks(res.data);
            } catch (err) {
                if (err.name === "CanceledError" || err.name === "AbortError") return;
                setError(err.message || "Failed to load dashboard");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadDashboard();
        return () => controller.abort();
    }, [retryCount]);

    const stats = useMemo(() => {
        return tasks.reduce(
            (acc, task) => {
                acc.total += 1;
                if (task.status === "todo") acc.todo += 1;
                else if (task.status === "in-progress") acc.inProgress += 1;
                else if (task.status === "done") acc.done += 1;
                return acc;
            },
            { total: 0, todo: 0, inProgress: 0, done: 0 }
        );
    }, [tasks]);

    const recentTasks = useMemo (() => {
        return [...tasks]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
    }, [tasks]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

            {loading && <Skeleton count={4} />}

            {!loading && error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-red-700">{error}</span>
                    <button 
                        onClick={() => setRetryCount((c) => c + 1)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                        <StateCard label="Total Tasks" value={stats.total} />
                        <StateCard label="To Do" value={stats.todo} accent="text-gray-700"/>
                        <StateCard label="In Progress" value={stats.inProgress} accent="text-yellow-600"/>
                        <StateCard label="Completed" value={stats.done} accent="text-green-600"/>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold text-gray-800"> Recent Tasks</h2>
                        {recentTasks.length === 0 ? (
                            <p className="text-gray-500">No tasks yet</p>
                        ) : (
                            <TaskList tasks={recentTasks} onToggleStatus={handleToggleStatus}/>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
