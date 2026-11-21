export default function StateCard({ label, value, accent = "text-gray-800" }) {
    return (
        <div className="bg-white border rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
        </div>
    );
}