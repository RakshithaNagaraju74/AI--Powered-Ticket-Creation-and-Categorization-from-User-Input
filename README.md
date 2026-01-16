# 🚀 AI-Powered Ticket Creation & Categorization System (BERT-Hybrid)

Modern IT helpdesks receive a massive volume of **unstructured, multilingual support messages**, making manual ticket creation slow, error-prone, and inefficient.
This project presents an **end-to-end AI-driven Service Desk automation system** that converts raw user messages into **fully structured IT support tickets** using a **Hybrid AI architecture**.

The solution combines **Transformer-based deep learning (BERT)** with **rule-based safety logic** to ensure both **accuracy and reliability**.

---

## 📌 Problem Statement

IT support teams manually read and interpret thousands of incoming support requests every day. This leads to:

* Delayed ticket creation
* Inconsistent categorization and prioritization
* Increased operational workload
* High dependency on human judgment

---

## 🎯 Project Goal

To **automate the complete ticket lifecycle** — from raw message ingestion to structured ticket generation — with **minimal human intervention**.

---

## 🎯 Objectives

* Preprocess and normalize raw user messages using a complete NLP pipeline
* Classify tickets into predefined technical categories using **fine-tuned BERT models**
* Predict ticket priority (Low, Medium, High, Critical)
* Extract key entities such as devices, usernames, and error codes
* Generate enterprise-ready **structured JSON tickets**
* Provide a user-friendly **UI dashboard and analytics view**

---

## 🧠 Hybrid AI Architecture

### 🔹 Transformer-Based Intelligence (BERT)

The system uses two independently fine-tuned BERT models:

1. **Category Classification Model**
   Predicts the technical domain of the issue (Hardware, Software, Network, etc.)

2. **Priority Classification Model**
   Determines the urgency level of the ticket based on contextual semantics

---

### 🔹 Rule-Based Safety Layer (Fail-Safe Logic)

To prevent critical misclassifications, a lightweight rule engine is layered on top of the AI models:

* **Critical Overrides**
  Keywords such as:

  ```
  server down, ransomware, security breach, data loss
  ```

  automatically escalate the ticket priority to **CRITICAL**

* **Confidence Gate**
  If category confidence is below **40%**, the ticket is flagged as:

  ```
  Needs Manual Review
  ```

This hybrid approach ensures **enterprise-grade reliability**.

---

### 🔹 NLP Processing Pipeline

1. **Language Detection & Translation**
   Automatically detects the input language and translates it to English

2. **Text Cleaning & Normalization**
   Removes noise, symbols, and irrelevant tokens

3. **Lemmatization & POS Filtering**
   Retains only meaningful linguistic units

4. **Keyword Extraction (KeyBERT)**
   Used for explainability and automatic title generation

5. **Entity Extraction**

   * Devices (laptop, printer, server, wifi, etc.)
   * Usernames (`@username`)
   * Error codes (`0x123`, `ERR_404`, `ABC-500`)

---

## 🔄 End-to-End System Pipeline

```text
User Input (Title + Description)
        ↓
Streamlit Frontend (Live Ticket Desk)
        ↓
FastAPI Backend (/classify endpoint)
        ↓
NLP Pipeline (Translate → Clean → Lemmatize)
        ↓
BERT Category & Priority Models
        ↓
Rule-Based Safety Overrides
        ↓
Entity Extraction
        ↓
Structured JSON Ticket Generation
        ↓
UI Display + Session Analytics + Export
```

---

## 📂 Project Structure

```text
AI-Powered-Ticket/
├── assets/                  # 📊 Training visualizations & evaluation reports
├── models/                  # 🧠 Fine-tuned BERT models (stored locally)
│   ├── category_model/      # Category classification weights
│   └── priority_model/      # Priority prediction weights
├── scripts/
│   └── inference.py         # ⚙️ Core AI engine (NLP + Prediction + Rules)
├── app.py                   # 🌐 Streamlit UI (Live Desk & Analytics)
├── main.py                  # 🔌 FastAPI backend (Inference API)
├── model.ipynb              # 📓 Model training notebook (Kaggle)
├── requirements.txt         # 📦 Python dependencies
└── .gitignore               # 🚫 Excludes large model files
```

---

## 🛠 Technologies Used

### 🔹 AI & Machine Learning

* PyTorch
* HuggingFace Transformers
* Scikit-learn

### 🔹 NLP

* spaCy
* KeyBERT
* LangDetect
* Deep-Translator

### 🔹 Backend & Frontend

* FastAPI (REST API)
* Streamlit (Dashboard UI)

### 🔹 Visualization

* Plotly
* Matplotlib
* WordCloud

---

## ✅ Modules Completed

| Module   | Description                     | Status      |
| -------- | ------------------------------- | ----------- |
| Module 1 | Data Collection & Preprocessing | ✅ Completed |
| Module 2 | NLP Model Development & NER     | ✅ Completed |
| Module 3 | Ticket Generation Engine        | ✅ Completed |
| Module 4 | UI & Integration Layer          | ✅ Completed |

---

## 🚀 How to Run the Project

### 1️⃣ Model Setup

Due to GitHub size restrictions, the trained BERT models are **not included**.

* Download the `models/` directory from external storage
* Place:

  * `category_model/`
  * `priority_model/`
    inside the `/models` folder

---

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

---

### 3️⃣ Launch the System

**Terminal 1 – Backend API**

```bash
python main.py
```

**Terminal 2 – Frontend UI**

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
*Project developed for AI-Driven IT Support Automation (2026)*

---

## 🌟 Key Highlights

* End-to-end AI system (UI + API + ML)
* Multilingual support
* Hybrid AI + rule-based safety
* Explainable predictions with confidence scores
* Enterprise-ready structured outputs
* Scalable and modular architecture

---

