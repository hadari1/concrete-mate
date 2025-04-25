import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = "asst_7BM6YZqtqL890P36PUJjHHpSn";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  try {
    const thread = await openai.beta.threads.create();

    for (const message of messages) {
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: message,
      });
    }

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (runStatus.status !== "completed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messagesResponse = await openai.beta.threads.messages.list(thread.id);

    res.status(200).json({
      output: messagesResponse.data[0].content[0].text.value,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
}