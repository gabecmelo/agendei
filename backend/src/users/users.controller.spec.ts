import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('Deve ser definido e criar um novo usuário', async () => {
      expect(usersController).toBeDefined();

      const createUserDto: CreateUserDto = {
        name: 'Gabriel',
        email: 'gabriel@example.com',
        password: 'senha123',
      };

      const result = { id: '1', ...createUserDto, created_events: [], invites: [] };

      jest.spyOn(usersService, 'createUser').mockResolvedValue(result);

      expect(await usersController.register(createUserDto)).toEqual(result);
      expect(usersService.createUser).toHaveBeenCalledWith(
        createUserDto.name,
        createUserDto.email,
        createUserDto.password,
      );
    });
  });
});
