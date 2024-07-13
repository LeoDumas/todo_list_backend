import { Model } from 'mongoose';
import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tasks } from './schemas/tasks.schema';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Injectable()
export class tasksService implements OnModuleInit {
  constructor(@InjectModel(Tasks.name) private tasksModel: Model<Tasks>) {}

  // This method runs once the module has been initialized to make sure that the collection exists
  async onModuleInit() {
    await this.ensureCollectionExists();
  }

  // Create a task
  async create(CreateTaskDTO: CreateTaskDTO): Promise<Tasks> {
    const CreateTask = new this.tasksModel(CreateTaskDTO);
    return CreateTask.save();
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

  // Return all tasks front database
  async findAll(): Promise<Tasks[]> {
    return this.tasksModel.find().exec();
  }

  // Return a single task based on its id
  async findOne(id: string): Promise<Tasks> {
    const task = await this.tasksModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  // Delete a task with id
  async deleteOne(id: string): Promise<void> {
    const result = await this.tasksModel.deleteOne({ _id: id }).exec();
    // If nothing is deleted send error
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  // Edit one task
  async updateOne(id: string, updateTaskDTO: UpdateTaskDTO): Promise<Tasks> {
    const updatedTask = await this.tasksModel
      .findByIdAndUpdate(id, updateTaskDTO, { new: true })
      .exec();
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return updatedTask;
  }
}
