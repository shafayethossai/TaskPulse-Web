import { Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"

import AppLayout from "./components/layout/AppLayout"
import LoginPage from "./pages/LoginPage"
import NotFoundPage from "./pages/NotFoundPage"
import TaskDetailsPage from "./pages/TaskDetailsPage"
import DashboardPage from "./pages/DashboardPage"
import TasksPage from "./pages/TasksPage"

function App() {
  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={
            <ProtectedRoute>
              <AppLayout/>
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
