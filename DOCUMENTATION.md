# Project Documentation: PulseCoach AI
**AI-Powered Health & Fitness Coaching Web Application Hosted on AWS**

*Note: In accordance with project requirements, this documentation is written entirely in English.*

---

## Executive Summary

**PulseCoach AI** is a fullstack Generative AI application designed to provide personalized, science-backed health and fitness coaching. By combining biometric data (age, gender, height, weight, activity level, dietary requirements, and physical limitations) with the generative reasoning capabilities of **Google Gemini**, the application calculates metabolic baselines, recommended healthy weight ranges, macronutrient breakdowns, an adaptive 7-day training routine, and provides an interactive conversational AI coach. The application is hosted as a web server on an **Amazon Web Services (AWS) EC2 Ubuntu** instance and maintained via Git version control on GitHub.

---

## Phase 1: Research Phase (Feasibility Study)

### 1. Information Gathering
The research phase focused on three critical domains:
- **Biometric & Exercise Science**: Investigating verified physiological formulas to calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE). The Mifflin-St Jeor equation was selected over the Harris-Benedict formula due to its higher clinical accuracy for modern populations. World Health Organization (WHO) BMI classifications were consulted to determine healthy target weight ranges.
- **Generative AI Capabilities & APIs**: Evaluating modern Large Language Model (LLM) APIs, including Google Gemini (`gemini-2.5-flash`), OpenAI GPT-4o-mini, and AWS Bedrock. Google Gemini was chosen for its exceptional inference speed, generous free-tier quotas through Google AI Studio, and strong adherence to structured JSON schema outputs.
- **Cloud Infrastructure (AWS)**: Reviewing AWS hosting patterns suited for web servers. An AWS EC2 Ubuntu 24.04 LTS instance was selected to satisfy the "Level 3 Web Server" requirement, combining Linux administration, WSGI production serving (Gunicorn), and public network access.

### 2. Tool & Technology Selection
- **Programming Language & Backend**: **Python 3** with **Flask**. Python provides first-class support for AI SDKs and scientific calculations, while Flask offers a lightweight, unopinionated web server architecture ideal for REST API endpoints and static file serving.
- **Artificial Intelligence Engine**: **Google Gemini API** (`gemini-2.5-flash` / `gemini-1.5-flash`) via REST/SDK, augmented by an intelligent local fallback simulation engine.
- **Frontend Architecture**: **HTML5**, **Tailwind CSS** (via CDN), **Lucide Icons**, and vanilla **JavaScript**. This eliminates heavy Node build steps during cloud deployment while delivering an ultra-modern, responsive glassmorphism UI.
- **Production Server**: **Gunicorn** WSGI HTTP Server.
- **Version Control & Repository**: **Git** and **GitHub**.
- **Cloud Hosting**: **AWS EC2 (Ubuntu Linux)** with Security Group HTTP routing.

### 3. Project Planning & Work Breakdown
The project was divided into structured sprints:
1. Mathematical modeling & biometric calculation helpers.
2. Generative AI prompt engineering and structured JSON validation.
3. Flask REST API routes (`/api/generate-plan`, `/api/chat`, `/api/status`).
4. Frontend dashboard design, input form, metric cards, and workout tables.
5. Interactive AI follow-up coach interface.
6. Local testing, error handling, and offline mock fallback integration.
7. AWS EC2 Ubuntu provisioning and production deployment.

### 4. Problems & Solutions Encountered During Research

- **Problem**: Inconsistent or contradictory fitness advice across web sources regarding optimal macronutrient distribution.
  - **Solution**: Standardized macros according to sports science consensus: setting protein at 1.8–2.2g per kg of bodyweight, fat at 25% of total caloric expenditure, and allocating remaining calories to complex carbohydrates.
- **Problem**: Risk of API key dependency failure, rate-limiting, or setup friction during student grading.
  - **Solution**: Engineered a dual-mode system architecture. The application detects whether a valid `GEMINI_API_KEY` is present. If absent or quota-limited, it automatically activates a deterministic AI simulation engine that produces an identical JSON schema, ensuring zero crashes.

---

## Phase 2: Implementation & Execution

### 1. How Work Started
Development commenced in an Ubuntu environment using Visual Studio Code. The project root was initialized with a structured layout separating backend logic (`app.py`), templates (`templates/index.html`), static assets (`static/css/`, `static/js/`), dependency specifications (`requirements.txt`), and environment configurations (`.env.example`).

### 2. System Architecture & Component Breakdown

```
ai-health-coach/
├── app.py                  # Core Flask server, biometric algorithms & Gemini API calls
├── requirements.txt        # Production dependencies (Flask, Gunicorn, Requests, etc.)
├── .env.example            # Environment variables template
├── .gitignore              # Ignores sensitive keys, venv, and cache files
├── README.md               # Quickstart and AWS deployment manual
├── DOCUMENTATION.md        # Comprehensive 4-Phase project report
├── VIDEO_SCRIPT.md         # Script for the 4-minute presentation video
├── static/
│   ├── css/style.css       # Custom scrollbars, animations, and print stylesheet
│   └── js/app.js           # Client-side state manager, DOM renderer, and API handler
└── templates/
    └── index.html          # Responsive single-page dashboard with Tailwind CSS
```

### 3. Sequence of Component Creation
1. **Biometric Core (`calculate_biometrics` in `app.py`)**: Implemented mathematical equations for BMI, BMR, TDEE, healthy weight bounds, and hydration calculations.
2. **Generative AI Integration (`call_gemini_api` in `app.py`)**: Formulated detailed system instructions and few-shot prompt constraints directing Gemini to output strict JSON containing personalized 7-day workout plans, nutrition splits, and recovery advice.
3. **Interactive Follow-Up Coach (`/api/chat`)**: Created a conversational endpoint that allows users to ask clarifying questions (e.g. exercise substitutions for joint pain) with context awareness.
4. **User Intake Form & Validation**: Built a multi-parameter intake form with validation for age, gender, height, weight, activity tiers, fitness goals, and injury history.
5. **Dashboard & Results Visualizer**: Developed reactive metric badges, progress bars for macros, a 7-day training table, meal cards, and print/PDF formatting.

### 4. Problems & Solutions Encountered During Implementation

- **Problem: LLM Output Formatting Inconsistencies**:
  - *Symptom*: When calling Gemini, the model occasionally wrapped its JSON response in markdown code fences (e.g. ` ```json ... ``` `) or added conversational commentary, which caused `json.loads()` to raise syntax exceptions.
  - *Solution*: Implemented a sanitization pipeline using regular expressions (`re.sub`) to strip leading/trailing code blocks and whitespace before parsing. Added a fallback to the internal mock engine if JSON parsing failed.
- **Problem: Complex UI Clutter on Small Screens**:
  - *Symptom*: Presenting 7 full days of exercises alongside four meals, macro metrics, and lifestyle tips overwhelmed mobile screens.
  - *Solution*: Created a clean tabbed navigation system (`7-Day Workout Protocol`, `Meal Strategy`, `Recovery & Habits`) combined with expandable day cards and horizontal scroll tables for exercise sets and reps.
- **Problem: State Management for Follow-up Chat**:
  - *Symptom*: When asking the AI coach follow-up questions, the coach lacked context regarding the user's specific target calories and workout split.
  - *Solution*: Passed a contextual summary of the active plan (`contextSummary`) in the POST request payload to `/api/chat`, enabling the model to give tailored advice referencing the generated regimen.

---

## Phase 3: Conclusion & Work Finalization (Improvements & Deployment)

### 1. Finalizing the Application
The application underwent end-to-end testing across various user personas:
- **Persona A (Weight Loss)**: 35-year-old female, sedentary, 85kg, goal: lose fat. Verified that target calories reflected a safe ~450 kcal deficit and that the healthy target weight was accurately displayed.
- **Persona B (Muscle Gain with Limitations)**: 22-year-old male, active, 70kg, goal: hypertrophy with lower-back sensitivity. Verified that the AI substituted heavy spinal-loading movements with supported dumbbell rows and machine squats.

### 2. Optimization & Polish
- **Print & PDF Support**: Integrated a custom `@media print` CSS stylesheet. Users can click "Print Plan" to generate a clean, distraction-free document for the gym or kitchen.
- **Live AI Status Indicator**: Built a reactive badge in the top navigation bar that pings `/api/status` upon load to inform the user whether live Gemini AI or the simulation engine is currently powering the app.
- **Dark/Light Theme Toggle**: Implemented a theme switcher for user comfort.

### 3. AWS Deployment Process (Level 3 Web Server)
The application was deployed on an **AWS EC2 Ubuntu 24.04 LTS** instance:
1. **EC2 Provisioning**: Created a `t2.micro` / `t3.micro` instance within the AWS Free Tier.
2. **Security Group Configuration**: Configured Inbound rules to permit:
   - **Port 22 (SSH)**: For server administration.
   - **Port 80 (HTTP)**: For public web browser traffic.
   - **Port 5000 (Custom TCP)**: Alternate development web port.
3. **Server Setup via SSH**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y python3-pip python3-venv git
   git clone <REPO_URL>
   cd ai-health-coach
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
4. **Running with Production Server (Gunicorn)**:
   ```bash
   sudo ./venv/bin/gunicorn -w 3 -b 0.0.0.0:80 app:app --daemon
   ```
   Binding to `0.0.0.0:80` allowed anyone to access the application directly via the AWS Public IP address without needing a port suffix in the URL.

### 4. Problems & Solutions Encountered During Deployment

- **Problem: Localhost Binding Issue**:
  - *Symptom*: Flask by default binds to `127.0.0.1`, which was inaccessible from outside the EC2 instance.
  - *Solution*: Configured both Flask and Gunicorn to bind to `0.0.0.0`, allowing incoming network requests routed through the AWS Elastic Network Interface.
- **Problem: Process Termination upon SSH Disconnect**:
  - *Symptom*: Running `python3 app.py` directly terminated the server as soon as the SSH terminal session closed.
  - *Solution*: Deployed the web server using Gunicorn in daemon mode (`--daemon`) and documented systemd service configuration for automated process restarts.

---

## Phase 4: Summary of Problems & Solutions

| Phase | Problem Description | Root Cause | Implemented Solution |
|---|---|---|---|
| **Phase 1 (Research)** | Inconsistent nutritional formulas and target calculations. | Discrepancies between outdated formulas (Harris-Benedict) and modern clinical data. | Implemented the Mifflin-St Jeor equation and verified healthy weight bounds using WHO BMI parameters. |
| **Phase 1 (Research)** | Risk of API failure or rate limiting during demonstration. | Cloud LLM quotas and unconfigured API keys on new environments. | Built a resilient offline mock simulation engine that replicates the exact JSON schema. |
| **Phase 2 (Implementation)** | LLM returning markdown syntax around JSON strings. | Generative models formatting code blocks by default (` ```json `). | Created a regex cleaning pipeline that strips code fences and trims whitespace before deserialization. |
| **Phase 2 (Implementation)** | High data density causing visual overload on mobile. | 7 days of exercises and 4 meals displayed simultaneously. | Designed a tabbed navigation system with responsive tables and card wrappers. |
| **Phase 2 (Implementation)** | AI Coach lacked context in follow-up chat conversations. | Stateless HTTP REST requests did not retain active plan parameters. | Injected an active plan context summary (`contextSummary`) into every chat payload. |
| **Phase 3 (Deployment)** | Web application inaccessible via AWS Public IP. | Server listening solely on loopback address (`127.0.0.1`). | Bound server to `0.0.0.0` and opened Port 80 in the AWS Security Group. |
| **Phase 3 (Deployment)** | Web server dying after closing SSH terminal. | Process tied to active SSH session shell. | Deployed Gunicorn WSGI server as a background daemon process. |

---

## Conclusion

### 1. Achievements
The project successfully delivered a fully functional, production-ready Generative AI health application. PulseCoach AI takes user biometric data, performs accurate physiological calculations, and uses Google Gemini to generate structured, actionable, and safe workout and nutrition regimens. The application is publicly accessible on the web through an AWS EC2 Ubuntu instance and tracked in a structured GitHub repository.

### 2. Key Learnings
- **GenAI Prompt Engineering**: Mastered the technique of constraining LLM outputs to strict JSON schemas using system instructions, temperature calibration, and post-processing validation.
- **Fullstack Integration**: Gained hands-on experience connecting a responsive JavaScript frontend with a Python Flask REST API.
- **AWS Cloud Administration**: Learned how to configure Ubuntu Linux EC2 instances, manage security group firewall rules, handle SSH keys, and run WSGI servers with Gunicorn.
- **Resilient Software Design**: Realized the importance of graceful degradation and fallback mock systems in production AI applications.

### 3. Future Improvements
- **User Authentication & Cloud Database**: Adding PostgreSQL or AWS DynamoDB with Amazon Cognito to allow users to save multi-week progress and track body weight trends over time.
- **Multimodal AI Integration**: Utilizing Gemini's multimodal capabilities to allow users to take a photo of their meal and receive instant nutritional estimations.
- **Wearable Device Integration**: Integrating with Apple HealthKit or Google Fit APIs to import real-time daily step counts and heart-rate variability.
