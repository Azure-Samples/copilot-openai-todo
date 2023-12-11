# 🤖 copilot-openai-todo

This project is an example Todo app implementation, that aims to showcase how to use [GitHub Copilot](https://copilot.github.com/) to build an AI-powered todo app using [Azure OpenAI](https://azure.microsoft.com/products/ai-services/openai-service) and [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/).

**The completed application is located in the [completed branch](https://github.com/Azure-Samples/copilot-openai-todo/tree/completed).**

## Prerequisites
- **Node.js v18+**
- **Docker v20+**
- **Azure account**. If you're new to Azure, [get an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=javascript-0000-yolasors) to get free Azure credits to get started.
- **Azure subscription with access enabled for the Azure OpenAI service**. You can request access with [this form](https://aka.ms/oaiapply).
  * Alternatively, you can use an [OpenAI API key](https://platform.openai.com/docs/api-reference/authentication) instead of the Azure OpenAI service.

You can use [GitHub Codespaces](https://github.com/features/codespaces) to work on this project directly from your browser: select the **Code** button, then the **Codespaces** tab and click on **Create Codespaces on main**.

You can also use the [Dev Containers extension for VS Code](https://aka.ms/vscode/ext/devcontainer) to work locally using a ready-to-use dev environment.

After you cloned or opened the project in your dev environment, run the following command to install the dependencies:

```bash
npm install
```

## Project details

This project is structured as monorepo and makes use of [NPM Workspaces](https://docs.npmjs.com/cli/using-npm/workspaces). It's organized as follows:

```sh
.devcontainer/    # Dev container configuration
.github/          # GitHub Actions CI/CD pipeline
packages/         # The different parts of our app
|- server/        # The Express server, hosting the API and the website
+- client/        # The website client
package.json      # NPM workspace configuration
```

## How to build the project

```bash
npm run build
```

This command will build the client and server packages.

## How to setup deployment

To provision the resources on Azure and deploy the services, we use the [Azure Dev CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/).

```bash
# Only needed once
azd auth login --use-device-code

# Provision and deploy infrastructure
azd up
```

You can also provision and deploy the infrastructure separately:

```bash
# Provision infrastructure
azd provision

# Deploy infrastructure
azd deploy
```

## How to run locally

In order to run the application locally, you'll need to setup the following environment variables in a `.env` file at the root of the project with the following content:

```sh
AZURE_OPENAI_ENDPOINT=<your Azure OpenAI endpoint>
AZURE_COSMOS_DB_ENDPOINT=<your Azure Cosmos DB endpoint>
```

As the application rely on Azure services for the OpenAI completions and Cosmos DB storage, you'll need to provision these resources on Azure first (see [How to setup deployment](#how-to-setup-deployment)).

Then, run the following commands to generate your `.env` file:
```bash
azd env get-values > .env
```

Once your `.env` file is ready, you can start the application by running the following command at the root of the project:

```bash
npm run start
```

This will run both the client and server:
- The client will be available at http://localhost:4200.
- The server will be available at http://localhost:3000.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
