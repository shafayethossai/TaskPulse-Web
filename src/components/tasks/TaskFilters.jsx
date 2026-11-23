export default function TaskFilters({searchInput, onSearchChange, status, priority, sort, onFilterChange, onReset}) {
    return (
        <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col md:flex-row gap-3">
            <input 
                type="text" 
                value={searchInput} 
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tasks..."
                className="flex-1 border rounded px-3 py-2 text-sm"
            />

            <select 
                value={status} 
                onChange={(e) => onFilterChange("status", e.target.value)}
                className="border rounded px-3 py-2 text-sm bg-white"
            >
                <option value="all"> All Status </option>
                <option value="todo"> To Do </option>
                <option value="in-progress"> In Progress </option>
                <option value="done"> Done </option>
            </select>

            <select 
                value={priority} 
                onChange={(e) => onFilterChange("priority", e.target.value)}
                className="border rounded px-3 py-2 text-sm bg-white"
            >
                <option value="all"> All Priority </option>
                <option value="low"> Low </option>
                <option value="medium"> Medium </option>
                <option value="high"> High </option>
            </select>

            <select 
                value={sort}
                onChange={(e) => onFilterChange('sort', e.target.value)}
                className="border rounded px-3 py-2 text-sm bg-white"
            >
                <option value="newest"> Newest First </option>
                <option value="oldest"> Oldest First </option>
                <option value="dueDate"> Due Date (Earliest) </option>
            </select>

            <button
                type="button"
                onClick={onReset}
                className="px-4 py-2 text-sm border rounded text-gray-600 hover:bg-gray-50"
            >
                Reset
            </button>
        </div>
    );
}
