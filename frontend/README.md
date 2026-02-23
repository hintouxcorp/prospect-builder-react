# Prospect Builder – Frontend

Interface web do sistema de prospecção comercial.

Aplicação desenvolvida com React + TypeScript utilizando Vite como ferramenta de build.

---

## 🚀 Tecnologias

- React
- TypeScript
- Vite
- Fetch
- React Router (se estiver usando)

---

## 🏗 Arquitetura

A aplicação consome a API REST desenvolvida em Django, mantendo separação completa entre frontend e backend.

Organização baseada em componentes reutilizáveis e separação entre camada de interface e camada de acesso à API.

---

## 📊 Funcionalidades

- Listagem de leads
- Filtro por status
- Dashboard analítico
- Visualização em mapa
- Integração com API REST

---

## 🔌 Integração com Backend

A aplicação consome endpoints da API:

https://github.com/hintouxcorp/prospect-builder-api

A URL base da API deve ser configurada em:

```
.env
```

Exemplo:

```
VITE_API_URL=http://localhost:8000
```

---

## ▶ Como Executar

### 1️⃣ Instalar dependências

```bash
npm install
```

### 2️⃣ Executar ambiente de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:5173
```

---

## 🔄 Roadmap

- Implementação de autenticação
- Proteção de rotas
- Otimização de performance
- Testes com Vitest
- Deploy em ambiente de produção