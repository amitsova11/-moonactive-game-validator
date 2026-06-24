# Game Config Validator

A Next.js service that validates game configuration JSON with JSON Schema and provides balancing feedback from an LLM.

## Install And Run

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.local.example .env.local
```

If `.env.local.example` does not exist in your copy, create `.env.local` manually as described below.

3. Start the dev server:

```bash
npm run dev
```

4. Open the app:

http://localhost:3000

## Configure The LLM API Key

Create or edit `.env.local` in the project root and add:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Notes:
- Do not commit `.env.local`.
- Restart the dev server after changing environment variables.

## Example Commands To Test The Service

The API endpoint is:

`POST /api/config-validator`

### 1. Valid Configuration

```bash
curl -X POST http://localhost:3000/api/config-validator \
	-H "Content-Type: application/json" \
	-d '{
		"level": 1,
		"difficulty": "easy",
		"reward": 5000,
		"time_limit": 60
	}'
```

### 2. Invalid Configuration (Schema Error)

```bash
curl -X POST http://localhost:3000/api/config-validator \
	-H "Content-Type: application/json" \
	-d '{
		"level": 0,
		"difficulty": "easy",
		"reward": 100
	}'
```

### 3. Malformed JSON

```bash
curl -X POST http://localhost:3000/api/config-validator \
	-H "Content-Type: application/json" \
	-d '{"level":1, "difficulty":"easy"'
```
