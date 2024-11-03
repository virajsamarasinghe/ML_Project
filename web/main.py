from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

# Load the model and vectorizer
model = joblib.load("model.joblib")
vectorizer = joblib.load("vectorizer.joblib")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

class NewsRequest(BaseModel):
    headlines: list[str]

class PredictionResponse(BaseModel):
    prediction: int

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: NewsRequest):
    combined_headlines = ' '.join(request.headlines)
    transformed_data = vectorizer.transform([combined_headlines])
    prediction = model.predict(transformed_data)[0]
    return {"prediction": int(prediction)}