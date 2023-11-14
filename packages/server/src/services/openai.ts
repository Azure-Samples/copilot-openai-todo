import { DefaultAzureCredential } from '@azure/identity';

export class OpenAiService {
  private credential: DefaultAzureCredential;

  constructor() {
    this.credential = new DefaultAzureCredential();
  }

  async getOpenAiToken() {
    const tokenCredential = await this.credential.getToken('https://cognitiveservices.azure.com/.default');
    return tokenCredential?.token;
  }
}
