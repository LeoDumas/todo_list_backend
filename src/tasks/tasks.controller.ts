import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { tasksService } from './tasks.service';
import { Tasks } from './schemas/tasks.schema';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Controller('tasks')
export class tasksController {
  constructor(private readonly tasksService: tasksService) {}

  @Get()
  async findAll(): Promise<Tasks[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Tasks> {
    return this.tasksService.findOne(id);
  }

  @Post()
  async create(@Body() createTaskDTO: CreateTaskDTO): Promise<Tasks> {
    return this.tasksService.create(createTaskDTO);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteOne(id);
  }

  @Put(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateTaskDTO: UpdateTaskDTO,
  ): Promise<Tasks> {
    return this.tasksService.updateOne(id, updateTaskDTO);
  }
}
