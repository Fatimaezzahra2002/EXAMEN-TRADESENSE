# TradeSense AI - Setup Guide

This guide explains how to set up and run the TradeSense AI African Prop Trading Platform on your local machine.

## Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- MySQL Server
- Git

## Repository Structure

```
examen tradesense/
├── backend/                 # Python Flask server
│   ├── app.py               # Main backend application
│   ├── requirements.txt     # Python dependencies
│   └── ...
├── components/              # Reusable UI components
├── context/                 # React context providers
├── db/                      # Database schema and scripts
│   └── schema.sql           # Database schema
├── i18n/                    # Internationalization files
├── pages/                   # Application pages
├── services/                # API service functions
├── styles/                  # CSS and styling
├── models/                  # Data models
├── package.json             # Node.js dependencies
├── README.md                # Project documentation
├── SETUP_GUIDE.md           # This file
└── INIT_GIT.bat             # Git initialization script
```

## Frontend Setup (React/TypeScript)

1. Navigate to the project directory:
   ```bash
   cd examen tradesense
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to `http://localhost:3000`

## Backend Setup (Python Flask)

1. Navigate to the backend directory:
   ```bash
   cd examen tradesense/backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your MySQL database:
   - Create a new database
   - Execute the schema from `db/schema.sql` to create tables

4. Update the database connection settings in `app.py` if needed

5. Start the backend server:
   ```bash
   python app.py
   ```

6. The backend will run on `http://localhost:5000`

## Database Setup

1. Install and start MySQL server

2. Create a new database:
   ```sql
   CREATE DATABASE tradesense_ai;
   ```

3. Execute the schema file to create tables:
   ```bash
   mysql -u username -p tradesense_ai < db/schema.sql
   ```

4. Update the database connection string in your backend configuration

## Running the Application

1. Start the backend server first (on port 5000)
2. Start the frontend server (on port 3000)
3. Access the application at `http://localhost:3000`

## API Endpoints

The backend provides the following endpoints:

- `POST /api/register` - Register a new user
- `POST /api/login` - Authenticate a user
- `GET /api/users/:id` - Get user details
- `GET /api/challenges` - Get user challenges
- `POST /api/trades` - Record a trade
- `GET /api/trades/:userId` - Get user trades

## Features

- Multi-language support (English, French, Arabic)
- User authentication and authorization
- Trading challenges system
- Risk management tools
- AI-powered trading signals
- Educational MasterClass Academy
- Real-time market data
- Trading history and analytics

## Troubleshooting

### Common Issues:

1. **Backend not connecting to frontend**: Ensure both servers are running and CORS is configured correctly
2. **Database connection errors**: Verify MySQL server is running and connection settings are correct
3. **Missing dependencies**: Run `npm install` or `pip install -r requirements.txt` as needed

### Ports:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: Usually runs on port 3306

## Uploading to GitHub

To upload your project to GitHub, run the initialization script:

```
INIT_GIT.bat
```

This will initialize the git repository, commit all files, and push to your GitHub repository at https://github.com/Fatimaezzahra2002/EXAMEN-TRADESENSE

Or manually:

1. Initialize git:
   ```
   git init
   git add .
   git commit -m "Initial commit: TradeSense AI African Prop Trading Platform"
   ```

2. Add remote origin:
   ```
   git remote add origin https://github.com/Fatimaezzahra2002/EXAMEN-TRADESENSE.git
   ```

3. Push to GitHub:
   ```
   git branch -M main
   git push -u origin main
   ```