import { useState, useEffect } from "react";
import { getTasks } from "../api/tasks";
import Skeleton from "../components/ui/Skeletion";
import TaskList from "../components/tasks/TaskList";


export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await getTasks({}, controller.signal);
                setTasks(res.data);
            } catch (err) {                
                if (err.name === "CanceledError" || err.name === "AbortError") return;
                setError(err.message || "Failed to load tasks");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchTasks();

        return () => controller.abort();
    }, [retryCount]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800"> All Tasks </h1>
                <span className="text-sm text-gray-500">{tasks.length} tasks </span>
            </div>

            {loading && <Skeleton count={6} />}

            {!loading && error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-red-700">{error}</span>
                    <button 
                        onClick={setRetryCount((c) => c+1)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && tasks.length === 0 && (
                <div className="text-center py-12 bg-white border rounded-lg text-gray-500">
                    No tasks yet
                </div>
            )}

            {!loading && !error && tasks.length > 0 && <TaskList tasks={tasks} />}
        </div>
    );
}