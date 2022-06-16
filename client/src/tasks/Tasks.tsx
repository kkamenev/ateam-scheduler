import React, {useEffect, useState} from "react";
import {Button, Table} from "react-bootstrap";
import {deleteTask, getTasks} from "./tasks.service";
import {Task} from "./task";
import {EditTaskDialog} from "./EditTaskDialog";

export const Tasks = () => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<Task>();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    reloadTasks();
  }, []);

  function reloadTasks() {
    getTasks().then(response => setTasks(response));
  }

  function onDialogClosed(saved: boolean) {
    if (saved) {
      reloadTasks();
    }
    setEditing(false);
    setTaskToEdit(undefined);
  }

  function editTask(task: Task) {
    setEditing(true);
    setTaskToEdit(task);
  }

  function handleDeleteTask(taskId: string) {
    deleteTask(taskId).then(() => reloadTasks());
  }

  return <>
    <div className="my-3 d-flex justify-content-start">
      <Button onClick={() => setEditing(true)}>Create</Button>
    </div>

    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Type</th>
          <th>Schedule type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => {
          return <tr key={task._id}>
            <td>{task._id}</td>
            <td>{task.name}</td>
            <td>{task.type}</td>
            <td>{task.scheduleType}</td>
            <td>
              <div className="d-flex">
                <Button onClick={() => editTask(task)}>Edit</Button>
                <Button className="mx-1" variant="secondary" onClick={() => handleDeleteTask(task._id)}>Delete</Button>
              </div>
            </td>
          </tr>
        })}
      </tbody>

      {editing ? <EditTaskDialog onClose={onDialogClosed} task={taskToEdit}/> : undefined}
    </Table>
  </>
}
