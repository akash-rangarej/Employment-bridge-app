# Multilingual Employment Portal

A platform that bridges the informal sector and digital employment in India, providing job opportunities, digital training, and secure payment solutions.

## Features

- Job listing aggregation from formal and informal sectors
- Multilingual digital training modules
- Skill certification and micro-learning resources
- Dispute resolution system
- Multi-language support

## Tech Stack

- Frontend: React with TypeScript
- Backend: Flask (Python)
- Database: MongoDB
- Authentication: JWT
- Payment Processing: (To be integrated)

## Prerequisites

- Node.js (v14 or higher)
- Python 3.8 or higher
- MongoDB
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Update the variables in `.env`

5. Run the Flask application:
   ```bash
   flask run
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Jobs

- GET /api/jobs - Get all jobs
- POST /api/jobs - Create a new job
- GET /api/jobs/<job_id> - Get job details
- POST /api/jobs/<job_id>/apply - Apply for a job

### Training

- GET /api/training/modules - Get all training modules
- POST /api/training/modules - Create a new module
- POST /api/training/modules/<module_id>/enroll - Enroll in a module
- POST /api/training/certifications - Issue certification
- GET /api/training/certifications/<user_id> - Get user certifications

### Payments

- POST /api/payments/create-payment - Create a payment
- POST /api/payments/release-payment/<payment_id> - Release payment
- POST /api/payments/dispute/<payment_id> - Create payment dispute
- GET /api/payments/transactions/<user_id> - Get user transactions

### Disputes

- GET /api/disputes - Get all disputes
- GET /api/disputes/<dispute_id> - Get dispute details
- POST /api/disputes/<dispute_id>/resolve - Resolve dispute
- POST /api/disputes/<dispute_id>/add-evidence - Add evidence
- POST /api/disputes/<dispute_id>/comments - Add comment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
