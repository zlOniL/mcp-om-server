import { createMcpHandler,  } from "@vercel/mcp-adapter";
import { z } from "zod";

const handler = createMcpHandler(
    (server) => {
        server.tool(
            "courseRecommender",
            "Get course recommendations based on user preferences",
            {
                experienceLevel: z.enum(["beginner", "intermediate"]),
            },
            ({ experienceLevel } ) => ({
                content: [
                    {
                        type: "text",
                        text: `I recommend you take the ${
                            experienceLevel === "beginner" 
                            ? "Intro to Programming" 
                            : "Advanced Algorithms"
                        } course.`,
                    }
                ]
            })
        )
    },
    {
        capabilities : {
            tools: {
                courseRecommender: {
                    description: "Get course recommendations based on user preferences",
                }
            },
        },
    },
    {
        redisUrl: process.env.REDIS_URL,
        sseEndpoint: '/sse',
        streamableHttpEndpoint: '/mcp',
        verboseLogs: true,
        maxDuration: 60,
    }
);

export { handler as GET, handler as POST };