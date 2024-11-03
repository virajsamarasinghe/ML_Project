import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    // State for storing headlines and prediction
    const [headlines, setHeadlines] = useState(['']);
    const [prediction, setPrediction] = useState(null);

    // Handle change in input fields
    const handleHeadlineChange = (index, value) => {
        const newHeadlines = [...headlines];
        newHeadlines[index] = value;
        setHeadlines(newHeadlines);
    };

    // Add a new headline input field
    const addHeadlineField = () => {
        setHeadlines([...headlines, '']);
    };

    // Submit headlines to FastAPI backend
    const submitHeadlines = async () => {
        try {
            const response = await axios.post("http://localhost:8000/predict", { headlines });
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error("Error making prediction", error);
        }
    };

    return (
        <div className="App">
            <h1>Stock Sentiment Analysis</h1>
            <p>Enter news headlines to predict the market trend:</p>
            
            {/* Render input fields for each headline */}
            {headlines.map((headline, index) => (
                <input
                    key={index}
                    type="text"
                    value={headline}
                    onChange={(e) => handleHeadlineChange(index, e.target.value)}
                    placeholder="Enter headline"
                />
            ))}

            {/* Buttons to add new field and submit headlines */}
            <button onClick={addHeadlineField}>Add Headline</button>
            <button onClick={submitHeadlines}>Predict Market</button>

            {/* Display prediction result */}
            {prediction !== null && (
                <div className="prediction-result">
                    <h2>Prediction: {prediction === 1 ? "Market Up" : "Market Down"}</h2>
                </div>
            )}
        </div>
    );
}

export default App;