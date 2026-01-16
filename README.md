<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TradeSense AI - African Prop Trading Platform

TradeSense AI is an innovative prop trading platform designed specifically for African traders. It combines AI-powered trading signals with educational resources and risk management tools to help traders prove their skills and access funded accounts.

## Features

- **AI-Powered Trading Signals**: Advanced algorithms provide real-time trading recommendations
- **Multi-language Support**: English, French, and Arabic localization
- **Risk Management System**: Built-in protection to minimize losses
- **Educational Academy**: MasterClass Academy with comprehensive trading courses
- **Challenge System**: Prove your skills and earn funded accounts
- **Leaderboards**: Track top performers and compete with other traders
- **Real-time Market Data**: Live feeds from international and local markets
- **Secure Authentication**: Robust login and registration system

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for bundling
- React Router for navigation
- i18next for internationalization
- Chart.js for data visualization

### Backend
- Python Flask server
- MySQL database
- RESTful API endpoints

### Additional Components
- Docker support
- Automated testing
- Cross-origin resource sharing (CORS)

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- MySQL Server

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Fatimaezzahra2002/EXAMEN-TRADESENSE.git
   ```

2. Navigate to the project directory:
   ```bash
   cd examen tradesense
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install flask mysql-connector-python bcrypt
   ```

3. Configure your database connection in the backend files

4. Start the backend server:
   ```bash
   python app.py
   ```

## Database Schema

The database schema is located in `db/schema.sql`. Run this script to set up your database tables.

## Usage

1. Register a new account or log in with existing credentials
2. Access trading signals and market data
3. Participate in trading challenges
4. Track your performance on leaderboards
5. Take courses in the MasterClass Academy
6. Monitor your risk metrics

## Project Structure

```
examen tradesense/
├── backend/                 # Python Flask server
├── components/              # Reusable UI components
├── context/                 # React context providers
├── db/                      # Database schema and scripts
├── i18n/                    # Internationalization files
├── pages/                   # Application pages
├── services/                # API service functions
├── styles/                  # CSS and styling
└── models/                  # Data models
```

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Authenticate a user
- `GET /api/users/:id` - Get user details
- `GET /api/challenges` - Get user challenges
- `POST /api/trades` - Record a trade
- `GET /api/trades/:userId` - Get user trades

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For questions or support, please contact the project maintainer.