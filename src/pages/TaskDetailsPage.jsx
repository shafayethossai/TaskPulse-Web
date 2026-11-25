import { useState, useEffect } from "react";
import {Link, useNavigate, useParams} from 'react-router-dom';
import { deleteTask, getTask, updateTask } from "../api/tasks";
import Modal from "../components/ui/Modal";
import TaskForm from "../components/tasks/TaskForm";
import Skeleton from "../components/ui/Skeletion";

export default function TaskDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect (() => {
        const controller = new AbortController();

        const loadTask = async () => {
            try {
                setLoading(true);
                setError('');
                const taskData = await getTask(id, controller.signal);
                setTask(taskData);
            } catch (err) {
                if (err.name === 'CanceledError' || err.name === 'AbortError') return;
                setError(err.response?.status === 404 ? 'Task not found' : 'Failed to load task');
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadTask();
        return () => controller.abort();
    }, [id]);

    const handleUpdate = async (formData) => {
        try {
            setSubmitting(true);
            const taskData = await updateTask(id, formData);
            setTask(taskData);
            setIsEditOpen(false);
        } catch (err) {
            alert(err.message || 'Failed to update task');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this task permanently?')) return;
        try {
            setSubmitting(true);
            await deleteTask(id);
            navigate('/tasks', { replace: true });
        } catch (err) {
            alert(err.message || 'Failed to delete task');
            setSubmitting(false);
        }
    };

    if (loading) return <Skeleton count={1} />;

    if (error || !task) {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error || 'Task not found'}
                </div>
                <Link to='/tasks' className="text-sm text-blue-600 hover:underline">
                    &larr; Back to Tasks
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-6">
            <Link to="/tasks" className="inline-block text-sm text-blue-600 hover:underline">
                &larr; Back to Tasks
            </Link>

            <div className="bg-white border rounded-lg p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => setIsEditOpen(true)}
                            className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
                        >
                            Edit
                        </button>

                        <button
                            onClick={handleDelete}
                            disabled={submitting}
                            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <p className="text-gray-600 text-sm whitespace-pre-line">
                    {task.description || 'No description provided.'}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t text-sm">
                    <div>
                        <span className="text-gray-400 block">Status</span>
                        <span className="font-medium capitalize">{task.status}</span>
                    </div>

                    <div>
                        <span className="text-gray-400 block">Priority</span>
                        <span className="font-medium capitalize">{task.priority}</span>
                    </div>

                    <div>
                        <span className="text-gray-400 block">Due Date</span>
                        <span className="font-medium">{task.dueDate || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title={"Edit Task"}
            >
                <TaskForm
                    intialData={task}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditOpen(false)}
                    submitting={submitting}
                />
            </Modal>
        </div>
    );
}
