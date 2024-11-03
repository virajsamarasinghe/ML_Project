import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [headlines, setHeadlines] = useState(['']);
    const [prediction, setPrediction] = useState(null);
    const [selectedModel, setSelectedModel] = useState('model1'); // Add model state

    const handleHeadlineChange = (index, value) => {
        const newHeadlines = [...headlines];
        newHeadlines[index] = value;
        setHeadlines(newHeadlines);
    };

    const addHeadlineField = () => {
        setHeadlines([...headlines, '']);
    };

    const submitHeadlines = async () => {
        try {
            const response = await axios.post("http://localhost:8000/predict", {
                headlines,
                model: selectedModel // Include model in request
            });
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error("Error making prediction", error);
        }
    };

    return (
        <div className="App">
            <h1>Stock Sentiment Analysis</h1>
            
            {/* Model selector dropdown */}
            <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="model-selector"
            >
                <option value="model1">Model 1</option>
                <option value="model2">Model 2</option>
                <option value="model3">Model 3</option>
            </select>

            <p>Enter news headlines to predict the market trend:</p>
            
            {headlines.map((headline, index) => (
                <input
                    key={index}
                    type="text"
                    value={headline}
                    onChange={(e) => handleHeadlineChange(index, e.target.value)}
                    placeholder="Enter headline"
                />
            ))}

            <button onClick={addHeadlineField}>Add Headline</button>
            <button onClick={submitHeadlines}>Predict Market</button>

            {prediction !== null && (
                <div className="prediction-result">
                    <h2>Prediction: {prediction === 1 ? "Market Up" : "Market Down"}</h2>
                </div>
            )}
        </div>
    );
}

export default App;