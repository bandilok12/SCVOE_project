import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  History, Leaf, TrendingUp, Calendar, MapPin, Trash2, 
  Brain, ChevronRight, Thermometer, Droplets, FlaskConical
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface PredictionRecord {
  id: string;
  state: string;
  soil_type: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  predicted_crop: string;
  predicted_yield: number;
  confidence: number;
  market_rate: number;
  created_at: string;
}

const PredictionHistory: React.FC = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPredictions();
    }
  }, [user]);

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('prediction_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      toast.error('Failed to load prediction history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('prediction_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPredictions(prev => prev.filter(p => p.id !== id));
      toast.success('Prediction deleted');
    } catch (error) {
      console.error('Error deleting prediction:', error);
      toast.error('Failed to delete prediction');
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign in Required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to view your prediction history.</p>
          <Link to="/auth">
            <Button variant="hero">Sign In</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="py-12 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <History className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">Your Predictions</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Prediction History
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            View all your past crop predictions and their results.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : predictions.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Predictions Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start making predictions to see them here.
              </p>
              <Link to="/predict">
                <Button variant="hero" className="gap-2">
                  Make Your First Prediction
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.map((prediction) => (
                <div 
                  key={prediction.id}
                  className="bg-card rounded-2xl border border-border p-6 hover:shadow-card transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Crop Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{prediction.predicted_crop}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{prediction.state} • {prediction.soil_type} Soil</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(prediction.created_at), 'PPP')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Parameters */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 flex-1">
                      <div className="text-center p-2 bg-accent rounded-lg">
                        <Thermometer className="w-4 h-4 text-secondary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Temp</p>
                        <p className="text-sm font-medium text-foreground">{prediction.temperature}°C</p>
                      </div>
                      <div className="text-center p-2 bg-accent rounded-lg">
                        <Droplets className="w-4 h-4 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Humidity</p>
                        <p className="text-sm font-medium text-foreground">{prediction.humidity}%</p>
                      </div>
                      <div className="text-center p-2 bg-accent rounded-lg">
                        <FlaskConical className="w-4 h-4 text-secondary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">pH</p>
                        <p className="text-sm font-medium text-foreground">{prediction.ph}</p>
                      </div>
                      <div className="text-center p-2 bg-accent rounded-lg">
                        <span className="text-xs font-bold text-primary">N</span>
                        <p className="text-xs text-muted-foreground">Nitrogen</p>
                        <p className="text-sm font-medium text-foreground">{prediction.nitrogen}</p>
                      </div>
                      <div className="text-center p-2 bg-accent rounded-lg">
                        <span className="text-xs font-bold text-secondary">P</span>
                        <p className="text-xs text-muted-foreground">Phosphorus</p>
                        <p className="text-sm font-medium text-foreground">{prediction.phosphorus}</p>
                      </div>
                      <div className="text-center p-2 bg-accent rounded-lg">
                        <span className="text-xs font-bold text-primary">K</span>
                        <p className="text-xs text-muted-foreground">Potassium</p>
                        <p className="text-sm font-medium text-foreground">{prediction.potassium}</p>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <TrendingUp className="w-5 h-5 text-secondary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Yield</p>
                        <p className="text-sm font-bold text-foreground">{prediction.predicted_yield.toLocaleString()} kg/ha</p>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-primary">{prediction.confidence}%</div>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-foreground">₹{prediction.market_rate}</p>
                        <p className="text-xs text-muted-foreground">/quintal</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(prediction.id)}
                        disabled={deletingId === prediction.id}
                      >
                        {deletingId === prediction.id ? (
                          <div className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default PredictionHistory;
