# 🚀 AI-Powered Ticket Creation & Categorization System (BERT-Hybrid)

Modern IT helpdesks are overwhelmed by unstructured, multilingual support messages. This project automates the entire lifecycle—from raw message ingestion to structured ticket generation—using a **Hybrid AI approach** that combines deep learning Transformers with fail-safe logic.

---

## 📌 Problem Statement

Support teams manually read thousands of incoming messages, leading to delays in ticket creation, human errors in tagging, and increased workload.

## 🎯 Goal

To build a system that automatically analyzes user messages and generates **structured IT support tickets** with minimum human involvement.

## 🎯 Objectives

* Clean and preprocess raw user messages using a full NLP pipeline.
* Classify messages into predefined ticket categories using fine-tuned **BERT** models.
* Predict ticket priority (Low, Medium, High, Critical).
* Extract relevant entities such as devices, usernames, and error codes.
* Generate a complete, structured ticket in JSON-ready format.

---

## 📂 Project Structure

```text
AI-Powered-Ticket/
├── assets/                  # 📊 Training visualizations (Confusion Matrices, Reports)
├── models/                  # 🧠 Fine-tuned BERT Models (Stored Locally)
│   ├── category_model/      # Weights for issue classification
│   └── priority_model/      # Weights for priority prediction
├── scripts/
│   └── inference.py         # ⚙️ The AI Engine (Preprocessing + Prediction Logic)
├── app.py                   # 🌐 Streamlit UI (Live Desk & Analytics Dashboard)
├── main.py                  # 🔌 FastAPI Backend (Inference API)
├── model.ipynb              # 📓 Kaggle Training Notebook
├── requirements.txt         # 📦 Project Dependencies
└── .gitignore               # 🚫 Prevents large model files from pushing to Git

```

---

## 🧠 Hybrid AI Architecture

### 🔹 BERT Transformer Models

The system utilizes fine-tuned BERT models for high-accuracy semantic understanding:

1. **Category Head:** Predicts the technical domain (Hardware, Network, Software, etc.).
2. **Priority Head:** Predicts urgency based on the context of the message.

### 🔹 Rule-Based Safety Layer

To ensure reliability, the AI is augmented with a safety layer:

* **Critical Overrides:** Specific keywords (e.g., "Server Down", "Ransomware") automatically trigger a **Critical** priority status.
* **Confidence Gate:** If the model's confidence score is below 40%, the ticket is flagged for **"Needs Manual Review"**.

### 🔹 NLP Pipeline

1. **Translation:** Auto-detects and translates input into English.
2. **Cleaning:** Normalizes text and removes noise.
3. **Entity Extraction:** Uses regex and NLP to harvest devices, usernames, and error codes.

---

## 🛠 Technologies Used

* **AI/ML:** PyTorch, Transformers (HuggingFace), Scikit-learn.
* **NLP:** Spacy, KeyBERT, Langdetect, Deep-Translator.
* **Web Frameworks:** FastAPI (Backend), Streamlit (Frontend).
* **Data Visualization:** Plotly, WordCloud, Matplotlib.

---
✅ Modules Completed
Module	Description	Status
Module 1	Data Collection & Preprocessing	✅ Completed
Module 2	NLP Model Development + NER	✅ Completed
Module 3	Ticket Generation Engine	✅ Completed
Module 4	UI & Integration Layer	✅ Completed

---

## 🚀 How to Run

### 1. Model Setup

The BERT models are not included in the repository due to size limits.

* Download the `models` folder from your external storage.
* Place the `category_model` and `priority_model` folders into the `/models` directory.

### 2. Install Dependencies

```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm

```

### 3. Launch System

**Terminal 1 (Backend):**

```bash
python main.py

```

**Terminal 2 (Frontend):**

```bash
streamlit run app.py

```

---

## 🧾 Example AI Output (Structured JSON)

```json
{
  "title": "laptop problem",
  "category": "hardware issue",
  "priority": "medium",
  "entities": {
    "devices": ["laptop"],
    "usernames": [],
    "error_codes": []
  },
  "status": "open",
  "created_at": "2026-01-15T23:39:53",
  "category_confidence": 0.98,
  "priority_confidence": 0.942,
  "description": "signal is very low"
}

```

---

## 👩‍💻 Author

**Rakshitha N.**
*Project developed for AI-driven IT Support Automation (2026).*

Would you like me to help you create a **"Deployment Guide"** for hosting this FastAPI backend on a cloud service?
