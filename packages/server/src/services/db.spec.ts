import { DbService } from './db';

jest.mock('@azure/cosmos');

describe('DbService', () => {
  beforeAll(() => {
    // Set environment variables
    process.env.COSMOS_ENDPOINT = 'dummy';
    process.env.COSMOS_KEY = '123';

    // Mock the Cosmos DB client
    const mockClient = {
      database: () => ({
        container: () => ({
          items: {
            create: () => ({
              resource: {
                id: '123',
                userId: '123',
                title: 'test',
                completed: false
              }
            }),
            query: () => ({
              fetchAll: () => ({
                resources: []
              })
            }),
          },
          item: () => ({
            read: () => ({
              resource: {
                id: '123',
                userId: '123',
                title: 'test',
                completed: false
              }
            }),
            replace: () => ({
              resource: {
                id: '123',
                userId: '123',
                title: 'test',
                completed: true
              }
            }),
            delete: () => ({})
          }),
        })
      })
    };
    const CosmosClient = require('@azure/cosmos').CosmosClient;
    CosmosClient.mockImplementation(() => mockClient);
  });

  it('should get all tasks for a user', async () => {
    const dbService = new DbService();
    const tasks = await dbService.getTasks('123');
    expect(tasks).toEqual([]);
  });

  it('should create a new task', async () => {
    const dbService = new DbService();
    const task = await dbService.createTask({
      id: '123',
      userId: '123',
      title: 'test',
      completed: false
    });
    expect(task).toEqual({
      id: '123',
      userId: '123',
      title: 'test',
      completed: false
    });
  });

  it('should get a task by id', async () => {
    const dbService = new DbService();
    const task = await dbService.getTask('123');
    expect(task).toEqual({
      id: '123',
      userId: '123',
      title: 'test',
      completed: false
    });
  });

  it('should update a task', async () => {
    const dbService = new DbService();
    const task = await dbService.updateTask({
      id: '123',
      userId: '123',
      title: 'test',
      completed: true
    });
    expect(task).toEqual({
      id: '123',
      userId: '123',
      title: 'test',
      completed: true
    });
  });

  it('should delete a task', async () => {
    const dbService = new DbService();
    const task = await dbService.deleteTask('123');
    expect(task).toEqual(undefined);
  });

});
