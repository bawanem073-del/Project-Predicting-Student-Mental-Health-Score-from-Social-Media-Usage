# Student Mental Health Score Prediction

A machine learning web application that predicts a student's **Mental Health Score** based on daily social media usage, study habits, physical activity, sleep patterns, and stress levels. Built with **FastAPI** for high-performance model serving and deployed on **Render**.

---

## Technical Stack & Architecture

* **Data Processing & Analytics:** Python, Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn
* **Backend API:** FastAPI, Uvicorn, Pydantic
* **Dataset Source:** Kaggle (`shivasingh4945/student-social-media-and-mental-health-impact`)
* **Deployment Platform:** Render

---

## Dataset Overview

The project analyzes a dataset containing 5,000 student entries across 13 core attributes:

| Feature Category | Features Included |
| :--- | :--- |
| **Demographics** | `Age`, `Gender`, `Country`, `Academic_Level` |
| **Social Media Usage** | `Most_Used_Platform`, `Purpose_Of_Use`, `Avg_Daily_Usage_Hours`, `Daily_Unlocks` |
| **Lifestyle & Well-being** | `Study_Hours`, `Physical_Activity_Hours`, `Sleep_Hours_Per_Night`, `Stress_Level` |
| **Target Variable** | `Mental_Health_Score` (Numerical continuous metric) |

---

## Exploratory Data Analysis (EDA) & Workflow

1. **Data Acquisition & Preprocessing:**
   * Automated download of student usage records from Kaggle via `kagglehub`.
   * Evaluated missing values, categorical feature cardinality, and distributions.
   * Removed duplicate records and addressed statistical outliers.

2. **Exploratory Data Analysis:**
   * Analyzed distribution and skewness of `Mental_Health_Score`.
   * Correlated screen time, daily unlocks, and stress levels against overall student well-being metrics.

3. **Model Development & API Pipeline:**
   * Built feature pipelines for categorical encoding and numerical scaling.
   * Trained and evaluated regression models to forecast continuous mental health scores.
   * Built a RESTful backend using **FastAPI** to serve real-time predictions.

---

## Architecture Flow
+---------------------------+       +-------------------+       +-----------------------+
|  Student Behavioral Inputs| ----> |  FastAPI Backend  | ----> | Predicted Mental      |
|  (Usage, Sleep, Stress)   |       |  (Inference Engine)|       | Health Score Output   |
+---------------------------+       +-------------------+       +-----------------------+

---

## Local Setup & Installation

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/your-username/Project-Predicting-Student-Mental-Health-Score-from-Social-Media-Usage.git](https://github.com/your-username/Project-Predicting-Student-Mental-Health-Score-from-Social-Media-Usage.git)
   cd Project-Predicting-Student-Mental-Health-Score-from-Social-Media-Usage

1. Create and Activate a Virtual Environment:

Bash
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate  

2. Install Dependencies:

Bash
pip install -r requirements.txt

3. Run the FastAPI Application:

Bash
uvicorn main:app --reload

4. Access Interactive API Docs:

Open your browser and navigate to http://127.0.0.1:8000/docs to test endpoints via Swagger UI.