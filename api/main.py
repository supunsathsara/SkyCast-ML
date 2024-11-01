import asyncio
import json
from datetime import datetime
from typing import List, Optional

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException, Request, WebSocket
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocketDisconnect

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

model = joblib.load('./models/random_forest_model_weather.pkl')

# Define the mapping of numerical values to weather conditions
weather_conditions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
}

class WeatherData(BaseModel):
    temperature_2m_mean: float
    apparent_temperature_mean: float
    windspeed_10m_max: float
    precipitation_sum: float

# In-memory storage for user data
user_data = []

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/data", response_model=List[WeatherData])
async def get_data():
    return user_data

@app.post("/data", response_model=WeatherData)
async def add_data(data: WeatherData):
    user_data.append(data)
    return data

@app.put("/data/{index}", response_model=WeatherData)
async def update_data(index: int, data: WeatherData):
    if index < 0 or index >= len(user_data):
        raise HTTPException(status_code=404, detail="Data not found")
    user_data[index] = data
    return data

@app.delete("/data/{index}", response_model=WeatherData)
async def delete_data(index: int):
    if index < 0 or index >= len(user_data):
        raise HTTPException(status_code=404, detail="Data not found")
    return user_data.pop(index)

@app.get("/feature-importance")
async def get_feature_importance():
    feature_importances = model.feature_importances_
    features = ['temperature_2m_mean', 'apparent_temperature_mean', 'windspeed_10m_max', 'precipitation_sum']
    importance_data = {feature: importance for feature, importance in zip(features, feature_importances)}
    return JSONResponse(importance_data)

@app.get("/confusion-matrix")
async def get_confusion_matrix():
    with open('confusion_matrix.json', 'r') as f:
        conf_matrix_data = json.load(f)
    return JSONResponse(conf_matrix_data)

@app.post('/predict')
async def predict(data: WeatherData):
    try:
        # Prepare the input as a NumPy array (match with your model's input shape)
        input_data = np.array([[data.temperature_2m_mean, data.apparent_temperature_mean, data.windspeed_10m_max, data.precipitation_sum]])

        # Make prediction
        prediction = model.predict(input_data)
        
        # Convert prediction to native Python type
        prediction_result = prediction[0].item()
        
        # Map the prediction to the corresponding weather condition
        weather_condition = weather_conditions.get(prediction_result, "Unknown Condition")
        
        # Add the prediction result to the user data for historical tracking
        user_data.append({
            "temperature_2m_mean": data.temperature_2m_mean,
            "apparent_temperature_mean": data.apparent_temperature_mean,
            "windspeed_10m_max": data.windspeed_10m_max,
            "precipitation_sum": data.precipitation_sum,
            "prediction": weather_condition
        })
        
        # Return the result to the user
        return JSONResponse({
            'status': 'success',
            'prediction': weather_condition,
            'temperature_2m_mean': data.temperature_2m_mean,
            'apparent_temperature_mean': data.apparent_temperature_mean,
            'windspeed_10m_max': data.windspeed_10m_max,
            'precipitation_sum': data.precipitation_sum,
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_json(user_data)
            await asyncio.sleep(5)  # Adjust the interval as needed
    except WebSocketDisconnect:
        print("WebSocket connection closed")