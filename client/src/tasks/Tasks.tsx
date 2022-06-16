import React, {useEffect, useState} from "react";
import {Table} from "react-bootstrap";
import {getTasks} from "./tasks.service";
import {Task} from "./task";


export const Tasks = props => {

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks().then(response => setTasks(response));
  }, []);

  return <>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Type</th>
          <th>Schedule type</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => {
          return <tr>
            <td>{task._id}</td>
            <td>{task.name}</td>
            <td>{task.type}</td>
            <td>{task.scheduleType}</td>
          </tr>
        })}
      </tbody>
    </Table>
  </>
}
