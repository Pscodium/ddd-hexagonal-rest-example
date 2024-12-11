# API utilizando uma mescla das arquiteturas Hexagonal (Ports and Adapters) e DDD (Driven Domain Design)

## Objetivo
- Criar um projeto modelo, podendo ser utilizado como template para futuros projetos
- Implementar padrões da arquitetura hexagonal e ddd para fim de conhecimento
- Adicionar Injeção de Dependências

## Requisitos Técnicos
- Utilizar Tsyringe para Injeção de dependências
- Criar adapter para uso de Sequelize
- Criar tabela "User" no banco de dados
- Adicionar rota de criação de usuário

## Tecnologias
- Adapters
    - ORM: Sequelize e Prisma
    - Fetch: FetchApi e Axios
    - DB: MySQL, Mongo e Postgres
- Linguagem: Typescript
- Arquitetura: Hexagonal/DDD
- Design Pattern: Repository

## Possíveis Alterações futuras
- Adicionar RabbitMQ para a criação de filas de mensagem com protocolo AMQP
- Adicionar ElasticSearch e S3
