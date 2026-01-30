# Sistema Monolítico Modular

## Objetivos
- Praticar comunicação entre módulos usando **facade**

## Princípios e Diretrizes
- Uso de facades
- Clean architecture
- Design patterns de DDD

## Projeto
- **codestore**: implementação de módulos/contextos do domínio de um ecommerce

## Módulos
- product-adm: administração de produtos
- store-catalog: exibição de produtos
- client-adm: administração de clientes
- payment: processar pagamento
- invoice: geração de nota fiscal
- checkout: criação da ordem

## Quantidade total de testes
Número total de testes: 37

## Como Executar o Projeto

1. Instale o [Node.js](https://nodejs.org/)
2. Execute o comando:
   ```
   npm i
   ```

## Comandos úteis

```
teste
npm run test

migration
  criar migration
    npm run migrate -- create --name create-invoice.ts
```

## endpoints http disponiveis
```
/clients
/products
/invoices
/checkout
```