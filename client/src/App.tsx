"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import * as z from "zod";
import PredictionChart from "./components/PredictionChart";
import PredictionTable from "./components/PredictionTable";
import TempComparisonChart from "./components/TempComparisonChart";

const formSchema = z.object({
  temperature_2m_mean: z.number().min(-100).max(100),
  apparent_temperature_mean: z.number().min(-100).max(100),
  windspeed_10m_max: z.number().min(0).max(200),
  precipitation_sum: z.number().min(0).max(1000),
  date: z.date(),
});

export default function WeatherDashboard() {
  type PredictionResult = {
    prediction: string;
    temperature_2m_mean: number;
    apparent_temperature_mean: number;
    windspeed_10m_max: number;
    precipitation_sum: number;
    timestamp?: string;
    date?: string;
  };

  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [weatherPrediction, setWeatherPrediction] =
    useState<PredictionResult | null>(null);
  const [featureImportance, setFeatureImportance] = useState<
    { name: string; value: number }[]
  >([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/feature-importance")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = Object.entries(data).map(([name, value]) => ({
          name: name
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          value: value as number,
        }));
        setFeatureImportance(formattedData);
      })
      .catch((error) =>
        console.error("Error fetching feature importance:", error)
      );
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      temperature_2m_mean: 20,
      apparent_temperature_mean: 17,
      windspeed_10m_max: 15,
      precipitation_sum: 0.8,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setWeatherPrediction(result);
      setPredictions([
        ...predictions,
        {
          ...data,
          prediction: result.prediction,
          timestamp: new Date().toISOString(),
          date: data.date.toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-6">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-6xl font-bold text-white mb-2">Sky Cast</h1>
        <p className="text-lg text-white/70">Your personalized weather forecast</p>
      </div>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Glass-morphic card for the form */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white">
          <CardHeader>
            <CardTitle className="text-4xl font-light">
              Weather Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value.toISOString().split("T")[0]}
                              onChange={(e) =>
                                field.onChange(new Date(e.target.value))
                              }
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="temperature_2m_mean"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Temperature (°C)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(+e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="apparent_temperature_mean"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Apparent Temperature (°C)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(+e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="windspeed_10m_max"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Wind Speed (km/h)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(+e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="precipitation_sum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Precipitation (mm)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(+e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      Submit
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="space-y-4">
                <div className="text-6xl font-light">
                  {form.watch("temperature_2m_mean")}°
                </div>
                <div className="text-xl opacity-70">
                  Wind: {form.watch("windspeed_10m_max")} km/h
                </div>
                <div className="text-xl opacity-70">
                  Precipitation: {form.watch("precipitation_sum")}%
                </div>
                <div>
                  {weatherPrediction && (
                    <div className="p-4 bg-white/10 border border-white/20 rounded-lg text-white">
                      <div className="text-2xl font-semibold mb-2">
                        The weather is going to be like
                      </div>
                      <div className="text-2xl font-bold">
                        {weatherPrediction.prediction}
                      </div>
                    </div>
                  )}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                      View Feature Importance
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] bg-gray-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Feature Importance</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={featureImportance}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {featureImportance.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predictions Chart */}
        {predictions.length > 0 && (
          <PredictionChart predictions={predictions} />
        )}

        {/* Temperature comparison chart */}
        <TempComparisonChart />

        {/* Historical Data */}
        {predictions.length > 0 && (
          <PredictionTable predictions={predictions} />
        )}
      </div>
    </div>
  );
}
