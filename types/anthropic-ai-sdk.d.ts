declare module "@anthropic-ai/sdk" {
  type MessageCreateInput = {
    model: string;
    max_tokens: number;
    messages: Array<{
      role: "user";
      content: string;
    }>;
  };

  type MessageCreateResult = {
    content: Array<{
      type: string;
      text?: string;
    }>;
  };

  export default class Anthropic {
    messages: {
      create(input: MessageCreateInput): Promise<MessageCreateResult>;
    };
  }
}
