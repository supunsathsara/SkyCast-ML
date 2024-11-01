import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const PredictionTable: React.FC<PredictionTableProps> = ({ predictions }) => {
  return (
    <Card className="backdrop-blur-lg bg-white/10 border-white/20">
    <CardHeader>
      <CardTitle className="text-white">Historical Data</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr>
              <th className="text-left p-2">Time</th>
              <th className="text-left p-2">Temperature</th>
              <th className="text-left p-2">Apparent Temp</th>
              <th className="text-left p-2">Wind Speed</th>
              <th className="text-left p-2">Precipitation</th>
              <th className="text-left p-2">Prediction</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((pred, index) => (
              <tr key={index} className="border-t border-white/10">
                <td className="p-2">
                  {new Date(pred.timestamp ?? "").toLocaleTimeString()}
                </td>
                <td className="p-2">{pred.temperature_2m_mean}°C</td>
                <td className="p-2">
                  {pred.apparent_temperature_mean}°C
                </td>
                <td className="p-2">{pred.windspeed_10m_max} km/h</td>
                <td className="p-2">{pred.precipitation_sum}mm</td>
                <td className="p-2">{pred.prediction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
  )
}
export default PredictionTable