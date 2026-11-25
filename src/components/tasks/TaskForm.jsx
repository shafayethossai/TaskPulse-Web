import { useState, useEffect, useRef } from "react";

export default function TaskForm ({ intialData = null, onSubmit, onCancel, submitting }) {
    const [title, setTitle] = useState(intialData?.title || '');
    const [description, setDescription] = useState(intialData?.description || '');
    const [status, setStatus] = useState(intialData?.status || 'todo');
    const [priority, setPriority] = useState(intialData?.priority || 'medium');
    const [dueDate, setDueDate] = useState(intialData?.dueDate || '');
    const [error, setError] = useState('');

    const titleInputRef = useRef(null);

    useEffect(() => {
        titleInputRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError("Task title is required");
            return;
        }
        setError('');
        await onSubmit({
            title: title.trim(),
            description: description.trim(),
            status,
            priority,
            dueDate: dueDate || new Date().toISOString().split('T')[0],
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-2.5 text-sm bg-red-50 border border-red-200 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input 
                    ref={titleInputRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Build React Native login screen"
                    className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional details.."
                    className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm bg-white"
                    >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select 
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm bg-white"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input 
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="px-4 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {submitting ? 'Saving...' : intialData ? 'Save Changes' : 'Create Task'}
                </button>
            </div>
        </form>
    );
}
