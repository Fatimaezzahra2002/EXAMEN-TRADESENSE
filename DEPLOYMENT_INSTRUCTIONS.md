# TradeSense AI - Deployment Instructions

This document explains how to deploy the TradeSense AI African Prop Trading Platform to live hosting services.

## Frontend Deployment (Vercel)

1. Go to [Vercel](https://vercel.com/)
2. Sign in and click "New Project"
3. Import your GitHub repository: `Fatimaezzahra2002/EXAMEN-TRADESENSE`
4. Vercel will automatically detect the React project
5. Add environment variables if needed
6. Click "Deploy"
7. Your frontend will be available at a URL like: `https://tradesense-ai.vercel.app`

## Backend Deployment (Railway)

1. Go to [Railway](https://railway.app/)
2. Sign in and click "New Project"
3. Connect to your GitHub repository: `Fatimaezzahra2002/EXAMEN-TRADESENSE`
4. Select the backend directory
5. Railway will automatically detect the Python/Flask project
6. Set up a MySQL database through Railway's infrastructure
7. Add environment variables:
   - DATABASE_URL: your MySQL connection string
8. Deploy the project
9. Your backend will be available at a URL like: `https://tradesense-api-production.railway.app`

## Database Setup (Railway)

When deploying to Railway, you can provision a MySQL database:

1. In your Railway project, go to "Infrastructure"
2. Click "New" and select "MySQL"
3. Link it to your backend service
4. The database connection will be available via environment variables

## Configuration

After deployment, update your frontend to point to the live backend:

In your frontend service (in the deployed environment), set the environment variable:
- REACT_APP_API_URL=https://your-backend-deployment-url.onrender.com/api

## Alternative Deployment (Render)

### Frontend on Render:
1. Go to [Render](https://render.com/)
2. Create a new "Static Site" service
3. Connect to your GitHub repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Your frontend will be deployed at a `.onrender.com` URL

### Backend on Render:
1. Create a new "Web Service"
2. Connect to your GitHub repository
3. Runtime: Python
4. Build command: `pip install -r requirements.txt`
5. Start command: `python backend/app.py`
6. Your backend will be deployed at a `.onrender.com` URL

## Live URLs

After deployment, you'll have:

- **Frontend**: Your React application (e.g., `https://tradesense-ai.vercel.app`)
- **Backend**: Your Python Flask API (e.g., `https://tradesense-api-production.railway.app`)

Make sure to update the frontend's API endpoints to point to your live backend URL.

## Environment Variables

Common environment variables needed:

### Frontend:
- REACT_APP_API_URL: Base URL for the backend API

### Backend:
- DATABASE_URL: Connection string for MySQL database
- PORT: Port number (provided by hosting service)