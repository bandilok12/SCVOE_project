import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Footer from '@/components/Footer';
import { Brain, Leaf, Droplets, Thermometer, CloudRain, FlaskConical, TrendingUp, Sparkles, Mountain } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { predictCrop } from '@/lib/predictionApi';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import cropAnalytics from '@/assets/crop-analytics.jpg';
import cropBg from '@/assets/plant.jpg';

const states = ['Gujarat', 'Karnataka', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'];
const regions = ['Central', 'East', 'North', 'South', 'West'];
const soilTypes = ['Alluvial', 'Arid', 'Black', 'Clay', 'Laterite', 'Loamy', 'Red', 'Saline'];
const marketRates: Record<string, number> = {
  Wheat: 2100,
  Rice: 2200,
  Maize: 1800,
  Cotton: 5500,
  Sugarcane: 350,
  Pulses: 5800,
  Millets: 2200,
  Soybean: 4500,
};
const SUGGESTION_COLORS = ['#22c55e', '#0ea5e9', '#a855f7']; // green, sky, violet

interface PredictionResult {
  crop: string;
  expectedYield: number;
  confidence: number;
  marketRate: number;
  suggestions: string[];
  suggestionData: { name: string; value: number }[];
  cropInfo?: Record<string, string>;
}

const CropPrediction: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const [formData, setFormData] = useState({
    state: 'Gujarat',
    region: 'West',
    soilType: 'Alluvial',
    temperature: 28,
    humidity: 65,
    rainfall: 150,
    pH: 6.5,
    nitrogen: 150,
    phosphorus: 50,
    potassium: 100,
    organicCarbon: 0.8,
    electricalConductivity: 0.5,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['temperature', 'humidity', 'rainfall', 'pH', 'nitrogen', 'phosphorus', 'potassium', 'organicCarbon', 'electricalConductivity'];

    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await predictCrop({
        state: formData.state,
        region: formData.region,
        soil_type: formData.soilType,
        temperature: formData.temperature,
        humidity: formData.humidity,
        rainfall: formData.rainfall,
        ph: formData.pH,
        nitrogen: formData.nitrogen,
        phosphorus: formData.phosphorus,
        potassium: formData.potassium,
        organic_carbon: formData.organicCarbon,
        electrical_conductivity: formData.electricalConductivity,
      });

      const marketRate = marketRates[response.crop_name] || 0;
      const expectedYield = Math.round(2000 + (formData.rainfall * 5) + (formData.humidity * 10));

      const suggestionData =
        (response.suggestions || []).map((name, index) => ({
          name,
          value:
            response?.suggestion_percentages?.[index] ??
            (index === 0 ? response.confidence : Math.max(0, (100 - response.confidence) / Math.max((response.suggestions.length || 1) - 1, 1))),
        })) || [];

      const predictionResult: PredictionResult = {
        crop: response.crop_name,
        confidence: Math.round(response.confidence),
        expectedYield,
        marketRate,
        suggestions: response.suggestions || [],
        suggestionData,
        cropInfo: response.crop_info,
      };

      setPrediction(predictionResult);

      if (user) {
        try {
          const { error } = await supabase.from('prediction_history').insert({
            user_id: user.id,
            state: formData.state,
            soil_type: formData.soilType,
            temperature: formData.temperature,
            humidity: formData.humidity,
            rainfall: formData.rainfall,
            ph: formData.pH,
            nitrogen: formData.nitrogen,
            phosphorus: formData.phosphorus,
            potassium: formData.potassium,
            predicted_crop: response.crop_name,
            predicted_yield: expectedYield,
            confidence: Math.round(response.confidence),
            market_rate: marketRate,
          });

          if (error) {
            console.error('Error saving prediction:', error);
          } else {
            toast.success('Prediction saved to history!');
          }
        } catch (err) {
          console.error('Error saving prediction:', err);
        }
      } else {
        toast.success('Prediction complete! Sign in to save predictions.');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      const message = error instanceof Error ? error.message : 'Unable to complete prediction. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section
  className="relative min-h-[95vh] flex items-center justify-center"
  style={{
    backgroundImage: `url(${cropBg})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }}
>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <Brain className="w-9 h-9 text-secondary" />
            <span className="text-xl font-bold text-black">AI-Powered Analysis</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-bold text-primary-foreground mb-4">
            Crop Prediction Engine
          </h1>
          <p className="text-cyan-600/80 max-w-2xl mx-auto text-3xl font-bold">
            Enter your soil and environmental parameters to get AI-powered crop recommendations and yield predictions.
          </p>
        </div>
      </section>

      {/* About Crop Prediction */}
     <section className="py-12 bg-accent">
        <br />
<br /><br />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Understanding Crop Prediction Technology
              </h2>
              <p className="text-muted-foreground text-2xl mb-4">
                Crop prediction uses machine learning algorithms trained on historical agricultural data, 
                including soil conditions, weather patterns, and yield outcomes from across India. Our 
                model analyzes multiple factors to recommend the optimal crop for your specific conditions.
              </p><br /><br />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Thermometer className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-xl text-foreground">Climate Analysis</h4>
                    <p className="text-xl text-muted-foreground">Temperature & humidity patterns</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mountain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-xl text-foreground">Soil Properties</h4>
                    <p className="text-xl text-muted-foreground">Nutrient & pH levels</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <CloudRain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-xl text-foreground">Rainfall Data</h4>
                    <p className="text-xl text-muted-foreground">Annual precipitation patterns</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-xl text-foreground">Market Trends</h4>
                    <p className="text-xl text-muted-foreground">Current crop prices</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={cropAnalytics}
                alt="Farmer using tablet for crop analytics in field"
                className="rounded-2xl shadow-card w-full"
              />
            </div>
          </div>
        </div><br /><br /><br />
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-card rounded-2xl shadow-card border border-border p-8">
              <h2 className="text-4xl font-bold text-foreground mb-6 flex items-center gap-2">
                <FlaskConical className="w-6 h-6 text-primary" />
                Input Parameters
              </h2>
<br /><br />
              <form onSubmit={handlePredict} className="space-y-6">
                {/* Location */}
                <div className="grid sm:grid-cols-2 gap-4 text-xl">
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-xl">State</Label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="flex h-11 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                    >
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 text-xl">
                    <Label htmlFor="region" className="text-xl">Region</Label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="flex h-11 w-full rounded-lg text-lg border-2 border-input bg-background px-4 py-2  focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                    >
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 text-xl">
                  <Label htmlFor="soilType" className="text-xl">Soil Type</Label>
                  <select
                    id="soilType"
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                  >
                    {soilTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Environmental */}
                <div className="grid sm:grid-cols-3 text-3xl  gap-4">
                  <div className="space-y-2 text-3xl">
                    <Label htmlFor="temperature" className="flex items-center text-xl  gap-1">
                      <Thermometer className="w-4 h-4 text-3xl text-secondary" />
                      Temperature (°C)
                    </Label>
                    <Input
                      id="temperature"
                      name="temperature"
                      type="number"
                      value={formData.temperature}
                      onChange={handleChange}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="humidity" className="flex items-center text-xl gap-1">
                      <Droplets className="w-4 h-4 text-primary" />
                      Humidity (%)
                    </Label>
                    <Input
                      id="humidity"
                      name="humidity"
                      type="number"
                      value={formData.humidity}
                      onChange={handleChange}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rainfall" className="flex items-center text-xl gap-1">
                      <CloudRain className="w-4 h-4 text-primary" />
                      Rainfall (mm)
                    </Label>
                    <Input
                      id="rainfall"
                      name="rainfall"
                      type="number"
                      value={formData.rainfall}
                      onChange={handleChange}
                      className="text-lg"
                    />
                  </div>
                </div>

                {/* Soil Properties */}
                <div className="grid sm:grid-cols-2 text-xl gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pH" className="text-xl">Soil pH</Label>
                    <Input
                      id="pH"
                      name="pH"
                      type="number"
                      step="0.1"
                      value={formData.pH}
                      onChange={handleChange}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nitrogen" className="text-xl">Nitrogen (N) kg/ha</Label>
                    <Input
                      id="nitrogen"
                      name="nitrogen"
                      type="number"
                      value={formData.nitrogen}
                      onChange={handleChange}
                      className="text-lg"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phosphorus" className="text-xl">Phosphorus (P) kg/ha</Label>
                    <Input
                      id="phosphorus"
                      name="phosphorus"
                      type="number"
                      value={formData.phosphorus}
                      onChange={handleChange}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="potassium" className="text-xl">Potassium (K) kg/ha</Label>
                    <Input
                      id="potassium"
                      name="potassium"
                      type="number"
                      value={formData.potassium}
                      onChange={handleChange}
                      className="text-lg"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organicCarbon" className="text-xl">Organic Carbon (%)</Label>
                    <Input
                      id="organicCarbon"
                      name="organicCarbon"
                      type="number"
                      step="0.1"
                      value={formData.organicCarbon}
                      onChange={handleChange}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="electricalConductivity" className="text-xl">Electrical Conductivity (dS/m)</Label>
                    <Input
                      id="electricalConductivity"
                      name="electricalConductivity"
                      type="number"
                      step="0.1"
                      value={formData.electricalConductivity}
                      onChange={handleChange}
                      className="text-lg"
                    />
                  </div>
                </div>
<br />
                <Button type="submit" variant="hero" size="lg" className="w-full gap-2" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Predict Optimal Crop
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {prediction ? (
                <div className="bg-card rounded-2xl shadow-card border border-border p-8 animate-slide-up">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-6 h-6 text-secondary" />
                    <h2 className="text-2xl font-bold text-foreground">Prediction Results</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-accent rounded-xl p-6 text-center">
                      <Leaf className="w-10 h-10 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Recommended Crop</p>
                      <p className="text-2xl font-bold text-foreground">{prediction.crop}</p>
                    </div>
                    <div className="bg-accent rounded-xl p-6 text-center">
                      <TrendingUp className="w-10 h-10 text-secondary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Expected Yield</p>
                      <p className="text-2xl font-bold text-foreground">{prediction.expectedYield.toLocaleString()} kg/ha</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Confidence Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full gradient-hero rounded-full transition-all duration-500"
                            style={{ width: `${prediction.confidence}%` }}
                          />
                        </div>
                        <span className="font-semibold text-foreground">{prediction.confidence}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Market Rate (2024)</span>
                      <span className="font-semibold text-foreground">₹{prediction.marketRate.toLocaleString()}/quintal</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Estimated Revenue</span>
                      <span className="font-bold text-primary text-lg">
                        ₹{((prediction.expectedYield / 100) * prediction.marketRate).toLocaleString()}
                      </span>
                    </div>
                    {prediction.suggestionData.length > 0 && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-muted-foreground mb-3">Top 3 Suggestions</p>
                        <div className="grid sm:grid-cols-2 gap-4 items-center">
                          <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={prediction.suggestionData}
                                  dataKey="value"
                                  nameKey="name"
                                  outerRadius="80%"
                                  paddingAngle={0}
                                  label={({ value }) => `${(value as number).toFixed(1)}%`}
                                  labelLine={false}
                                >
                                  {prediction.suggestionData.map((entry, index) => (
                                    <Cell
                                      key={entry.name}
                                      fill={SUGGESTION_COLORS[index % SUGGESTION_COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip
                                  formatter={(value, name) => [`${(value as number).toFixed(2)}%`, name as string]}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <ul className="space-y-1 text-sm">
                            {prediction.suggestionData.map((entry) => (
                              <li key={entry.name} className="flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                  <span
                                    className="inline-block h-3 w-3 rounded-sm"
                                    style={{
                                      backgroundColor:
                                        SUGGESTION_COLORS[prediction.suggestionData.findIndex((d) => d.name === entry.name) % SUGGESTION_COLORS.length],
                                    }}
                                  />
                                  {entry.name}
                                </span>
                                <span className="font-medium">{entry.value.toFixed(2)}%</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    {prediction.cropInfo && (
                      <div className="p-4 bg-muted rounded-lg space-y-2">
                        <p className="text-muted-foreground">Ideal Conditions</p>
                        <div className="grid sm:grid-cols-2 gap-2 text-sm text-foreground">
                          {prediction.cropInfo.temp_range && <span><strong>Temp:</strong> {prediction.cropInfo.temp_range}</span>}
                          {prediction.cropInfo.rainfall && <span><strong>Rainfall:</strong> {prediction.cropInfo.rainfall}</span>}
                          {prediction.cropInfo.ph_range && <span><strong>pH:</strong> {prediction.cropInfo.ph_range}</span>}
                          {prediction.cropInfo.soil_type && <span><strong>Soil:</strong> {prediction.cropInfo.soil_type}</span>}
                          {prediction.cropInfo.fertilizer && <span><strong>Fertilizer:</strong> {prediction.cropInfo.fertilizer}</span>}
                          {prediction.cropInfo.description && <span className="sm:col-span-2 text-muted-foreground">{prediction.cropInfo.description}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-2xl shadow-card border border-border p-8 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Analyze</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Fill in the parameters and click predict to get AI-powered crop recommendations.
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Tips */}
              
            </div>
          </div>
        </div>
      </section>

      {/* Crop Information */}
      <section className="py-12 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-foreground text-center mb-8">
            Major Crops & Their Requirements
          </h2><br /><br />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Wheat', soil: 'Loamy/Alluvial', temp: '15-25°C', rainfall: '250-400mm', icon: '🌾' },
              { name: 'Rice', soil: 'Clayey/Loamy', temp: '20-35°C', rainfall: '1200-1400mm', icon: '🍚' },
              { name: 'Cotton', soil: 'Black/Alluvial', temp: '21-35°C', rainfall: '500-1000mm', icon: '🏵️' },
              { name: 'Sugarcane', soil: 'Loamy', temp: '20-40°C', rainfall: '750-1200mm', icon: '🎋' },
               { name: 'Pulses', soil: 'Claley/Alluvial', temp: '12-15°C', rainfall: '1000-1500mm', icon: '🏵️' },
                 { name: 'Corn', soil: 'Alluvial', temp: '33-42°C', rainfall: '1222-4500mm', icon: '🎋' },
                  { name: 'Bajra', soil: 'Sandy', temp: '20-40°C', rainfall: '350-700mm', icon: '🌾' },
            ].map((crop) => (
              <div key={crop.name} className="bg-card rounded-xl p-5 border border-border">
                <div className="text-3xl mb-3">{crop.icon}</div>
                <h3 className="font-semibold text-2xl text-foreground mb-2">{crop.name}</h3>
                <div className="space-y-1 text-2xl text-muted-foreground">
                  <p><span className="font-medium">Soil:</span> {crop.soil}</p>
                  <p><span className="font-medium">Temp:</span> {crop.temp}</p>
                  <p><span className="font-medium">Rainfall:</span> {crop.rainfall}</p>
                </div>
              </div>
            ))}
          </div>
        </div><br /><br /><br /><br />
      </section>

      <Footer />
    </main>
  );
};

export default CropPrediction;
