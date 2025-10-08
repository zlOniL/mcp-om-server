import { createMcpHandler,  } from "@vercel/mcp-adapter";
import { z } from "zod";
import { productList } from "../modules/listas/productList";

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
        ),
        server.tool(
            "vendasMes",
            "Retorna as vendas do mês",
            {
                experienceLevel: z.enum(["Setembro", "Outubro"]),
            },
            ({ experienceLevel } ) => ({
                content: [
                    {
                        type: "text",
                        text: `I recommend you take the ${
                            experienceLevel === "Setembro" 
                            ? "R$ 100.000,00" 
                            : "R$ 150.000,00"
                        } course.`,
                    }
                ]
            })
        ),
        server.tool(
            "listaPedidosVenda",
            "Retorna a lista de pedidos de venda da empresa",
            {},
            async () => {
                const data = await productList();
                return {
                content: [
                    {
                    type: "text",
                    text: JSON.stringify(data),
                    }
                ]
                };
            }
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