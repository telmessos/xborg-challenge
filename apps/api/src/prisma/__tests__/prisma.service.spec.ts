import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    configService = { get: jest.fn().mockReturnValue('test-database-url') } as any;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('should initialize with the correct database url', () => {
    expect(configService.get).toHaveBeenCalledWith('DATABASE_URL');
  });

  it('should call $connect on onModuleInit', async () => {
    prismaService.$connect = jest.fn();
    await prismaService.onModuleInit();
    expect(prismaService.$connect).toHaveBeenCalled();
  });

  it('should register shutdown hook', async () => {
    const app = { close: jest.fn() } as any;
    (prismaService.$on as any) = jest.fn((event, cb) => {
      if (event === 'beforeExit') cb();
    });
    await prismaService.enableShutdownHooks(app);
    expect(prismaService.$on).toHaveBeenCalledWith('beforeExit', expect.any(Function));
    expect(app.close).toHaveBeenCalled();
  });
}); 