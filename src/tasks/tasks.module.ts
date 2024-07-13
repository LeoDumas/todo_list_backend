import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { tasksController } from './tasks.controller';
import { tasksService } from './tasks.service';
import { Tasks, TasksSchema } from './schemas/tasks.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tasks.name, schema: TasksSchema }]),
  ],
  controllers: [tasksController],
  providers: [tasksService],
})
export class TasksModule {}
