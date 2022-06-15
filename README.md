## Description

The application provides a simple CRUD API for managing scheduled tasks. On startup, existing tasks are read from
DB (MongoDB). Tasks scheduled for immediate execution and tasks with scheduled time in the past are executed immediately. Recurring 
cron-based tasks and tasks with scheduled time in future are scheduled for future execution using 
[node-schedule](https://www.npmjs.com/package/node-schedule). 
The application assumes that the amount of tasks is small enough to be read in one batch and kept in memory. 
No pagination is used. When a task is deleted/modified via the API, an event is emitted which triggers task 
rescheduling in TaskExecutorService. TaskExecutorService enforces a limit of concurrently running tasks to avoid 
system overload (currently set to 3). If the limit is exceeded, tasks are placed in a queue and are executed on 
best-effort basis as capacity increases. Cron-based tasks are kept in DB until they are removed via API. Other tasks
are removed immediately after execution (both successful and failed). Failed executions are not retried.

Deployed application is [available on Heroku](https://ateam-sheduler.herokuapp.com/).

## API 

Task scheduling service exposes the following API for scheduled task management.

List tasks

```bash
$ curl -X GET 'https://ateam-sheduler.herokuapp.com/api/tasks'
```

Create a task for immediate execution

```bash
curl -X POST 'https://ateam-sheduler.herokuapp.com/api/tasks' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Send mail immediately",
    "scheduleType": "IMMEDIATE",
    "type": "MAIL",
    "params": {"emailAddress": "kiril@mail.com"}
}'
```

Create a task for one-off execution at the given time

```bash
curl -X POST 'localhost:3000/api/tasks' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Send mail with cron",
    "scheduleType": "SCHEDULED_ONCE",
    "scheduledTime": "2022-06-15 17:41:00",
    "type": "MAIL",
    "params": {"emailAddress": "kiril@mail.com"}
}'
```

Create a task for recurring execution based on cron expression

```bash
curl -X POST 'https://ateam-sheduler.herokuapp.com/api/tasks' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Send mail with cron 2",
    "scheduleType": "SCHEDULED_CRON",
    "cronSchedule": "*/5    *    *    *    *    *",
    "type": "MAIL",
    "params": {"emailAddress": "maxx@mail.com"}
}'
```

Postman collection available [here](https://www.getpostman.com/collections/b4227dab72c85af49702)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# prod
$ npm run start

# development
$ npm run start:dev

```

## Test

```bash
# unit tests
$ npm run test
```
