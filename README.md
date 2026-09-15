# PulseCoach AI — Intelligent Health & Fitness Coach

PulseCoach AI is a Generative AI-powered web application that delivers personalized health analyses, target healthy weight metrics, optimal caloric and macronutrient distribution, adaptive 7-day workout routines, and real-time interactive fitness coaching.

Built with **Python Flask**, **Google Gemini GenAI**, and a modern **Tailwind CSS & Lucide** dashboard. Ready for **Ubuntu AWS EC2** cloud hosting.

---

## Features

- **Biometric Health Assessment**: Computes estimated healthy weight range, Body Mass Index (BMI), Basal Metabolic Rate (BMR), and Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor equation.
- **Generative AI Coaching Engine**: Employs Google Gemini (`gemini-2.5-flash` / `gemini-1.5-flash`) with structured JSON schema to generate tailored nutrition and training routines.
- **7-Day Workout Protocol**: Detailed day-by-day routines with exercise names, sets, reps, rest periods, and biomechanical coaching cues.
- **Dietitian Meal Breakdown**: Breakfast, lunch, dinner, and snacks with calorie and macro targets.
- **Interactive Coach Assistant**: Embedded chat window for instant follow-up questions, exercise substitutions, and injury modifications.
- **Failsafe Demo Engine**: Built-in mock AI engine ensures 100% functionality even before configuring an API key.
- **Print & PDF Export**: Clean print stylesheet for saving workout schedules as documents.

---

## Tech Stack

- **Backend**: Python 3, Flask, Flask-CORS, python-dotenv, Requests, Gunicorn
- **AI Model**: Google Gemini API (`gemini-2.5-flash` via Google AI Studio)
- **Frontend**: HTML5, Modern Tailwind CSS (CDN), Lucide Icons, Vanilla JavaScript (Fetch API)
- **Deployment Platform**: Amazon Web Services (AWS) EC2 Ubuntu 22.04 / 24.04 LTS

---

## Local Setup & Installation

### Prerequisites
- Python 3.10+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/ai-health-coach.git
cd ai-health-coach
```

### 2. Create a Virtual Environment & Install Dependencies
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows PowerShell: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Open `.env` and add your free Google Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
FLASK_ENV=development
```
*(You can get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey)).*

### 4. Run the Web Server
```bash
python3 app.py
```
Open your browser and navigate to:
```
http://localhost:5000
```

---

## AWS Deployment Guide (EC2 Ubuntu)

Follow these steps to host your application live on AWS:

1. **Launch an AWS EC2 Instance**:
   - AMI: Ubuntu Server 24.04 LTS (Free Tier eligible).
   - Instance Type: `t2.micro` or `t3.micro`.
   - Key Pair: Create or select your key pair (`.pem`).
   - Network Settings: Allow **SSH (port 22)** and **HTTP (port 80)**, or create a Custom TCP rule for **port 5000**.

2. **Connect to Your EC2 Instance**:
   ```bash
   ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
   ```

3. **Install Dependencies on Ubuntu**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y python3-pip python3-venv git
   ```

4. **Clone the Repo & Setup**:
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/ai-health-coach.git
   cd ai-health-coach
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

5. **Set Environment Variables**:
   ```bash
   nano .env
   # Add GEMINI_API_KEY=your_key and PORT=80 (or 5000)
   ```

6. **Run with Gunicorn (Production)**:
   ```bash
   # Run on port 80 (requires sudo) or port 5000
   sudo ./venv/bin/gunicorn -w 3 -b 0.0.0.0:80 app:app --daemon
   ```

7. **Access Online**:
   Visit `http://YOUR_EC2_PUBLIC_IP` in any web browser!

---

## Course Documentation & Video
- **Complete Course Documentation**: See `DOCUMENTATION.md` for the full report covering Phase 1, Phase 2, Phase 3, Phase 4, and Conclusion.
- **4-Minute Video Script**: See `VIDEO_SCRIPT.md` for the presentation walkthrough.
