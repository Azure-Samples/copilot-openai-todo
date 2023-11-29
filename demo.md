# Demo scenario

## About

Flow
- Dave starts
- I go with the demo
- Dave takes over with the slides

* AI in intro
* I'm going to use Copilot

Time: 30min

Yohan, the newest addition to Contoso's AI team, brings a fresh perspective to the company's digital journey. His inaugural mission is both ambitious and exciting: to breathe new life into a legacy to-do app. Yohan aims to infuse this app with the power of Generative AI, making it more attuned to the needs of today's customers. While Yohan possesses some knowledge of OpenAI on Azure and CosmosDB, he's not yet an expert in these domains. To bridge the gap, he's placing his trust in GitHub Copilot, an innovative AI-driven coding companion.  

As he dives into the world of AI-infused applications, the suspense lingers—will Yohan succeed, and will Copilot be the ace up his sleeve? 

## Demo plan

### Preparation
- Open Codespaces on this repo: https://github.com/sinedied/copilot-openai-todo => `feat-gen-ai` branch
  * Use GH white theme
  * Close every VS code tab except README.md
  * Check that Copilot, Chat and REST client extension have loaded
- Open https://github.com/microsoft/TypeChat (then https://github.com/microsoft/TypeChat/blob/main/examples/sentiment/src/main.ts)
- Delete .azure folder if needed
- Do azd auth login --use-device-code

### Intro

- Explain the context:
  * I joined this new team working on modernizing a legacy app. Well, you all know how it is, right?
  * This app is nothing too fancy: it's a todo app. And I was asked to add some AI to it, as you've seen the trend lately.
  * The fun question is: what to use AI for? How can I reinvent a seemingly simple app with AI?
  * Well, I'm using a todo list everyday, and the boring part is well, entering tasks and breaking down a goal into these tasks. So what I want to do, is using Generative AI to work as a task planner that will create the tasks for me!

- First, I'll use Codespaces to have a ready-to-use dev environment.
  * You can use it either from your browser or from VS Code.
  * ! Show devcontainer.json and explain dev container configuration

- Copilot in VS Code comes in different forms and at different places, as you'll see along the demo.
  * Here, I'm using the Copilot chat extension, which is nowadays my preferred way to use Copilot to interact with my code.
  * I'll show you throughout this session that using Copilot works the same as when you're pair-programming with your colleague.

### Project insights

- ! I was told that this project was using JavaScript and Azure, but besides that, I don't know much about it. But hey let's just ask Copilot.

- @workspace what's the stack used in this project?
  * @workspace what's the stack of the server?

### Infrastructure

- main.bicep
  * ! I'm not an IT expert, so when I need to work on infrastructure I usually ask around for help.
  * ! select all in `main.bicep`
  * what azure services are used?

  * how can I avoid passing secrets key as env variables? => let's just ask Copilot!
  * how can I create a key vault in Bicep?

- prepare infrastructure => should I ask Copilot?
  * open README :)
  * azd auth login --use-device-code
  * azd provision
    * ai-todo
    * 34. west-europe

### Server side

Note: unless marked, everything is done with Copilot Chat

- app.ts
  * refactor require to use import => let's ask Copilot to do it for me

- create an OpenAiService class that:
  * use @azure/identity to retrieve Azure credentials
  * get openAI token from credentials

- fix the token scope to use Azure openAI
  * must be 'https://cognitiveservices.azure.com/.default'

! Story
* So now that I'm able to get a token, I can use it to call the OpenAI API.
* I've heard about this new lib TypeChat, that is supposed to help me with adding AI to my app without having to know much about AI.

- DO MANUALLY: create service/planner.ts
  * export class TaskPlannerService { }
  * use Copilot: static getInstance(): 
    => ! This is the regular Copilot experience, where it suggests a completion as you type.
  * complete instance method
  * add async init() method
    * // Initialize the OpenAI service
    * this.openAiService = await OpenAiService.getInstance();
  * fix with Copilot (change to async)
    * add aync manually  

! Go to TypeChat website and open examples/sentiment
  * Show schema and explain how it works

- DO MANUALLY: Create task-planner-schema.ts
  * export interface TaskPlanner {}
  * // This file defines the schema for splitting a target goal into tasks needed to achieve the goal.
  * // For example, if the goal is to "Plan a trip to Paris", the tasks could be:
  * // Tasks needed to be done to achieve the goal

! Explain the importance of context when using Copilot:
  * The open tabs
  * The clipboard
  * The current file

- Go back to planner.ts
  * ! I need to init Typechat, but it's too recent to have data for it, so let's help it a bit.
  * ! Copy paste code from example in the file and comment it
  * add
    * async planTasks(goal: string): Promise<TaskPlanner> {
  * // Get the OpenAI token
  * // Initr TypeChat
  *   OPENAI_API_KEY: openAiToken,
      OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
      OPENAI_MODEL: process.env.AZURE_OPENAI_CHATGPT_MODEL || "gpt-35-turbo",
  * complete
    * const schema =
    * const translator
    * const response = 
    * if (!response.success) {
    * return response.data

- ! Let's say I took some time to complete the routes to use the planner, here in the `root.ts` file:
  * explain a bit
  * complete:
    if (useAiPlanner) {
      const planner = await TaskPlannerService.getInstance();
      const plan = await planner.planTasks(task.title);
      const tasks = plan.tasks.map(task => ({
        title: task,
        userId,
        completed: false
      }));
      const createdTasks = [];
      for (const task of tasks) {
        await DbService.getInstance().createTask(task);
        createdTasks.push(task);
      }
      res.json(createdTasks);
  ! Seeing that code, using await in a loop is not a good idea, so let's fix that.
  * Optimize this code

### frontend side

! we're a bit short on time, so I did ask Dave to help me with the frontend part so let's have a look at what he did.

! I'm not much of a frontend guy, so let's ask Copilot to help me understand a bit of that Angular code.

- /explain angular bindings
 * what is $event?
 * is that code accessible?

### GitHub Actions

- create a github actions for a CI that runs my tests using Node 18
  * Can you make it so the tests run on Windows, Linux and Mac?

### Show final result

- `azd deploy`

- open browser and show deployed app











- Complete the route, open `root.ts` (skip it if not enough time)
  * grab body param: const { useAiPlanner } = req.body;
  * complete:
    if (useAiPlanner) {
      const planner = await TaskPlannerService.getInstance();
      const plan = await planner.planTasks(task.title);
      const tasks = plan.tasks.map(task => ({
        title: task,
        userId,
        completed: false
      }));
      const createdTasks = [];
      for (const task of tasks) {
        await DbService.getInstance().createTask(task);
        createdTasks.push(task);
      }
      res.json(createdTasks);
  ! But using await in a loop is not a good idea, so let's fix that.
  * Optimize this code

- Run the server and test the code
  * azd env get-values > .env
  * npm start

### frontend side

- /explain angular bindings
 * what is $event?
 * is that code accessible?

- Open task-add.component.ts
  * add a checkbox input to enable AI planner
    * I want it below the container and with a label
  * create toggleAiPlanner() method
    * this.enableAiPlanner = input.checked
  * add enableAiPlanner
  * complete AddTask model to add useAiPlanner
  * add useAiPlanner to addTask() method

- open app.component.ts
  * 

- Generate a commit message for my changes
  * use conventional commits

### GitHub Actions

- create a github actions for a CI that runs my tests using Node 18
  * Can you make it so the tests run on Windows, Linux and Mac?

### Show final result

- `azd deploy`

- open browser and show deployed app

- ! If extra time, show Copilot extras:
  - how can I create a new component with the angular CLI?
    * what if I don't want to create a new directory?
    * => send command to terminal

  - show how to translate db.ts to Python
    * convert to Python


