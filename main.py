from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import uuid
import uvicorn
import sys

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

        ticket_json = {
            "ticket_id": f"INC-{uuid.uuid4().hex[:6].upper()}",
            "title": prediction["title"],
            "description": data.description,
            "category": prediction["category"],
            "category_confidence": prediction["category_confidence"],
            "priority": prediction["priority"].capitalize(),
            "priority_confidence": prediction["priority_confidence"],
            "status": "Open",
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        return ticket_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Host 0.0.0.0 allows access from your local network
    uvicorn.run(app, host="127.0.0.1", port=8000)