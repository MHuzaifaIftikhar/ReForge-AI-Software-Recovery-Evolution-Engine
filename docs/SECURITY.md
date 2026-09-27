# ReForge — Security & Safety Model

## 1. Zero Arbitrary Code Execution
- ReForge does not automatically execute unvetted code uploaded by external users.
- Live test execution is strictly restricted to controlled workspaces (`demo/legacy-shop` and `demo/modernized-shop`).
- Subprocess runners operate with explicit execution timeouts (10 seconds) to prevent infinite loops.

## 2. API Key Isolation
- All LLM API keys (`GEMINI_API_KEY`, `LLM_API_KEY`, `OPENAI_API_KEY`) remain strictly on the backend and are never exposed to client bundles.
- If no API key is provided, ReForge operates in deterministic offline reasoning mode with 100% functionality.

## 3. Human Approval Gates
- ReForge enforces a blocking gate before applying modifications to legacy code.
- High-impact changes (such as preserving or deprecating legacy retry loops) require explicit human sign-off.
- All decisions are recorded immutably in `data/institutional_memory.json`.
