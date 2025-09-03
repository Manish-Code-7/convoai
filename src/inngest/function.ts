import JSONL from "jsonl-parse-stringify";
import { inngest } from "@/inngest/client";
import { StreamTrascriptItem } from "@/modules/meetings/types";
import { db } from "@/db";
import { agents, user } from "@/db/schema";
import { inArray } from "drizzle-orm";

type TranscriptWithSpeaker = StreamTrascriptItem & {
  speaker: {
    type: string;
    id: string;
    name: string;
  };
};

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },

  async ({ event, step }) => {
    // 1. Fetch transcript
    const response = await step.fetch(event.data.transcriptUrl);

    // 2. Parse transcript JSONL
    const transcript = await step.run("parse-transcript", async () => {
      const text = await response.text();
      return JSONL.parse<StreamTrascriptItem[]>(text);
    });

    // 3. Add speaker info with fallback
    const transcriptWithSpeakers = await step.run(
      "add-speakers",
      async (): Promise<TranscriptWithSpeaker[]> => {
        const speakerIds = Array.from(new Set(transcript.map((i) => i.speaker_id)));

        const userSpeakers = await db
          .select()
          .from(user)
          .where(inArray(user.id, speakerIds))
          .then((users) =>
            users.map((u) => ({
              type: "user",
              id: u.id,
              name: u.name || "Unknown User"
            }))
          );

        const agentSpeakers = await db
          .select()
          .from(agents)
          .where(inArray(agents.id, speakerIds))
          .then((agents) =>
            agents.map((a) => ({
              type: "agent",
              id: a.id,
              name: a.name || "Unknown Agent"
            }))
          );

        const speakers = [...userSpeakers, ...agentSpeakers];

        return transcript.map((item) => {
          const matchedSpeaker = speakers.find((s) => s.id === item.speaker_id);

          return {
            ...item,
            speaker:
              matchedSpeaker || {
                type: "unknown",
                id: item.speaker_id,
                name: `Speaker ${item.speaker_id.slice(0, 5)}`
              }
          } as TranscriptWithSpeaker; // ✅ Casting here fixes TS error
        });
      }
    );

    // 4. Return enriched transcript
    return { transcript: transcriptWithSpeakers };
  }
);
