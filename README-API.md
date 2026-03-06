# Crop Prediction API Setup

This directory contains both the React frontend and Flask backend API for crop prediction.

## Quick Start

### 1. Start the Flask API Backend

**Windows:**
```bash
run-api.bat
```

**Linux/Mac:**
```bash
chmod +x run-api.sh
./run-api.sh
```

Or manually:
```bash
pip install -r requirements-api.txt
python api.py
```

The API will start on `http://localhost:5000`

### 2. Start the React Frontend

```bash
npm install
npm run dev
```

The frontend will start on `http://localhost:8080`

## API Endpoints

### POST `/api/predict`
Predicts the optimal crop based on input parameters.

**Request Body:**
```json
{
  "state": "Maharashtra",
  "region": "West",
  "soil_type": "Black",
  "temperature": 28,
  "humidity": 65,
  "rainfall": 150,
  "ph": 6.5,
  "nitrogen": 150,
  "phosphorus": 50,
  "potassium": 100,
  "organic_carbon": 0.8,
  "electrical_conductivity": 0.5
}
```

**Response:**
```json
{
  "crop_name": "Wheat",
  "confidence": 85.5,
  "suggestions": ["Wheat", "Rice", "Maize"],
  "crop_info": {
    "temp_range": "15-25°C",
    "rainfall": "500-900 mm",
    ...
  }
}
```

### GET `/health`
Check API health and model loading status.

## Required Files

Make sure these files are in the project root:
- `best_crop_model.pkl` - Trained ML model
- `scaler.pkl` - Feature scaler
- `label_encoders.pkl` - Label encoders

## Environment Variables

The React frontend uses `VITE_API_BASE_URL` environment variable (defaults to `http://localhost:5000`).

To change the API URL, create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:5000
```

