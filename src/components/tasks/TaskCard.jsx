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

export default function TaskCard({ task }) {
    return (
        <Link
            to={`/tasks/${task.id}`}
            className="block bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-gray-800 line-clamp-1">
                    {task.title}
                </h3>
                <span 
                    className={`text-xs px-2 py-0.5 rounded font-medium capitalize shrink-0 ${
                        priorityStyles[task.priority] || 'bg-gray-100 text-gray-600'
                    }`}
                >
                    {task.priority}
                </span>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{task.description}</p>

            <div className="flex items-center justify-between text-x">
                <span 
                    className={`px-2 py-0.5 rounded font-medium capitalize ${
                        statusStyles[task.status] || 'bg-gray-100 text-gray-700'
                    }`}
                >
                    {task.status}
                </span>
                <span className="text-gray-400">Due: {task.dueDate}</span>
            </div>
        </Link>
    );
}