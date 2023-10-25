# 🤖 copilot-openai-todo

TODO

## Prerequisites
- Node.js v18+
- An Azure account ([sign up for free here](https://azure.microsoft.com/free/?WT.mc_id=javascript-0000-yolasors))

You can use [GitHub Codespaces](https://github.com/features/codespaces) to work on this project directly from your browser: select the **Code** button, then the **Codespaces** tab and click on **Create Codespaces on main**.

You can also use the [Dev Containers extension for VS Code](https://aka.ms/vscode/ext/devcontainer) to work locally using a ready-to-use dev environment.

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

```bash
./setup.sh
```

This command will ask you to log in into Azure and GitHub, then set up the `AZURE_CREDENTIALS` repository secrets for deployment.

## How to run locally

```bash
npm install
npm run dev
```

The application will then be available at http://localhost:4200.

> **Important note**: you need to set the environment variables `COSMOS_ENDPOINT` and `COSMOS_KEY` to a valid [Azure Cosmos DB](https://azure.microsoft.com/products/cosmos-db?WT.mc_id=javascript-0000-yolasors) instance for the server to work. You can use the [Try Cosmos](https://cosmos.azure.com/try/) website to get one for testing without the need to deploy one yourself (choose *Azure Cosmos DB for NoSQL*).

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
