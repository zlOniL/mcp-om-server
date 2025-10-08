// vou consumir a API do Open Manager para listar os produtos. endpoint da API é api.openmanager.com.br/listarPedidosVenda
// preciso passar no header o token de autenticação de chave empresaToken
// preciso que seja utilizado o axios para consumir a API
// preciso que seja utilizado o zod para validar os dados da resposta da API
// depois preciso integrar essa função com o MCP Server que está em src/app/[transport]/route.ts

import axios from 'axios';
import { z } from 'zod';

// const productListSchema = z.object({
//     id: z.number(),
//     name: z.string(),
//     price: z.number(),
// });

export const productList = async () => {
    const response = await axios.get('https://api.openmanager.com.br/listarPedidoVenda/1796204', {
        headers: {
            'empresaToken': "17dd41eb-05ae-4954-8c96-00cc449a5ab6"
        }
    });
    return response.data;
}