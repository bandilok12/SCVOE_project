-- Create prediction_history table to store user predictions
CREATE TABLE public.prediction_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  state TEXT NOT NULL,
  soil_type TEXT NOT NULL,
  temperature NUMERIC NOT NULL,
  humidity NUMERIC NOT NULL,
  rainfall NUMERIC NOT NULL,
  ph NUMERIC NOT NULL,
  nitrogen NUMERIC NOT NULL,
  phosphorus NUMERIC NOT NULL,
  potassium NUMERIC NOT NULL,
  predicted_crop TEXT NOT NULL,
  predicted_yield NUMERIC NOT NULL,
  confidence NUMERIC NOT NULL,
  market_rate NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.prediction_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own predictions" 
ON public.prediction_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own predictions" 
ON public.prediction_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own predictions" 
ON public.prediction_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster user queries
CREATE INDEX idx_prediction_history_user_id ON public.prediction_history(user_id);
CREATE INDEX idx_prediction_history_created_at ON public.prediction_history(created_at DESC);