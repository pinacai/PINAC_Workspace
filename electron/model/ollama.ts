import ollama from "ollama";

const askLocalLLM = async (
  llm: string,
  userQuery: string,
  imagePath: string | null
) => {
  try {
    const response = await ollama.chat({
      model: llm,
      messages: [
        {
          role: "user",
          content: userQuery,
          images: imagePath ? [imagePath] : [],
        },
      ],
    });
    return {
      error_occurred: false,
      response: { type: "others", content: response.message.content },
      error: null,
    };
  } catch (error) {
    return {
      error_occurred: true,
      response: null,
      error: error,
    };
  }
};

export default askLocalLLM;
