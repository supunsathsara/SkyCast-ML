/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
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




type HistoricalData = {
    date: string;
    sydney: number;
    melbourne: number;
    brisbane: number;
    perth: number;
    adelaide: number;
  };
  
const TempComparisonChart = () => {

    const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const cities = [
            { name: "sydney", lat: -33.8678, lon: 151.2073 },
            { name: "melbourne", lat: -37.8136, lon: 144.9631 },
            { name: "brisbane", lat: -27.4698, lon: 153.0251 },
            { name: "perth", lat: -31.9505, lon: 115.8605 },
            { name: "adelaide", lat: -34.9285, lon: 138.6007 },
          ];
  
          const endDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
          const startDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  
          const fetchCityData = async (city: { name: string; lat: number; lon: number }) => {
            const response = await fetch(
              `https://archive-api.open-meteo.com/v1/archive?latitude=${city.lat}&longitude=${city.lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max`
            );
            const data = await response.json();
            return data.daily.temperature_2m_max.map((temp: number, index: number) => ({
              date: data.daily.time[index],
              [city.name]: temp,
            }));
          };
  
          const cityDataPromises = cities.map((city) => fetchCityData(city));
          const cityDataArrays = await Promise.all(cityDataPromises);
  
          // Merge data by date
          const mergedData: { [key: string]: any } = {};
          cityDataArrays.forEach((cityDataArray) => {
            cityDataArray.forEach((dataPoint: any) => {
              if (!mergedData[dataPoint.date]) {
                mergedData[dataPoint.date] = { date: dataPoint.date };
              }
              Object.assign(mergedData[dataPoint.date], dataPoint);
            });
          });
  
          setHistoricalData(Object.values(mergedData));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, []);
  return (
    <Card className="backdrop-blur-lg bg-white/10 border-white/20">
    <CardHeader>
      <CardTitle className="text-white">Temperature Comparison</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sydney" stroke="#8884d8" />
        <Line type="monotone" dataKey="melbourne" stroke="#82ca9d" />
        <Line type="monotone" dataKey="brisbane" stroke="#ffc658" />
        <Line type="monotone" dataKey="perth" stroke="#ff7300" />
        <Line type="monotone" dataKey="adelaide" stroke="#387908" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>

  )
}
export default TempComparisonChart