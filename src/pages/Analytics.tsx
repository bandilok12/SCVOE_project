import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import cropBg from '@/assets/pad.jpg';
import { BarChart3, TrendingUp, PieChart, Activity, Droplets, Thermometer, Leaf, MapPin, Sprout, Sun } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPie, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import cropAnalytics from '@/assets/crop-analytics.jpg';
import smartFarming from '@/assets/smart-farming.jpg';

// Data aggregated from the dataset
const cropYieldData = [
  { crop: 'Wheat', avgYield: 2580, color: '#22c55e' },
  { crop: 'Rice', avgYield: 2420, color: '#3b82f6' },
  { crop: 'Maize', avgYield: 2180, color: '#f59e0b' },
  { crop: 'Cotton', avgYield: 2450, color: '#ec4899' },
  { crop: 'Sugarcane', avgYield: 2680, color: '#8b5cf6' },
  { crop: 'Pulses', avgYield: 2520, color: '#06b6d4' },
  { crop: 'Millets', avgYield: 2380, color: '#84cc16' },
];

const stateDistribution = [
  { name: 'Maharashtra', value: 18, color: '#22c55e' },
  { name: 'Karnataka', value: 16, color: '#3b82f6' },
  { name: 'West Bengal', value: 14, color: '#f59e0b' },
  { name: 'Punjab', value: 12, color: '#ec4899' },
  { name: 'Gujarat', value: 12, color: '#8b5cf6' },
  { name: 'Rajasthan', value: 10, color: '#06b6d4' },
  { name: 'Tamil Nadu', value: 10, color: '#84cc16' },
  { name: 'Uttar Pradesh', value: 8, color: '#f97316' },
];

const marketTrendsData = [
  { year: '2020', Cotton: 5150, Pulses: 5580, Wheat: 1920, Rice: 1780 },
  { year: '2021', Cotton: 5280, Pulses: 5720, Wheat: 1980, Rice: 1820 },
  { year: '2022', Cotton: 5180, Pulses: 5640, Wheat: 2040, Rice: 1860 },
  { year: '2023', Cotton: 5220, Pulses: 5580, Wheat: 2000, Rice: 1840 },
  { year: '2024', Cotton: 5320, Pulses: 5680, Wheat: 2060, Rice: 1880 },
];

const soilTypeData = [
  { type: 'Black', avgYield: 2650 },
  { type: 'Alluvial', avgYield: 2780 },
  { type: 'Red', avgYield: 2320 },
  { type: 'Laterite', avgYield: 2480 },
  { type: 'Saline', avgYield: 2180 },
  { type: 'Peaty', avgYield: 2520 },
  { type: 'Arid', avgYield: 2380 },
];

const irrigationData = [
  { name: 'Drip', value: 28 },
  { name: 'Sprinkler', value: 25 },
  { name: 'Canal', value: 22 },
  { name: 'None', value: 25 },
];

const climateImpactData = [
  { parameter: 'Temperature', optimal: 28, current: 26 },
  { parameter: 'Humidity', optimal: 70, current: 65 },
  { parameter: 'Rainfall', optimal: 80, current: 75 },
  { parameter: 'pH Level', optimal: 85, current: 78 },
  { parameter: 'Nitrogen', optimal: 75, current: 70 },
  { parameter: 'Organic Carbon', optimal: 65, current: 58 },
];

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('powerbi');

  return (
    <main className="min-h-screen bg-background ">
      {/* Header */}
      <section
  className="relative min-h-[95vh] flex items-center justify-center"
  style={{
    backgroundImage: `url(${cropBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <BarChart3 className="w-9 h-9 text-red-500" />
            <span className="text-xl font-bold text-black">Analytics Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-8xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 via-emerald-500 via-black-600 to-purple-600 bg-clip-text text-transparent
 mb-4"> 
            Agricultural Analytics Dashboard
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-3xl font-bold">
            Visualize crop trends, market rates, and yield patterns with interactive Power BI and custom data visualizations.
          </p>
        </div>
      </section>

      {/* About Analytics */}
      <section className="py-12 bg-accent">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Data-Driven Agricultural Insights
              </h2>
              <p className="text-muted-foreground mb-4">
                Our analytics platform processes agricultural data from across India, providing actionable 
                insights on crop performance, market trends, and environmental factors. Make informed 
                decisions based on real data from thousands of farms.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl p-4 border border-border">
                  <Sprout className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold text-foreground">Yield Analysis</h4>
                  <p className="text-sm text-muted-foreground">Compare crop yields across regions</p>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border">
                  <Sun className="w-8 h-8 text-secondary mb-2" />
                  <h4 className="font-semibold text-foreground">Climate Impact</h4>
                  <p className="text-sm text-muted-foreground">Understand weather effects on crops</p>
                </div>
              </div>
            </div>
            <div>
              <img
                src={smartFarming}
                alt="Modern agricultural analytics with drone technology"
                className="rounded-2xl shadow-card w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: TrendingUp, label: 'Avg Yield Growth', value: '+12.5%', color: 'text-primary' },
              { icon: PieChart, label: 'Crops Analyzed', value: '8+', color: 'text-secondary' },
              { icon: Activity, label: 'Data Points', value: '50K+', color: 'text-primary' },
              { icon: BarChart3, label: 'States Covered', value: '8', color: 'text-secondary' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-card rounded-2xl shadow-soft border border-border p-6">
                <Icon className={`w-8 h-8 ${color} mb-3`} />
                <p className="text-sm text-muted-foreground mb-1">{label}</p>
                <p className="text-3xl font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>

          {/* Tabs for switching views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="powerbi">Power BI Dashboard</TabsTrigger>
              <TabsTrigger value="charts">Data Visualizations</TabsTrigger>
            </TabsList>

            {/* Power BI Tab */}
            <TabsContent value="powerbi" className="space-y-6">
              <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-bold text-foreground">Crop Analysis Dashboard</h2>
                  <p className="text-sm text-muted-foreground">Interactive visualizations powered by Power BI</p>
                </div>

                {/* Power BI Embed */}
                <div className="aspect-[16/9] w-full">
                  <iframe
                    title="Agricultural Analytics Power BI Dashboard"
                    src="https://app.powerbi.com/view?r=eyJrIjoiNzY0NzBkMmItYjNhMS00NGM2LWFiODEtYzcxMjExNzllZjcwIiwidCI6IjIyMmIwNjU0LWU0NDItNDJjZS1iMWViLTk3Y2FhZTQ2ODcyNSJ9"
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              </div>
            </TabsContent>

            {/* Charts Tab */}
            <TabsContent value="charts" className="space-y-8">
              {/* Row 1: Crop Yield & State Distribution */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Crop Yield Bar Chart */}
                <div className="bg-card rounded-2xl shadow-soft border border-border p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Leaf className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Average Crop Yield (kg/ha)</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cropYieldData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="crop" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="avgYield" radius={[4, 4, 0, 0]}>
                        {cropYieldData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* State Distribution Pie Chart */}
                <div className="bg-card rounded-2xl shadow-soft border border-border p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Data Distribution by State (%)</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={stateDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {stateDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Row 2: Market Trends Line Chart */}
              <div className="bg-card rounded-2xl shadow-soft border border-border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Market Rate Trends (₹/quintal) - 2020 to 2024</h3>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={marketTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Cotton" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Pulses" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Wheat" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Rice" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Row 3: Soil Type & Irrigation */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Soil Type Area Chart */}
                <div className="bg-card rounded-2xl shadow-soft border border-border p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Droplets className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Yield by Soil Type (kg/ha)</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={soilTypeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="type" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="avgYield" 
                        stroke="#22c55e" 
                        fill="url(#colorYield)" 
                      />
                      <defs>
                        <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Irrigation Distribution */}
                <div className="bg-card rounded-2xl shadow-soft border border-border p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Droplets className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Irrigation Type Distribution (%)</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={irrigationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {irrigationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Row 4: Climate Impact Radar */}
              <div className="bg-card rounded-2xl shadow-soft border border-border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Thermometer className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Climate & Soil Parameters - Optimal vs Current</h3>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={climateImpactData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="parameter" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <PolarRadiusAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Radar name="Optimal" dataKey="optimal" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                    <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Row 5: Summary Cards */}
             
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Analytics;
