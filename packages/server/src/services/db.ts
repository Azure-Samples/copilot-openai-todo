// Import Cosmos SDK and task model
import { Container, CosmosClient, Database } from "@azure/cosmos";
import { Task } from "../models/task";

/**
 * This class provides a service for interacting with the Cosmos DB database.
 * It is a singleton class, so only one instance of it will ever exist.
 * @class
 * @property {CosmosClient} client - The Cosmos DB client
 * @property {any} database - The database
 * @property {any} container - The container
 * @method createTask - Create a new task
 * @method getTask - Get a task by id
 * @method getTasks - Get all tasks for a user
 * @method updateTask - Update a task
 * @method deleteTask - Delete a task
 */
export class DbService {
  private client: CosmosClient;
  private database: Database;
  private container: Container;

  // The singleton instance
  private static instance: DbService;

  // Get the singleton instance
  public static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  constructor() {
    // Check that the environment variables are set
    if (!process.env.COSMOS_ENDPOINT) {
      throw new Error("COSMOS_ENDPOINT is not set");
    }
    if (!process.env.COSMOS_KEY) {
      throw new Error("COSMOS_KEY is not set");
    }

    // Connect to the database
    this.client = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT,
      key: process.env.COSMOS_KEY
    });
    this.database = this.client.database("todos");
    this.container = this.database.container("tasks");
  }

  // Create a new task
  async createTask(task: Task): Promise<Task | undefined> {
    // Create a new task in the database
    const { resource: createdItem } = await this.container.items.create(task);

    // Return the new task
    return createdItem;
  }

  // Get a task by id
  async getTask(id: string): Promise<Task> {
    // Get the task from the database
    const { resource: task } = await this.container.item(id).read();

    // Return the task
    return task;
  }

  // Get all tasks for a user
  async getTasks(userId: string): Promise<Task[]> {
    // Get the tasks from the database
    const { resources: tasks } = await this.container
      .items.query({
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [{ name: "@userId", value: userId }]
      })
      .fetchAll();

    // Return the tasks
    return tasks;
  }

  // Update a task
  async updateTask(task: Task): Promise<Task | undefined> {
    // Update the task in the database
    const { resource: updatedItem } = await this.container
      .item(task.id)
      .replace(task);

    // Return the updated task
    return updatedItem;
  }

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    // Delete the task from the database
    await this.container.item(id).delete();
  }
}