import { GoogleGenAI } from "@google/genai";

const key = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: key,
});
let chat;

export const fetchModelResponse = async (message) => {
  let result = await chat.sendMessage({
    message: message,
  });
  // console.log(result.text);

  return result.text;
};

export const initializeChat = async (previouschats) => {
  let chathistory = [];

  if (previouschats) {
    previouschats.forEach((chat) => {
      chathistory.push({
        role: chat.role,
        parts: [
          {
            text: chat.message,
          },
        ],
      });
    });
  }

  chat = ai.chats.create({
    model: "gemini-1.5-flash",
    history: chathistory,
  });
};
