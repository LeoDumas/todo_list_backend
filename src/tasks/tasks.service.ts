import { Model } from 'mongoose';
import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tasks } from './schemas/tasks.schema';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Injectable()
export class TasksService implements OnModuleInit {
  constructor(@InjectModel(Tasks.name) private tasksModel: Model<Tasks>) {}

  // This method runs once the module has been initialized to make sure that the collection exists
  async onModuleInit() {
    await this.ensureCollectionExists();
  }

  // Create a task
  async create(createTaskDTO: CreateTaskDTO, userId: string): Promise<Tasks> {
    const createTask = new this.tasksModel({
      ...createTaskDTO,
      responsible: userId,
    });
    return createTask.save();
  }

  // Make sure that the collection exists to avoid error if database is changed
  private async ensureCollectionExists() {
    const collections = await this.tasksModel.db.db.listCollections().toArray();
    const collectionExists = collections.some((col) => col.name === 'tasks');
    if (!collectionExists) {
      await this.tasksModel.db.db.createCollection('tasks');
      console.log('Collection "tasks" successfully created.');
    }
  }

  // Return all tasks for the user
  async findAll(userId: string): Promise<Tasks[]> {
    return this.tasksModel.find({ responsible: userId }).exec();
  }

  // Return a single task based on its id and userId
  async findOne(id: string, userId: string): Promise<Tasks> {
    const task = await this.tasksModel
      .findOne({ _id: id, responsible: userId })
      .exec();
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  // Delete a task with id and userId
  async deleteOne(id: string, userId: string): Promise<void> {
    const result = await this.tasksModel
      .deleteOne({ _id: id, responsible: userId })
      .exec();
    // If nothing is deleted send error
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  // Edit one task
  async updateOne(
    id: string,
    updateTaskDTO: UpdateTaskDTO,
    userId: string,
  ): Promise<Tasks> {
    const updatedTask = await this.tasksModel
      .findOneAndUpdate({ _id: id, responsible: userId }, updateTaskDTO, {
        new: true,
      })
      .exec();
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return updatedTask;
  }
}
