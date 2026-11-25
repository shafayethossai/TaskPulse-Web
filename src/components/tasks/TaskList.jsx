import TaskCard from "./TaskCard";

export default function TaskList({ tasks, onToggleStatus }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggleStatus={onToggleStatus} />
            ))}
        </div>
    );
}