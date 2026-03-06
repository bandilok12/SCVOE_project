export interface CropData {
  State: string;
  Region: string;
  Soil_Type: string;
  Temperature: number;
  Humidity: number;
  Rainfall: number;
  pH: number;
  Nitrogen: number;
  Phosphorus: number;
  Potassium: number;
  Organic_Carbon: number;
  Electrical_Conductivity: number;
  Crop: string;
  Crop_Yield: number;
  Irrigation_Type: string;
  Fertilizer_Used: string;
  Pesticide_Used: string;
  Year: number;
  District: string;
  Market_Rate_2024: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  unit: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface PredictionInput {
  state: string;
  soilType: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export interface PredictionResult {
  recommendedCrop: string;
  expectedYield: number;
  confidence: number;
  marketRate: number;
}
