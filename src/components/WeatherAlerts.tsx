import React, { useState, useEffect, useCallback } from 'react';
import { X, CloudRain, Sun, Wind, Thermometer, Droplets, AlertTriangle, Sprout, Calendar, Bell, MapPin, RefreshCw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import WeatherHistoryChart from './WeatherHistoryChart.tsx';

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  rainfall: number;
  feelsLike?: number;
  location?: string;
  description?: string;
  icon?: string;
}

interface Alert {
  id: string;
  type: 'planting' | 'harvesting' | 'warning' | 'tip';
  title: string;
  message: string;
  crop?: string;
  priority: 'high' | 'medium' | 'low';
}

interface WeatherHistoryData {
  date: string;
  temperature: number;
  rainfall: number;
  humidity: number;
}

const WeatherAlerts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 65,
    condition: 'Loading...',
    windSpeed: 12,
    rainfall: 0,
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showNotification, setShowNotification] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [weatherHistory, setWeatherHistory] = useState<WeatherHistoryData[]>([]);

  const fetchWeather = useCallback(async (lat?: number, lon?: number, city?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { lat, lon, city },
      });

      if (error) {
        console.error('Error fetching weather:', error);
        toast.error('Failed to fetch weather data');
        return;
      }

      if (data) {
        setWeather({
          temperature: data.temperature,
          humidity: data.humidity,
          condition: data.condition,
          windSpeed: data.windSpeed,
          rainfall: data.rainfall,
          feelsLike: data.feelsLike,
          location: data.location,
          description: data.description,
          icon: data.icon,
        });
        setCurrentCity(data.location || city || '');
        
        if (!data.fallback) {
          toast.success(`Weather updated for ${data.location}`);
        }
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate weather history (simulated for past 30 days)
  useEffect(() => {
    const generateHistory = () => {
      const history: WeatherHistoryData[] = [];
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Simulate historical data with some variation
        const baseTemp = weather.temperature + (Math.random() - 0.5) * 10;
        const baseRainfall = Math.random() * 30;
        const baseHumidity = weather.humidity + (Math.random() - 0.5) * 20;
        
        history.push({
          date: `${date.getMonth() + 1}/${date.getDate()}`,
          temperature: Math.round(baseTemp * 10) / 10,
          rainfall: Math.round(baseRainfall * 10) / 10,
          humidity: Math.round(Math.max(30, Math.min(95, baseHumidity))),
        });
      }
      
      setWeatherHistory(history);
    };

    if (weather.temperature && weather.humidity) {
      generateHistory();
    }
  }, [weather.temperature, weather.humidity]);

  // Get user location and fetch weather on mount
  useEffect(() => {
    const getLocationAndWeather = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.log('Geolocation error:', error);
            // Default to major agricultural region
            fetchWeather(undefined, undefined, 'Nagpur');
          },
          { timeout: 10000 }
        );
      } else {
        fetchWeather(undefined, undefined, 'Nagpur');
      }
    };

    getLocationAndWeather();
  }, [fetchWeather]);

  // Generate alerts based on weather
  useEffect(() => {
    const generateAlerts = () => {
      const currentMonth = new Date().getMonth();
      const newAlerts: Alert[] = [];

      // Seasonal recommendations
      if (currentMonth >= 5 && currentMonth <= 8) {
        newAlerts.push({
          id: '1',
          type: 'planting',
          title: 'Kharif Planting Season',
          message: 'Optimal time to plant rice, maize, and cotton. Monsoon conditions are favorable.',
          crop: 'Rice, Maize, Cotton',
          priority: 'high',
        });
      } else if (currentMonth >= 9 && currentMonth <= 11) {
        newAlerts.push({
          id: '2',
          type: 'planting',
          title: 'Rabi Sowing Time',
          message: 'Begin sowing wheat, mustard, and chickpea. Soil moisture is optimal.',
          crop: 'Wheat, Mustard, Chickpea',
          priority: 'high',
        });
      } else if (currentMonth >= 2 && currentMonth <= 4) {
        newAlerts.push({
          id: '3',
          type: 'harvesting',
          title: 'Rabi Harvest Season',
          message: 'Time to harvest rabi crops. Check grain moisture before storage.',
          crop: 'Wheat, Barley',
          priority: 'high',
        });
      }

      // Weather-based alerts
      if (weather.temperature > 35) {
        newAlerts.push({
          id: '4',
          type: 'warning',
          title: 'Heat Wave Alert',
          message: `Temperature is ${weather.temperature}°C. Increase irrigation frequency and apply mulching.`,
          priority: 'high',
        });
      }

      if (weather.humidity > 80) {
        newAlerts.push({
          id: '5',
          type: 'warning',
          title: 'High Humidity Warning',
          message: `Humidity at ${weather.humidity}%. Risk of fungal diseases. Apply preventive fungicides.`,
          priority: 'medium',
        });
      }

      if (weather.rainfall > 20) {
        newAlerts.push({
          id: '6',
          type: 'tip',
          title: 'Rainfall Alert',
          message: `${weather.rainfall}mm rainfall expected. Delay fertilizer application and ensure drainage.`,
          priority: 'medium',
        });
      }

      if (weather.windSpeed > 30) {
        newAlerts.push({
          id: '7',
          type: 'warning',
          title: 'High Wind Warning',
          message: `Wind speed is ${weather.windSpeed} km/h. Secure greenhouse covers and support tall crops.`,
          priority: 'medium',
        });
      }

      newAlerts.push({
        id: '8',
        type: 'tip',
        title: 'Soil Testing Reminder',
        message: 'Regular soil testing helps optimize fertilizer use. Test before each major planting season.',
        priority: 'low',
      });

      setAlerts(newAlerts);
    };

    generateAlerts();
  }, [weather]);

  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      fetchWeather(undefined, undefined, cityInput.trim());
      setCityInput('');
    }
  };

  const handleRefresh = () => {
    if (currentCity) {
      fetchWeather(undefined, undefined, currentCity);
    } else {
      fetchWeather(undefined, undefined, 'Nagpur');
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'planting': return <Sprout className="w-5 h-5 text-primary" />;
      case 'harvesting': return <Calendar className="w-5 h-5 text-secondary" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'tip': return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-destructive bg-destructive/5';
      case 'medium': return 'border-l-secondary bg-secondary/5';
      case 'low': return 'border-l-muted bg-muted/50';
    }
  };

  const highPriorityCount = alerts.filter(a => a.priority === 'high').length;

  return (
    <>
      {/* Floating Weather Button */}
      <button
        onClick={() => { setIsOpen(true); setShowNotification(false); }}
        className="fixed bottom-24 left-6 z-40 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group"
        aria-label="Weather Alerts"
      >
        <CloudRain className="w-6 h-6" />
        {showNotification && highPriorityCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {highPriorityCount}
          </span>
        )}
      </button>

      {/* Weather Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="gradient-hero p-4 text-primary-foreground">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CloudRain className="w-6 h-6" />
                  Weather & Farm Alerts
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Current Weather */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-primary-foreground/10 rounded-lg p-2">
                  <Thermometer className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-lg font-bold">{Math.round(weather.temperature)}°C</p>
                  <p className="text-xs opacity-80">Temp</p>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-2">
                  <Droplets className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-lg font-bold">{Math.round(weather.humidity)}%</p>
                  <p className="text-xs opacity-80">Humidity</p>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-2">
                  <Wind className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-lg font-bold">{weather.windSpeed}</p>
                  <p className="text-xs opacity-80">km/h</p>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-2">
                  <Sun className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-sm font-medium">{weather.condition}</p>
                </div>
              </div>
              {/* Location Search */}
              <form onSubmit={handleCitySearch} className="flex gap-2 mt-4">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" />
                  <Input
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="Enter city name..."
                    className="pl-9 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  />
                </div>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </form>
              {weather.location && (
                <p className="text-xs text-primary-foreground/70 mt-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Current: {weather.location}
                  {weather.description && ` - ${weather.description}`}
                </p>
              )}
            </div>

            {/* Tabs for Alerts and History */}
            <div className="p-4">
              <Tabs defaultValue="alerts" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="alerts">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Alerts
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    30-Day History
                  </TabsTrigger>
                </TabsList>

                {/* Alerts Tab */}
                <TabsContent value="alerts" className="overflow-y-auto max-h-[50vh] mt-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    Farming Recommendations
                  </h3>
                  <div className="space-y-3">
                    {alerts.map(alert => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border-l-4 ${getPriorityColor(alert.priority)}`}
                      >
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm">{alert.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                            {alert.crop && (
                              <p className="text-xs text-primary mt-2 font-medium">
                                <Sprout className="w-3 h-3 inline mr-1" />
                                {alert.crop}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="text-xs" asChild>
                        <a href="/predict">Get Crop Prediction</a>
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs" asChild>
                        <a href="/shop">Shop Farm Supplies</a>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="overflow-y-auto max-h-[50vh] mt-4">
                  <WeatherHistoryChart data={weatherHistory} />
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default WeatherAlerts;