from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import uuid
import uvicorn

# Ensure the scripts folder is in the path so we can find inference.py
from scripts.inference import predict_ticket_final

app = FastAPI(title="AI Ticket Classification API")

class TicketInput(BaseModel):
    title: str
    description: str

@app.post("/classify")
async def classify_ticket(data: TicketInput):
    try:
        # Calls your inference script
        prediction = predict_ticket_final(
            title=data.title,
            description=data.description
        )

        # UPDATED: Structured to match your requested JSON format
        ticket_json = {
            "title": prediction["title"],
            "category": prediction["category"].lower(),
            "priority": prediction["priority"].lower(),
            "entities": prediction["entities"], # Now fetched from inference
            "status": "open",
            "created_at": datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
        }
        
        # We still return the confidence scores for the UI to use
        ticket_json["category_confidence"] = prediction["category_confidence"]
        ticket_json["priority_confidence"] = prediction["priority_confidence"]

        return ticket_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)