<!-- Section from: c:\Users\Sahil\Desktop\TechM\README.md | Lines: 68-89 -->

## Running Locally

### 1. Start Local LLM (llama.cpp)
Run your llama.cpp server on port `9931`:
```bash
curl http://127.0.0.1:9931/v1/chat/completions -H "Content-Type: application/json" -d "{\"model\":\"Qwen/Qwen2.5-3B-Instruct-GGUF:Q4_K_M\",\"messages\":[{\"role\":\"user\",\"content\":\"Hi\"}]}"
```

### 2. Start FastAPI Backend
```powershell
cd backend
.\venv\Scripts\python.exe run.py
```
- API Docs: `http://localhost:8000/docs`

### 3. Start Next.js Frontend
```powershell
cd frontend
npm run dev
```
- App: `http://localhost:3000`
