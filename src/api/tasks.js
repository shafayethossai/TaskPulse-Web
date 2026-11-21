import api from "./client"

export const getTasks = (params, signal) => 
    api.get("/tasks", {params, signal});

export const getTask = (id, signal) => 
    api.get("/tasks/${id}", {signal}).then((res) => res.data);

export const createTask = (task) => 
    api.post("/tasks", task).then((res) => res.data);

export const updateTask = (id, changes) => 
    api.patch(`/tasks/${id}`, changes).then((res) => res.data);

export const deleteTask = (id) =>
    api.delete(`/tasks/${id}`).then((res) => res.data);