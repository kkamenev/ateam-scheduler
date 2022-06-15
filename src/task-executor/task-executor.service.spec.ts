import {TaskExecutorService} from "./task-executor.service";
import {TaskService} from "../tasks/task.service";
import {TaskDocument} from "../tasks/task";

describe('TaskExecutorService', () => {
  let service: TaskExecutorService;
  let taskServiceMock: TaskService;
  let onTaskCreatedSpy;
  let onTaskDeleted;
  let onTaskUpdated;
  let getAllSpy;

  describe('on startup', () => {

    beforeEach(async () => {
      taskServiceMock = {
        getAll(): Promise<TaskDocument[]> {return null;},
        onTaskCreated(callback: (task: TaskDocument) => any) {},
        onTaskDeleted(callback: (taskId: string) => any) {},
        onTaskUpdated(callback: (task: TaskDocument) => any) {},
      } as TaskService;
      getAllSpy = jest.spyOn(taskServiceMock, 'getAll');
      onTaskCreatedSpy = jest.spyOn(taskServiceMock, 'onTaskCreated');
      onTaskDeleted = jest.spyOn(taskServiceMock, 'onTaskDeleted');
      onTaskUpdated = jest.spyOn(taskServiceMock, 'onTaskUpdated');
      getAllSpy.mockImplementation(() => Promise.resolve([]));
      service = new TaskExecutorService(taskServiceMock);
    });

    it('reads tasks from DB', () => {
      expect(getAllSpy.mock.calls.length).toBe(1);
    });

    it('starts listening to CRUD events', () => {
      expect(onTaskCreatedSpy.mock.calls.length).toBe(1);
      expect(onTaskDeleted.mock.calls.length).toBe(1);
      expect(onTaskUpdated.mock.calls.length).toBe(1);
    });

  })
});
