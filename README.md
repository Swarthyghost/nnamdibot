# nnamdibot 🤖
> A Premium AI-powered Health & Wellness Assistant

nnamdibot is a highly responsive, state-of-the-art health companion powered by FastAPI on the backend and a premium glassmorphic vanilla JS frontend powered by Vite. The frontend features an interactive, animated SVG robot mascot that reacts dynamically in real-time to background API operations.

---

## 🎨 Premium Redesign Features

1. **Interactive SVG Robot Companion**:
   - **Idle/Floating**: Sinusoidal floating animation (`@keyframes float`).
   - **Blinking Screen**: Simulated blinking animation (`@keyframes blink`).
   - **Pulsing Health Heart**: High-contrast, glowing heartbeat visualization (`@keyframes pulseHeart`).
   - **Dynamic States**: Visor and eyes turn purple and pulse rapidly when waiting for background API responses to indicate the bot is actively thinking.

2. **Glassmorphic Grid Architecture**:
   - Clean double-column dashboard with semi-transparent frosted card elements (`backdrop-filter: blur(24px)`).
   - High-contrast text fields, sleek scrollbars, and vibrant ambient-glowing background particles.

3. **Responsive Off-Canvas Navigation**:
   - Adapts to all viewports.
   - Converts to a sliding mobile off-canvas drawer controlled via a header button and background overlay backdrop on mobile screens.

4. **Wellness Topic Suggestion Chips**:
   - Fully interactive prompt chips that populate the chat stream on click.

---

## 🚀 Running Locally

### 1. Start the FastAPI Backend
Ensure your `.env` contains:
```env
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4o
```
Run the server:
```bash
# Using the virtual environment
.venv/bin/uvicorn main:app --reload --port 8000
```
The backend server will run at `http://localhost:8000`.

### 2. Start the Vite Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## ☁️ Deploying to Vercel

The frontend is fully pre-configured for Vercel!

### Step-by-Step Vercel Deployment:
1. Push this repository to your **GitHub** account.
2. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New** ➜ **Project**.
3. Import your `nnamdibot` repository.
4. **Important**: Under **Configure Project**:
   - Change the **Root Directory** to `frontend`.
   - Vercel will automatically detect **Vite** as the framework and configure the build command (`npm run build`) and output directory (`dist`) automatically!
5. **Add Environment Variable**:
   - Add a new environment variable: `VITE_API_URL`.
   - Set the value to the production URL of your backend server (e.g., `https://your-backend.herokuapp.com` or render.com endpoint).
6. Click **Deploy**! 🚀
