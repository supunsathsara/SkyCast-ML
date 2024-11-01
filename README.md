# SkyCast

SkyCast is an AI-powered weather prediction application that provides personalized weather forecasts. The application consists of a FastAPI backend and a React frontend created with Vite. It uses Recharts for data visualization, Tailwind CSS for UI styling, and Open Meteo for weather information.

---

## Setup Instructions

### Prerequisites
- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **pip** (Python package installer)

---

### Backend Setup (FastAPI)
1. Navigate to the `api` folder:

    ```sh
    cd api
    ```

2. Create a virtual environment:

    ```sh
    python -m venv venv
    ```

3. Activate the virtual environment:

    - **On Windows**:
        ```sh
        venv\Scripts\activate
        ```

    - **On macOS/Linux**:
        ```sh
        source venv/bin/activate
        ```

4. Install the required libraries:

    ```sh
    pip install -r requirements.txt
    ```

5. Run the FastAPI application:

    ```sh
    uvicorn main:app --reload
    ```

    The backend will be running at [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

### Frontend Setup (React)
1. Navigate to the `client` folder:

    ```sh
    cd client
    ```

2. Install the required libraries:

    ```sh
    npm install
    ```

3. Run the React application:

    ```sh
    npm run dev
    ```

    The frontend will be running at [http://127.0.0.1:5173](http://127.0.0.1:5173).

---

## Configuration Steps for AI Model Integration

### Trained Model:
- The trained model is located in the `models` folder. The model was trained using the `train_model.py` script.

### FastAPI Application:
- The FastAPI application is defined in the `main.py` file in the `api` folder. This file includes endpoints for predictions, feature importance, and historical data.

---

## Endpoints

### Root Endpoint:
- **GET** `/`
    - Returns a welcome message.

### Data Endpoints:
- **GET** `/data`
- **POST** `/data`
- **PUT** `/data/{index}`
- **DELETE** `/data/{index}`
    - Manage user data.

### Feature Importance Endpoint:
- **GET** `/feature-importance`
    - Returns the feature importance of the AI model.

### Confusion Matrix Endpoint:
- **GET** `/confusion-matrix`
    - Returns the confusion matrix of the AI model.

### Prediction Endpoint:
- **POST** `/predict`
    - Returns the weather prediction based on the input data.

### WebSocket Endpoint:
- **ws** `/ws`
    - Provides real-time updates of user data.

---

## Libraries Used

### Backend (FastAPI)
- `fastapi`
- `uvicorn`
- `joblib`
- `numpy`
- `pydantic`
- `scikit-learn`

### Frontend (React)
- `react`
- `react-dom`
- `react-hook-form`
- `recharts`
- `tailwindcss`
- `zod`

---

## Running Instructions

### Backend
1. Navigate to the `api` folder:

    ```sh
    cd api
    ```

2. Activate the virtual environment:

    ```sh
    source venv/bin/activate
    ```

3. Run the FastAPI application:

    ```sh
    uvicorn main:app --reload
    ```

### Frontend
1. Navigate to the `client` folder:

    ```sh
    cd client
    ```

2. Run the React application:

    ```sh
    npm run dev
    ```

---

## Additional Information

### Weather Data Source:
- The application uses the Open Meteo API to fetch historical weather data for various cities.

### Charts:
- The application uses Recharts to visualize weather data and predictions.

### UI Styling:
- Tailwind CSS is used for styling the user interface.

---

## Contact

For any questions or issues, please contact [your-email@example.com].