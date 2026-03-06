const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

export interface CropPredictionRequest {
  state: string;
  region: string;
  soil_type: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organic_carbon: number;
  electrical_conductivity: number;
}

export interface CropPredictionResponse {
  crop_name: string;
  confidence: number;
  suggestions: string[];
  suggestion_percentages?: number[];
  crop_info?: Record<string, string>;
}

export async function predictCrop(payload: CropPredictionRequest): Promise<CropPredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.error || `Prediction request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

