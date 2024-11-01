import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load the dataset
df = pd.read_csv('./Weather_Dataset.csv')

# Preprocess the data
# Handle missing values (if any)
df = df.dropna()

# Features (X) - Input Data
X = df[['temperature_2m_mean', 'apparent_temperature_mean', 'windspeed_10m_max', 'precipitation_sum']]  # Added precipitation_sum

# Target (y) - What we are predicting
y = df['weathercode']  # Target variable (weather condition code)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Hyperparameter tuning
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

rf_clf = RandomForestClassifier(class_weight='balanced')
grid_search = GridSearchCV(estimator=rf_clf, param_grid=param_grid, cv=3, n_jobs=-1, verbose=2)
grid_search.fit(X_train, y_train)

# Best parameters from grid search
best_rf_clf = grid_search.best_estimator_

# Save the model
joblib.dump(best_rf_clf, './models/random_forest_model_weather.pkl')

# Make predictions
y_pred_rf = best_rf_clf.predict(X_test)

# Evaluate the model
print("Random Forest Accuracy:", accuracy_score(y_test, y_pred_rf))
print("Classification Report:\n", classification_report(y_test, y_pred_rf))

# Check feature importance
feature_importances = best_rf_clf.feature_importances_
features = ['temperature_2m_mean', 'apparent_temperature_mean', 'windspeed_10m_max', 'precipitation_sum']
importance_df = pd.DataFrame({'Feature': features, 'Importance': feature_importances})
print(importance_df)