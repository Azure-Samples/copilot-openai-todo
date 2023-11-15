import fs from "fs";
import path from "path";
import { createJsonTranslator, createLanguageModel } from "typechat";
import { TaskPlanner } from "../models/task-planner-schema";
import { OpenAiService } from "./openai";

export class TaskPlannerService {
  private static instance: TaskPlannerService;
  openAiService!: OpenAiService;

  static async getInstance(): Promise<TaskPlannerService> {
    if (!TaskPlannerService.instance) {
      TaskPlannerService.instance = new TaskPlannerService();
      await TaskPlannerService.instance.init();
    }
    return TaskPlannerService.instance;
  }

  private async init() {
    // Initialize the OpenAI service
    this.openAiService = new OpenAiService();
  }

  async planTasks(goal: string): Promise<TaskPlanner> {
    // Get the OpenAI token
    const openAiToken = await this.openAiService.getOpenAiToken();

    // Init TypeChat
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const model = createLanguageModel({
      OPENAI_API_KEY: openAiToken,
      OPENAI_ENDPOINT: endpoint,
      OPENAI_MODEL: process.env.AZURE_OPENAI_CHATGPT_MODEL || "gpt-35-turbo",
    });

    const schema = fs.readFileSync(path.join(__dirname, "../models/task-planner-schema.ts"), "utf8");
    const translator = createJsonTranslator<TaskPlanner>(model, schema, "TaskPlanner");

    // Get the plan
    const response = await translator.translate(goal);
    if (!response.success) {
      throw new Error(response.message);
    }

    console.log(response.data);

    return response.data;
  }
}
