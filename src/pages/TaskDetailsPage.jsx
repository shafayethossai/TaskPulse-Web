import { useParams } from "react-router-dom"

export default function TaskDetailsPage() {
    const {id} = useParams();
    return <h1 className="text-2xl font-bold">Task {id}</h1>
}
