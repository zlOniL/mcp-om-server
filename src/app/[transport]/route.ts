import { NextResponse } from "next/server"
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
                try {
                    const data = await productList();
                    console.log("Dados da lista de pedidos de venda:", data);
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(data),
                            }
                        ]
                    };
                } catch (error: any) {
                    console.error("Erro ao buscar lista de pedidos de venda:", error);
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Erro ao buscar lista de pedidos de venda: ${error.message || error}`,
                            }
                        ]
                    };
                }
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

// Wrapper para adicionar CORS headers
const withCORS = (handler: any) => async (request: Request) => {
    // Headers CORS
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: corsHeaders,
        });
    }

    // Execute o handler original
    const response = await handler(request);

    // Adiciona headers CORS na resposta
    Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
};

export const GET = withCORS(handler);
export const POST = withCORS(handler);
export const OPTIONS = async () => {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        },
    });
};