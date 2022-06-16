import axios from "axios";
import {Task} from "./task";

export const getTasks = (): Promise<Task[]> => {
  return axios.get('/api/tasks').then(response => response.data);
}
