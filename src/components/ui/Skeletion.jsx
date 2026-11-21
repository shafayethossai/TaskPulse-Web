export default function Skeleton({ count }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, index) => (
                <div 
                    key={index}
                    className="h-36 bg-gray-200 rounded-lg animate-pulse p-4 space-y-3"
                >
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-300 rounded w-full" />
                    <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>
            ))}
        </div>
    );
}