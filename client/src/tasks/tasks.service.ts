import axios from "axios";
import {Task} from "./task";

export const getTasks = (): Promise<Task[]> => {
  return axios.get('/api/tasks').then(response => {
    const tasks = response.data;
    tasks.forEach(transformTask);
    return tasks;
  });
}

export const deleteTask = (taskId: string): Promise<void> => {
  return axios.delete(`/api/tasks/${taskId}`);
}

export const saveTask = (task: Task): Promise<Task> => {
  if (task._id) {
    return axios.put(`/api/tasks/${task._id}`, task).then(response => {
      const task = response.data;
      transformTask(task);
      return task;
    });
  } else {
    return axios.post('/api/tasks', task).then(response => {
      const task = response.data;
      transformTask(task);
      return task;
    });
  }
}

function transformTask(task: Task): void {
  if (task.scheduledTime) {
    task.scheduledTime = new Date(task.scheduledTime);
  }
}
