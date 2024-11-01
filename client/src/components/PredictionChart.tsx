
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

type PredictionResult = {
    prediction: string;
    temperature_2m_mean: number;
    apparent_temperature_mean: number;
    windspeed_10m_max: number;
    precipitation_sum: number;
    timestamp?: string;
    date?: string;
  };


interface PredictionTableProps {
  predictions: PredictionResult[];
}

const PredictionChart:React.FC<PredictionTableProps> = ({ predictions })=> {
  return (
    <Card className="backdrop-blur-lg bg-white/10 border-white/20">
    <CardHeader>
      <CardTitle className="text-white">Predictions Chart</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={predictions.map((pred) => ({
            ...pred,
            date: new Date(pred.date ?? "").toLocaleDateString(),
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "none",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature_2m_mean"
            name="Temperature (°C)"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="apparent_temperature_mean"
            name="Apparent Temp (°C)"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="windspeed_10m_max"
            name="Wind Speed (km/h)"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
          />
          <Line
            dataKey="precipitation_sum"
            name="Precipitation (mm)"
            stroke="hsl(var(--chart-4))"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
  )
}
export default PredictionChart