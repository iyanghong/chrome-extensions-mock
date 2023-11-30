interface Task {
  id: number;
  callback: () => Promise<void>;
}

export default class TaskQueue {
  private tasks: Task[];
  private nextTaskId: number;
  private isRunning: boolean;

  constructor() {
    this.tasks = [];
    this.nextTaskId = 0;
    this.isRunning = false;
  }

  public async addTask(callback: () => Promise<void>): Promise<void> {
    const task: Task = {
      id: this.nextTaskId++,
      callback
    };

    this.tasks.push(task);

    if (!this.isRunning) {
      this.isRunning = true;
      await this.runTasks();
    }
  }

  public async runTasks(): Promise<void> {
    while (this.tasks.length > 0) {
      const task: Task = this.tasks[0];

      try {
        await task.callback();
      } catch (err) {
        console.error(`Task ${task.id} failed: ${err}`);
      } finally {
        this.tasks.shift();
      }
    }

    this.isRunning = false;
  }

  public clearTasks(): void {
    this.tasks = [];
  }
}
