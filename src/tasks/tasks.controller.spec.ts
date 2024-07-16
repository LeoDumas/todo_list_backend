import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TaskStatus } from './dto/create-task.dto';
import { v4 as uuidv4 } from 'uuid'; // Generate UUID like in the database

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: jest.Mocked<TasksService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            updateOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(
      TasksService,
    ) as jest.Mocked<TasksService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call tasksService.findAll with the correct parameters', async () => {
      const userId = uuidv4();
      const req = { user: { userId } };
      await controller.findAll(req);
      expect(tasksService.findAll).toHaveBeenCalledWith(userId);
    });

    it('should handle errors gracefully', async () => {
      const userId = uuidv4();
      const req = { user: { userId } };
      tasksService.findAll.mockRejectedValue(new Error('Service error'));
      await expect(controller.findAll(req)).rejects.toThrow('Service error');
    });
  });

  describe('findOne', () => {
    it('should call tasksService.findOne with the correct parameters', async () => {
      const userId = uuidv4();
      const id = uuidv4();
      const req = { user: { userId } };
      await controller.findOne(id, req);
      expect(tasksService.findOne).toHaveBeenCalledWith(id, userId);
    });

    it('should handle errors gracefully', async () => {
      const userId = uuidv4();
      const id = uuidv4();
      const req = { user: { userId } };
      tasksService.findOne.mockRejectedValue(new Error('Service error'));
      await expect(controller.findOne(id, req)).rejects.toThrow(
        'Service error',
      );
    });
  });

  describe('create', () => {
    it('should call tasksService.create with the correct parameters', async () => {
      const userId = uuidv4();
      const req = { user: { userId } };
      const createTaskDTO: CreateTaskDTO = {
        title: 'test task',
        description: 'test description',
        startDate: new Date(),
        endDate: new Date(),
        duration: 120,
        responsible: 'testUser',
        status: TaskStatus.TODO,
      };
      await controller.create(createTaskDTO, req);
      expect(tasksService.create).toHaveBeenCalledWith(createTaskDTO, userId);
    });

    it('should handle errors gracefully', async () => {
      const userId = uuidv4();
      const req = { user: { userId } };
      const createTaskDTO: CreateTaskDTO = {
        title: 'test task',
        description: 'test description',
        startDate: new Date(),
        endDate: new Date(),
        duration: 120,
        responsible: 'testUser',
        status: TaskStatus.TODO,
      };
      tasksService.create.mockRejectedValue(new Error('Service error'));
      await expect(controller.create(createTaskDTO, req)).rejects.toThrow(
        'Service error',
      );
    });
  });

  describe('deleteOne', () => {
    it('should call tasksService.deleteOne with the correct parameters', async () => {
      const userId = uuidv4();
      const id = uuidv4();
      const req = { user: { userId } };
      await controller.deleteOne(id, req);
      expect(tasksService.deleteOne).toHaveBeenCalledWith(id, userId);
    });

    it('should handle errors gracefully', async () => {
      const userId = uuidv4();
      const id = uuidv4();
      const req = { user: { userId } };
      tasksService.deleteOne.mockRejectedValue(new Error('Service error'));
      await expect(controller.deleteOne(id, req)).rejects.toThrow(
        'Service error',
      );
    });
  });

  describe('updateOne', () => {
    it('should call tasksService.updateOne with the correct parameters', async () => {
      const userId = uuidv4();
      const id = uuidv4();
      const req = { user: { userId } };
      const updateTaskDTO: UpdateTaskDTO = {
        title: 'updated task',
        description: 'updated description',
        startDate: new Date(),
        endDate: new Date(),
        duration: 150,
        responsible: 'testUser',
        status: TaskStatus.IN_PROGRESS,
      };
      await controller.updateOne(id, updateTaskDTO, req);
      expect(tasksService.updateOne).toHaveBeenCalledWith(
        id,
        updateTaskDTO,
        userId,
      );
    });

    it('should handle errors gracefully', async () => {
      const userId = uuidv4();
      const id = uuidv4();
      const req = { user: { userId } };
      const updateTaskDTO: UpdateTaskDTO = {
        title: 'updated task',
        description: 'updated description',
        startDate: new Date(),
        endDate: new Date(),
        duration: 150,
        responsible: 'testUser',
        status: TaskStatus.IN_PROGRESS,
      };
      tasksService.updateOne.mockRejectedValue(new Error('Service error'));
      await expect(
        controller.updateOne(id, updateTaskDTO, req),
      ).rejects.toThrow('Service error');
    });
  });
});
