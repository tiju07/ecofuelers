# Smart Office Supplies & Inventory Management System

## Overview

The **Smart Office Supplies & Inventory Management System** is an AI-powered web application designed for a sustainability-themed hackathon. It optimizes office supply management by tracking real-time usage, providing data-driven ordering recommendations, issuing waste reduction alerts, estimating cost savings, and generating detailed reports. The system promotes sustainable procurement practices, reduces waste, and can lower office supply expenses by 15-30%, contributing to zero-waste office goals.

The application features a **React** frontend for an intuitive user interface and a **FastAPI** backend for robust API services, integrated within a monolithic repository. It supports role-based access (admin and employee) and handles various edge cases for reliability.

## Features

- **Real-Time Inventory Tracking**: Monitors office supplies (e.g., paper, coffee pods, cleaning supplies) with immediate updates on usage and stock levels (TC#1–TC#3, TC#15–TC#16, TC#27–TC#28).
- **Optimized Ordering Suggestions**: Provides AI-driven recommendations based on historical usage, prioritizing eco-friendly suppliers (TC#4–TC#6, TC#17–TC#18, TC#29–TC#30).
- **Waste Reduction Alerts**: Alerts for overstocking or nearing expiration to minimize waste (TC#7–TC#8, TC#19–TC#20, TC#31–TC#32).
- **Cost Savings Estimation**: Calculates potential savings from optimized ordering, displayed on a user-friendly dashboard (TC#9–TC#10, TC#21–TC#22, TC#33–TC#34).
- **Reporting and Analytics**: Generates exportable reports (PDF/Excel) on usage trends, waste reduction, and savings (TC#11–TC#12, TC#23–TC#24, TC#35–TC#36).
- **User Roles and Permissions**: Supports admin (full access) and employee (view-only and usage logging) roles with JWT authentication (TC#13–TC#14, TC#25–TC#26).
- **Third-Party Integration**: Integrates with procurement platforms for automated ordering (TC#37–TC#38).

## Technologies Used

- **Frontend**: React, React Router, Axios, Tailwind CSS, Chart.js, jsPDF
- **Backend**: FastAPI, SQLAlchemy, SQLite, Pydantic, python-jose, passlib
- **Environment**: Node.js (v16+), Python (3.8+), pip, npm
- **Testing**: pytest (backend), Jest (frontend, optional)

## Project Structure

```
smart-office-inventory/
├── frontend/                    # React frontend
│   ├── public/                 # Static assets (index.html, manifest.json)
│   ├── src/                    # React source code
│   │   ├── components/         # Reusable components (Navbar, SupplyTable, etc.)
│   │   ├── pages/              # Page components (Dashboard, Inventory, etc.)
│   │   ├── context/            # Authentication context
│   │   ├── App.js              # Main app with routing
│   │   ├── index.js            # Entry point
│   │   └── ...                 # CSS and assets
├── backend/                    # FastAPI backend
│   ├── database/               # Database setup (SQLite)
│   ├── models/                 # SQLAlchemy models (Supplies, Users)
│   ├── routes/                 # API routes (inventory, auth)
│   ├── services/               # Business logic (recommendations, procurement)
│   ├── schemas/                # Pydantic schemas
│   ├── utils/                  # Utilities (JWT, error handlers)
│   ├── tests/                  # Unit tests
│   └── main.py                 # FastAPI app entry point
├── README.md                   # Project documentation
├── requirements.txt            # Backend dependencies
├── .gitignore                  # Git ignore file
└── .env.example                # Example environment variables
```

## Prerequisites

- **Node.js** (v16 or higher): For running the React frontend.
- **Python** (3.8 or higher): For running the FastAPI backend.
- **npm**: For installing frontend dependencies.
- **pip**: For installing backend dependencies.
- **Git**: For cloning the repository.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-repo/smart-office-inventory.git
   cd smart-office-inventory
   ```

2. **Set Up Environment Variables**:

   - Copy `.env.example` to `.env` in the root folder:

     ```bash
     cp .env.example .env
     ```

   - Update `.env` with appropriate values (e.g., `JWT_SECRET`).

   - Copy `frontend/.env.example` to `frontend/.env` and set `REACT_APP_API_URL=http://localhost:8000`.

3. **Install Backend Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Install Frontend Dependencies**:

   ```bash
   cd frontend
   npm install
   cd ..
   ```

5. **Initialize the Database**:

   - Run the database initialization script to create SQLite tables and seed sample data:

     ```bash
     python backend/database/init_db.py
     ```

## Running the Application

1. **Start the Backend**:

   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
   ```

   The API will be available at `http://localhost:8000`.

2. **Start the Frontend**:

   ```bash
   cd frontend
   npm start
   ```

   The app will open at `http://localhost:3000` in your browser.

3. **Access the Application**:

   - Open `http://localhost:3000` in a web browser.
   - Log in with sample credentials:
     - Admin: `username: admin, password: admin123`
     - Employee \`

## Usage

- **Login**: Use the `/login` page to authenticate as an admin or employee.
- **Dashboard**: View summary stats (total supplies, recent alerts, savings).
- **Inventory**: View supplies, add/update supplies (admin only), or log usage.
- **Recommendations**: Review and approve AI-driven ordering suggestions.
- **Alerts**: Monitor and dismiss waste reduction alerts.
- **Reports**: Generate and export reports on usage trends and savings.

## Testing

- **Backend Tests**:

  ```bash
  pytest backend/tests/
  ```

  Covers inventory, recommendations, alerts, and authentication (TC#1–TC#38).

- **Frontend Tests** (optional):

  ```bash
  cd frontend
  npm test
  ```

## Contributing

This project was developed for a hackathon. Contributions are welcome! Please:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- Built with ❤️ for a sustainability-themed hackathon.
- Thanks to GitHub Copilot for code generation assistance.
- Inspired by the goal of promoting sustainable office practices.