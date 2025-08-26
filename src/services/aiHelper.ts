import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const askAI = async (question: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [
        {
          role: "system",
          content:
            "أنت مساعد ذكي لمنصة تعليمية اسمها إدراك بلس. اشرح المواضيع البرمجية أو التعليمية بشكل بسيط ومختصر وباللغة العربية.",
        },
        { role: "user", content: question },
      ],
    });

    return response.choices[0].message.content || "لم يتم العثور على رد.";
  } catch (error: any) {
    console.error("AI Error:", error?.response?.data || error.message || error);
    return "حدث خطأ أثناء الاتصال بالمساعد الذكي.";
  }
};
