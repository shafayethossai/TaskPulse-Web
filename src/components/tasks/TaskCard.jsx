import { Link } from "react-router-dom";

const statusStyles = {
    todo: 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    done: 'bg-green-100 text-green-700',
};

const priorityStyles = {
    low: 'bg-blue-50 text-blue-600',
    medium: 'bg-orange-50 text-orange-600',
    high: 'bg-red-50 text-red-600',
};

export default function TaskCard({ task, onToggleStatus }) {
    const handleQuickToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const nextStatus = task.status === 'done' ? 'todo' : 'done';
        onToggleStatus?.(task.id, nextStatus);
    }
    return (
        <Link
            to={`/tasks/${task.id}`}
            className="block bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className={`font-semibold text-gray-800 line-clamp-1 ${
                task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${statusStyles[task.status]}`}>
                    {task.status}
                </span>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{task.description || 'No description'}</p>

            <div className="flex items-center justify-between pt-2 border-t text-xs">
                <span className={`capitalize ${priorityStyles[task.priority]}`}>
                    {task.priority} priority
                </span>
                
                {onToggleStatus && (
                    <button
                        type="button"
                        onClick={handleQuickToggle}
                        className="px-2 py-1 rounded border text-gray-600 hover:bg-gray-50"
                    >
                        {task.status === 'done' ? 'Reopen' : 'Mark Done'}
                    </button>
                )}
            </div>
        </Link>
    );
}
