import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Tasks } from './schemas/tasks.schema';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Req() req): Promise<Tasks[]> {
    return this.tasksService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req): Promise<Tasks> {
    return this.tasksService.findOne(id, req.user.userId);
  }

  @Post()
  async create(
    @Body() createTaskDTO: CreateTaskDTO,
    @Req() req,
  ): Promise<Tasks> {
    return this.tasksService.create(createTaskDTO, req.user.userId);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string, @Req() req): Promise<void> {
    return this.tasksService.deleteOne(id, req.user.userId);
  }

  @Put(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateTaskDTO: UpdateTaskDTO,
    @Req() req,
  ): Promise<Tasks> {
    return this.tasksService.updateOne(id, updateTaskDTO, req.user.userId);
  }
}
