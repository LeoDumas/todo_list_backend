// Only available option for "status"
enum TaskStatus {
  TODO = 'to do',
  IN_PROGRESS = 'in progress',
  DONE = 'done',
}

export class CreateTaskDTO {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  responsible: string;
  status: TaskStatus;
}
