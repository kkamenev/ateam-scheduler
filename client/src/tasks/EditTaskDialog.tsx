import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {newTask, Task, TaskScheduleType, TaskType} from "./task";
import dayjs from "dayjs";
import {saveTask} from "./tasks.service";

export type EditTaskDialogProps = {
  onClose: (saved: boolean) => any;
  task?: Task
}

const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

export const EditTaskDialog = (props: EditTaskDialogProps) => {

  const task = props.task || newTask();
  const [editableTask, setEditableTask] = useState(task);
  const [params, setParams] = useState(task.params && JSON.stringify(task.params));
  const [scheduledTimeStr, setScheduledTimeStr] = useState(formatTime(task.scheduledTime));

  function handleClose() {
    props.onClose(true);
  }

  function handleFormSubmission() {
    if (params) {
      editableTask.params = JSON.parse(params);
    }
    if (scheduledTimeStr) {
      editableTask.scheduledTime = dayjs(scheduledTimeStr, DATETIME_FORMAT).toDate();
    }
    saveTask(editableTask).then(() => props.onClose(true));
  }

  function setField(fieldName: string, value: any) {
    const modifiedTask = {...editableTask};
    modifiedTask[fieldName] = value;
    setEditableTask(modifiedTask);
  }

  function formatTime(dateTime: Date): string {
    return dateTime ? dayjs(dateTime).format(DATETIME_FORMAT) : '';
  }

  return <Modal show={true} onHide={handleClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Create or edit a task</Modal.Title>
    </Modal.Header>
    <Form>
      <Modal.Body>
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" value={editableTask.name} onChange={event => setField('name', event.target.value)}/>

        <Form.Label className="mt-2">Type</Form.Label>
        <Form.Select value={editableTask.type} onChange={event => setField('type', event.target.value)}>
          <option value={TaskType.MAIL}>Mail</option>
          <option value={TaskType.DATA_SYNC}>Data sync</option>
        </Form.Select>

        <Form.Label className="mt-2">Schedule Type</Form.Label>
        <Form.Select value={editableTask.scheduleType} onChange={event => setField('scheduleType', event.target.value)}>
          <option value={TaskScheduleType.IMMEDIATE}>Immediate</option>
          <option value={TaskScheduleType.SCHEDULED_ONCE}>Once</option>
          <option value={TaskScheduleType.SCHEDULED_CRON}>Cron</option>
        </Form.Select>

        <Form.Label>Scheduled time (YYYY-MM-DD HH:mm)</Form.Label>
        <Form.Control type="text" value={scheduledTimeStr} onChange={event => setScheduledTimeStr(event.target.value)}/>

        <Form.Label>Cron expression</Form.Label>
        <Form.Control type="text" value={editableTask.cronSchedule} onChange={event => setField('cronSchedule', event.target.value)}/>

        <Form.Label>Parameters (JSON)</Form.Label>
        <Form.Control as="textarea" rows={3} value={params} onChange={event => setParams(event.target.value)}/>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleFormSubmission}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Form>

  </Modal>
}
