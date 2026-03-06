from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load ML model and preprocessing objects
try:
    model = joblib.load('best_crop_model.pkl')
    scaler = joblib.load('scaler.pkl')
    label_encoders = joblib.load('label_encoders.pkl')
    print("✓ Model files loaded successfully")
except FileNotFoundError as e:
    print(f"✗ Error loading model files: {e}")
    print("Please ensure best_crop_model.pkl, scaler.pkl, and label_encoders.pkl are in the project directory")
    model = None
    scaler = None
    label_encoders = {}

# Label mappings
STATE_MAP = {
    "Gujarat": 0, "Karnataka": 1, "Maharashtra": 2, "Punjab": 3,
    "Rajasthan": 4, "Tamil Nadu": 5, "Uttar Pradesh": 6, "West Bengal": 7
}

REGION_MAP = {
    "Central": 0, "East": 1, "North": 2, "South": 3, "West": 4
}

SOIL_TYPE_MAP = {
    "Alluvial": 0, "Arid": 1, "Black": 2, "Clay": 3,
    "Laterite": 4, "Loamy": 5, "Red": 6, "Saline": 7
}

CROP_MAP_REVERSE = {
    0: "Cotton", 1: "Maize", 2: "Millets", 3: "Pulses",
    4: "Rice", 5: "Sugarcane", 6: "Wheat"
}

# Crop information for recommendations
CROP_INFO = {
    "Cotton": {
        "temp_range": "20-30°C",
        "rainfall": "500-800 mm",
        "ph_range": "5.5-8.0",
        "nitrogen": "50-100 kg/ha",
        "phosphorus": "25-50 kg/ha",
        "potassium": "50-100 kg/ha",
        "description": "Cotton is a warm-season crop that requires well-drained soil and adequate moisture during the growing season.",
        "soil_type": "Alluvial, Black, Loamy",
        "fertilizer": "NPK fertilizer with emphasis on nitrogen"
    },
    "Maize": {
        "temp_range": "18-27°C",
        "rainfall": "600-1000 mm",
        "ph_range": "5.5-7.5",
        "nitrogen": "100-150 kg/ha",
        "phosphorus": "50-80 kg/ha",
        "potassium": "50-100 kg/ha",
        "description": "Maize requires warm temperatures and well-distributed rainfall throughout the growing season.",
        "soil_type": "Alluvial, Black, Loamy",
        "fertilizer": "Balanced NPK fertilizer"
    },
    "Millets": {
        "temp_range": "20-30°C",
        "rainfall": "400-600 mm",
        "ph_range": "6.0-7.5",
        "nitrogen": "40-60 kg/ha",
        "phosphorus": "20-40 kg/ha",
        "potassium": "20-40 kg/ha",
        "description": "Millets are drought-resistant crops suitable for semi-arid regions with low rainfall.",
        "soil_type": "Arid, Red, Loamy",
        "fertilizer": "Low nitrogen fertilizer"
    },
    "Pulses": {
        "temp_range": "20-30°C",
        "rainfall": "400-600 mm",
        "ph_range": "6.0-7.5",
        "nitrogen": "20-30 kg/ha",
        "phosphorus": "40-60 kg/ha",
        "potassium": "20-40 kg/ha",
        "description": "Pulses are nitrogen-fixing crops that improve soil fertility and require moderate rainfall.",
        "soil_type": "Alluvial, Black, Red, Loamy",
        "fertilizer": "Phosphorus-rich fertilizer, minimal nitrogen"
    },
    "Rice": {
        "temp_range": "20-35°C",
        "rainfall": "1000-2000 mm",
        "ph_range": "5.0-7.5",
        "nitrogen": "100-150 kg/ha",
        "phosphorus": "40-60 kg/ha",
        "potassium": "40-60 kg/ha",
        "description": "Rice requires high temperature, high humidity, and abundant water supply.",
        "soil_type": "Alluvial, Clay, Laterite",
        "fertilizer": "Nitrogen-rich fertilizer"
    },
    "Sugarcane": {
        "temp_range": "26-32°C",
        "rainfall": "1500-2500 mm",
        "ph_range": "6.0-7.5",
        "nitrogen": "150-200 kg/ha",
        "phosphorus": "60-80 kg/ha",
        "potassium": "100-150 kg/ha",
        "description": "Sugarcane is a tropical crop requiring high temperature, high rainfall, and fertile soil.",
        "soil_type": "Alluvial, Black, Loamy",
        "fertilizer": "High nitrogen and potassium fertilizer"
    },
    "Wheat": {
        "temp_range": "15-25°C",
        "rainfall": "500-900 mm",
        "ph_range": "6.0-7.5",
        "nitrogen": "100-120 kg/ha",
        "phosphorus": "50-60 kg/ha",
        "potassium": "40-60 kg/ha",
        "description": "Wheat is a cool-season crop that grows well in temperate climates with moderate rainfall.",
        "soil_type": "Alluvial, Black, Loamy",
        "fertilizer": "Balanced NPK fertilizer"
    }
}

@app.route('/api/predict', methods=['POST'])
def api_predict():
    if model is None or scaler is None:
        return jsonify({'error': 'Model files not found'}), 500
    
    try:
        data = request.json
        if data is None:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        # Validate required fields
        required_fields = ['state', 'region', 'soil_type', 'temperature', 'humidity', 
                          'rainfall', 'ph', 'nitrogen', 'phosphorus', 'potassium', 
                          'organic_carbon', 'electrical_conductivity']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate state, region, and soil_type
        if data['state'] not in STATE_MAP:
            return jsonify({'error': f'Invalid state: {data["state"]}'}), 400
        if data['region'] not in REGION_MAP:
            return jsonify({'error': f'Invalid region: {data["region"]}'}), 400
        if data['soil_type'] not in SOIL_TYPE_MAP:
            return jsonify({'error': f'Invalid soil_type: {data["soil_type"]}'}), 400
        
        input_data = {
            'State': STATE_MAP[data['state']],
            'Region': REGION_MAP[data['region']],
            'Soil_Type': SOIL_TYPE_MAP[data['soil_type']],
            'Temperature (°C)': float(data['temperature']),
            'Humidity (%)': float(data['humidity']),
            'Rainfall (mm)': float(data['rainfall']),
            'pH': float(data['ph']),
            'Nitrogen (N)': float(data['nitrogen']),
            'Phosphorus (P)': float(data['phosphorus']),
            'Potassium (K)': float(data['potassium']),
            'Organic_Carbon (%)': float(data['organic_carbon']),
            'Electrical_Conductivity (dS/m)': float(data['electrical_conductivity'])
        }
        
        input_df = pd.DataFrame([input_data])
        input_scaled = scaler.transform(input_df)
        prediction = model.predict(input_scaled)[0]
        probabilities = model.predict_proba(input_scaled)[0]
        confidence = max(probabilities) * 100

        # Get top 3 indices and their probabilities
        top_3_indices = probabilities.argsort()[-3:][::-1]
        suggestions = [CROP_MAP_REVERSE[idx] for idx in top_3_indices]
        suggestion_percentages = [round(float(probabilities[idx]) * 100, 2) for idx in top_3_indices]

        crop_name = CROP_MAP_REVERSE[prediction]
        
        return jsonify({
            'crop_name': crop_name,
            'confidence': round(confidence, 2),
            'suggestions': suggestions,
            'suggestion_percentages': suggestion_percentages,
            'crop_info': CROP_INFO.get(crop_name, {})
        })
    except KeyError as e:
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400
    except ValueError as e:
        return jsonify({'error': f'Invalid value: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None and scaler is not None
    })

if __name__ == '__main__':
    print("Starting Crop Prediction API Server...")
    print(f"Model loaded: {model is not None}")
    print(f"Scaler loaded: {scaler is not None}")
    app.run(debug=True, host='0.0.0.0', port=5000)

