# Deploying Your MERN Portfolio to Render.com

Your entire application architecture has been rigorously refactored to support a single-instance Web Service deployment on Render!

### What I Changed to Prepare for Production:
1. **Root `package.json`**: Render looks at the root folder to know how to install and build. I created a custom root `package.json` that commands Render to install both backend and frontend, and securely build the React app.
2. **Express Static Serving**: Your Node.js backend (`server.js`) is now programmed to hijack root traffic and statically serve your optimized React `dist` folder when running in production.
3. **Frontend Routing Fixes**: I've stripped all hardcoded `http://localhost:5000` strings out of the React components and replaced them with robust relative paths.

---

### Step-by-Step Deployment Instructions

**Step 1. Push Code to GitHub**
Open your terminal and run these commands to push the freshly modified codebase:
```bash
git add .
git commit -m "Production ready configurations for Render deployment"
git push origin main
```

**Step 2. Connect to Render.com**
1. Log into your [Render dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Connect the GitHub repository holding this portfolio.

**Step 3. Configure the Deployment Settings**
Fill out the exact values below:
- **Name:** `uday-portfolio` (or whatever you prefer)
- **Environment:** `Node`
- **Build Command:** `npm run build` *(This triggers the root script I just created)*
- **Start Command:** `npm start` *(This boots your Express server)*
- **Instance Type:** Free

**Step 4. Lock in Environment Variables**
Scroll down and click **Advanced** -> **Add Environment Variable**. You MUST add these for the app to function securely in production:
| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | *(Your MongoDB Atlas Database URL)* |
| `JWT_SECRET` | *(Create a random secure string. e.g. `uday1234secret`)* |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `admin123` |

**Step 5. Deploy**
Click **Create Web Service** at the bottom. 

Render will automatically pull your code, install all dependencies for both folders, pack the Vite app, and spin up your backend. In 2-3 minutes, your professional portfolio will be perfectly live on the internet!
