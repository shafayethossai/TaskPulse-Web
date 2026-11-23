import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getTasks } from "../api/tasks";
import { useDebounce } from "../hooks/useDebounce";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskList from "../components/tasks/TaskList";
import Pagination from "../components/ui/Pagination";
import Skeleton from "../components/ui/Skeletion";

const LIMIT = 6;

export default function TasksPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    //Single source of truth URL
    const page = Number(searchParams.get('page')) || 1;
    const query = searchParams.get('q') || '';
    const status = searchParams.get('status') || 'all';
    const priority = searchParams.get('priority') || 'all'
    const sort = searchParams.get('sort') || 'newest';

    //Local source of truth from URL
    const [searchInput, setSearchInput] = useState(query);
    const useDebounceSearch = useDebounce(searchInput, 300);

    const [tasks, setTasks] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryCount, setRetryCount] = useState(0);

    //Update ?q= in URL after user pauses typing for 300ms
    useEffect(() => {
        if (useDebounceSearch === query) return;
        const next = new URLSearchParams(searchParams);
        if (useDebounceSearch.trim()) {
            next.set('q', useDebounceSearch.trim());
        } else {
            next.delete('q');
        }
        next.set('page', '1');
        setSearchParams(next, { replace: true });
    }, [useDebounceSearch, query, searchParams, setSearchParams]);

    // Fetch paginated, filtered, sorted tasks whenever URL query params change
    useEffect(() => {
        const controller = new AbortController();

        const sortMap = {
            newest: { _sort: 'createdAt', _order: 'desc' },
            oldest: { _sort: 'createdAt', _order: 'asc' },
            dueDate: { _sort: 'dueDate', _order: 'asc' },
        };

        const params = {
            _page: page,
            _limit: LIMIT,
            ...(query && { q: query }),
            ...(status !== 'all' && { status }),
            ...(priority !== 'all' && { priority }),
            ...sortMap[sort],
        }

        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await getTasks(params, controller.signal);
                
                setTasks(res.data);
                setTotalCount(Number(res.headers['x-total-count'] || 0));
            } catch (err) {
                if (err.name === 'CanceledError' || err.name === 'AbortError') return;
                setError(err.message || 'Failed to load tasks');
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchTasks();
        return (() => controller.abort());
    }, [page, query, status, priority, sort, retryCount]);

    const handlePageChange = (newPage) => {
        const next = new URLSearchParams(searchParams);
        next.set('page', String(newPage));
        setSearchParams(next);
    };

    const handleFilterChange = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value === 'all') {
            next.delete(key);
        } else {
            next.set(key, value);
        }
        next.set('page', '1');
        setSearchParams(next);
    };

    const handleReset = () => {
        setSearchInput('');
        setSearchParams({});
    };

    const totalPages = Math.ceil(totalCount / LIMIT);
        
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800"> All Tasks </h1>
                <span className="text-sm text-gray-500">{totalCount} matching tasks </span>
            </div>

            <TaskFilters 
                searchInput={searchInput}
                onSearchChange={setSearchInput}
                status={status}
                priority={priority}
                sort={sort}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
            />

            {loading && <Skeleton count={LIMIT} />}

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

            {!loading && !error && tasks.length === 0 && (
                <div className="text-center py-12 bg-white border rounded-lg text-gray-500">
                    No tasks match your filters
                </div>
            )}

            {!loading && !error && tasks.length > 0 && (
                <>
                    <TaskList tasks={tasks}/>
                    <Pagination 
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
}
