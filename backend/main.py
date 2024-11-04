from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI()

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (consider restricting to specific origins in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Load multiple models and vectorizers
models = {
    'model1': joblib.load("model.joblib"),
    'model2': joblib.load("modelx.joblib"),
}

vectorizers = {
    'model1': joblib.load("vectorizer.joblib"),
    'model2': joblib.load("vectorizerx.joblib"),
}

class NewsRequest(BaseModel):
    headlines: list[str]
    model: str  # Model selection field

class PredictionResponse(BaseModel):
    prediction: int

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: NewsRequest):
    if request.model not in models:
        raise HTTPException(status_code=400, detail="Invalid model selection")
    
    # Get the selected model and vectorizer
    selected_model = models[request.model]
    selected_vectorizer = vectorizers[request.model]
    
    # Combine headlines, transform data, and predict
    combined_headlines = ' '.join(request.headlines)
    transformed_data = selected_vectorizer.transform([combined_headlines])
    prediction = selected_model.predict(transformed_data)[0]
    
    return {"prediction": int(prediction)}
