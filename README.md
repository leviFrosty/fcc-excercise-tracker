# [fcc-exercise-tracker](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/exercise-tracker)

Personal project for practicing REST API & SQLite DB design.

## Setup

Copy environment variables

```bash
cp .env.example .env
```

Install dependencies:

```bash
bun install
```

Generate local DB environment

```bash
bun db:push

bun db:generate
```

Run API:

```bash
bun dev
```

Run Drizzle Studio (view DB):

```bash
bun db:dev
```
