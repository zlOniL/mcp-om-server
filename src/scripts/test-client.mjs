// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// const origin = "https://mcp-server-om.vercel.app/";

// async function main() {
//   const transport = new SSEClientTransport(new URL(`${origin}/sse`));

//   const client = new Client(
//     {
//       name: "example-client",
//       version: "1.0.0",
//     },
//     {
//       capabilities: {
//         prompts: {},
//         resources: {},
//         tools: {},
//       },
//     }
//   );

//   await client.connect(transport);

//   console.log("Connected", client.getServerCapabilities());

//   const result = await client.listTools();
//   console.log(result);

//   const tools = result.tools || [];

//    const tool = tools.find(t => t.name === "listaPedidosVenda");
//   if (!tool) {
//     console.log("Tool não encontrada.");
//     return;
//   }

//   if (tools.length > 0) {
//     const tool = tools[2]; // pega a primeira tool registrada
//     console.log(`⚙️ Testando tool: ${tool.name}`);

//     // Monte aqui os parâmetros que sua tool espera
//     // (ajuste conforme a estrutura do seu servidor MCP)
//     const params = {};

//     try {
//       const result = await client.callTool(tool.name, params);
//       console.log("🧪 Resultado da chamada:", result);
//     } catch (error) {
//       console.error("❌ Erro ao chamar a tool:", error);
//     }
//   } else {
//     console.log("Nenhuma tool registrada no servidor.");
//   }

//   process.exit(0);
// }

// main();






import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const origin = "https://mcp-server-om.vercel.app";

async function main() {
  const transport = new SSEClientTransport(new URL(`${origin}/sse`));

  const client = new Client(
    { name: "example-client", version: "1.0.0" },
    { capabilities: { prompts: {}, resources: {}, tools: {} } }
  );

  await client.connect(transport);
  console.log("✅ Conectado:", client.getServerCapabilities());

  const result = await client.listTools();
  console.log("🧰 Tools disponíveis:", result);

  const tools = result.tools || [];
  if (tools.length === 0) {
    console.log("Nenhuma tool registrada no servidor.");
    return;
  }

  // 🔹 Escolha qual tool testar
  const tool = tools.find(t => t.name === "listaPedidosVenda");
  if (!tool) {
    console.log("Tool não encontrada.");
    return;
  }

  console.log(`⚙️ Testando tool: ${tool.name}`);

  // 🔹 Aqui você define os parâmetros esperados pela tool
  // Verifique o inputSchema da tool para saber quais são obrigatórios
  const params = {
    // exemplo: idempresa: 1, mes: "2025-10"
  };

  try {
    const response = await client.callTool(tool.name, params);
    console.log("🧪 Resultado da chamada:");
    console.dir(response, { depth: null });
  } catch (error) {
    console.error("❌ Erro ao chamar cleaa tool:", error);
  } finally {
    process.exit(0);
  }
}

main().catch(console.error);
