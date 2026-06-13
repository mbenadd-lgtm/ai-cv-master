import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  text: z.string().min(1).max(8000),
  section: z.enum(["summary", "experience", "general"]),
  market: z.enum(["Germany", "France", "Remote", "General"]).default("General"),
  jobDescription: z.string().max(8000).optional().default(""),
});

const marketGuidance: Record<string, string> = {
  Germany:
    "Use a formal, fact-driven German CV (Lebenslauf) tone. Prefer concise bullet points, quantifiable achievements, and conservative phrasing. Avoid hype words.",
  France:
    "Use a clean, slightly formal French CV tone. Emphasize education credentials and structured responsibility descriptions.",
  Remote:
    "Use a modern remote-first tone. Highlight async collaboration, autonomy, written communication, and measurable outcomes.",
  General:
    "Use a professional international tone with strong action verbs and measurable results.",
};

export const improveWithAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI not configured");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const { generateText } = await import("ai");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const system = `You are a senior career coach and CV editor. Rewrite the user's text to be sharper, more professional, ATS-friendly, and outcome-oriented.

Guidelines:
- ${marketGuidance[data.market]}
- Keep the same factual content; never invent jobs, dates, or metrics.
- For "experience" sections, return concise bullet points starting with strong action verbs. One bullet per line. No leading dashes.
- For "summary" sections, return a single tight paragraph (2-4 sentences).
- Plain text only. No markdown, no headings, no commentary.
${data.jobDescription ? `\nAlign keywords and emphasis with this job description when truthful:\n"""${data.jobDescription.slice(0, 4000)}"""` : ""}`;

    try {
      const { text } = await generateText({
        model,
        system,
        prompt: data.text,
      });
      return { text: text.trim() };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("429")) throw new Error("AI is busy. Please try again in a moment.");
      if (msg.includes("402")) throw new Error("AI credits exhausted. Add credits to continue.");
      throw new Error("AI request failed. Please try again.");
    }
  });
