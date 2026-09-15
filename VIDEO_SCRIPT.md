# Video Presentation Script: PulseCoach AI
**Minimum Length:** 4:00+ minutes (Paced for ~4:30 to 5:00 minutes)
**Language:** English (Required)
**Recording Tool:** OBS Studio, Loom, or Microsoft PowerPoint screen recorder

---

## Quick Recording Checklist Before You Press "Record"
1. Have the web app open in your browser: `http://localhost:5000` (or your AWS Public IP).
2. Have **Visual Studio Code** open in the background with `app.py` and `templates/index.html`.
3. Have your **AWS EC2 console** or terminal open showing the running server.
4. Speak calmly and clearly. Follow the timestamp guide below.

---

## Timed Video Script & Visual Cues

### [0:00 - 0:45] Section 1: Introduction & Project Purpose
- **What to show on screen:**
  - Browser showing the PulseCoach AI homepage (`http://localhost:5000` or AWS IP).
  - Move your mouse over the title and badges.

- **What to say:**
  > "Hello everyone, and welcome to my presentation!
  > Today, I am excited to present my project: **PulseCoach AI**, an intelligent, Generative AI-powered health and fitness coaching application.
  >
  > The purpose of this project was to build a fullstack web application that solves a real-world problem: helping people get personalized, safe, and science-backed health guidance without paying expensive monthly coaching fees.
  >
  > By entering basic biometric data—such as age, gender, height, weight, activity level, and specific goals—the app calculates your healthy weight range, metabolic baselines, and generates a fully tailored 7-day workout routine and meal strategy using Generative AI.
  >
  > Furthermore, the application is deployed and hosted live in the cloud on **Amazon Web Services (AWS)** using an **Ubuntu EC2 web server**, and all code is tracked using Git and GitHub."

---

### [0:45 - 1:40] Section 2: Phase 1 — Research & Planning
- **What to show on screen:**
  - Switch briefly to VS Code showing `README.md` or `DOCUMENTATION.md`, or show the project architecture diagram.

- **What to say:**
  > "Let's begin with **Phase 1: The Research Phase**.
  >
  > Before writing any code, I conducted extensive research into two key areas:
  > First, sports science formulas. Rather than guessing, I researched verified clinical equations. I selected the **Mifflin-St Jeor equation** to calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE), and utilized World Health Organization guidelines to determine healthy target weight ranges for each individual's height and age.
  >
  > Second, I evaluated Generative AI models. I selected **Google Gemini** due to its state-of-the-art inference speed, strong JSON structuring capabilities, and generous developer tier through Google AI Studio.
  >
  > For the architecture, I chose **Python with Flask** for the backend because Python excels at AI integrations and mathematical operations, and it runs natively on Ubuntu Linux in AWS. For the frontend, I used **HTML5, Tailwind CSS, and Lucide icons**, creating a fast, modern single-page application without the overhead of heavy build tools.
  >
  > **A key problem that arose during research** was ensuring high reliability. If an API key was missing or hit a rate limit, the application could crash. To solve this, I designed a **dual-mode architecture** with an offline mock simulation engine. If the live AI API is unreachable, the system gracefully falls back to structured simulation, ensuring zero downtime."

---

### [1:40 - 2:40] Section 3: Phase 2 — Implementation & Code Walkthrough
- **What to show on screen:**
  - Switch to **Visual Studio Code**.
  - Show `app.py`: scroll through `calculate_biometrics()`, `call_gemini_api()`, and the `/api/generate-plan` endpoint.
  - Show the frontend files (`templates/index.html` and `static/js/app.js`).

- **What to say:**
  > "Moving on to **Phase 2: Implementation**.
  >
  > Here in Visual Studio Code, you can see how the application is structured.
  >
  > In `app.py`, the core backend logic starts with the `calculate_biometrics` function. This takes the user's age, gender, height, and weight, calculates their exact BMI and healthy weight bounds, and computes their target daily calories and macronutrient ratios—protein, carbs, and fats.
  >
  > Next is the Generative AI integration. We construct a prompt with strict system instructions that forces Google Gemini to output pure JSON matching our schema.
  >
  > **During implementation, we encountered a significant problem:**
  > Large language models often wrap JSON responses in markdown code fences, like triple backticks with the word 'json'. When Python attempted to parse this with `json.loads()`, it threw an error.
  >
  > **The solution:** I implemented a regular expression sanitization pipeline that strips away code fences, preambles, and trailing whitespace before parsing.
  >
  > On the frontend, in `index.html` and `app.js`, we designed a clean dashboard. To prevent visual overload when displaying seven days of workouts and four meals, I implemented a tabbed interface with expandable daily cards."

---

### [2:40 - 3:45] Section 4: Live Demonstration of the Application
- **What to show on screen:**
  - Switch back to the **web browser** showing the running application.
  - Fill in the form live:
    - Name: Alex
    - Age: 24
    - Gender: Male
    - Height: 180 cm
    - Weight: 82 kg
    - Activity: Moderately Active
    - Goal: Fat Loss / Lean Muscle
  - Click **"Generate My AI Coaching Plan"**.
  - Show the loading spinner and then the revealed plan!
  - Scroll through the metrics: Healthy Weight Range, BMI, Calories, Macros.
  - Click on the tabs: **7-Day Workout Protocol**, **Meal Strategy**, **Recovery & Habits**.
  - Scroll down to **"Ask Your AI Coach"** and click a quick prompt (e.g. *"What should I eat 1 hour before working out?"*). Show the coach answering!

- **What to say:**
  > "Now, let's see a live demonstration of PulseCoach AI in action!
  >
  > On the left side, we have our biometric intake form. I will enter a sample profile: Alex, 24 years old, male, 180 centimeters tall, weighing 82 kilograms. His activity level is moderately active, and his primary goal is fat loss while preserving muscle.
  >
  > Let's click **'Generate My AI Coaching Plan'**.
  >
  > As you can see, the AI analyzes the biometrics in real-time. Immediately, our dashboard updates:
  > - It identifies the healthy weight range for someone of this height as 60 to 80 kilograms.
  > - It calculates an exact BMI of 25.3.
  > - It prescribes a calibrated calorie target of roughly 2,150 calories per day, representing a safe and sustainable deficit.
  > - It provides the exact macronutrient breakdown: 165 grams of protein, 210 grams of carbs, and 60 grams of healthy fats.
  >
  > If we look at the **7-Day Workout Protocol**, the AI has structured an entire week: Upper Body Push on Monday, Lower Body on Tuesday, active recovery, and conditioning, complete with sets, reps, rest intervals, and coaching cues.
  >
  > In the **Meal Strategy** tab, we have concrete meal examples for breakfast, lunch, dinner, and snacks.
  >
  > And finally, down here is our **interactive AI Coach**. I can ask: *'What should I eat 1 hour before working out?'* Let's click send. The AI coach immediately responds with actionable advice tailored to our plan!"

---

### [3:45 - 4:30+] Section 5: Phase 3 (AWS Deployment), GitHub & Conclusion
- **What to show on screen:**
  - Switch to your terminal showing the SSH connection to the AWS EC2 instance (or show the AWS EC2 Management Console with the running instance and Public IP).
  - Briefly show the GitHub repository page with commits.

- **What to say:**
  > "Finally, let's look at **Phase 3: Deployment and Hosting on AWS**.
  >
  > To meet the project requirements for a Level 3 web server, I provisioned an **Ubuntu 24.04 LTS instance on AWS EC2**.
  > I configured the AWS Security Group to open port 80 for HTTP web traffic and port 22 for SSH management.
  >
  > On the server, I cloned our GitHub repository, created a Python virtual environment, installed our dependencies, and deployed the app using the **Gunicorn WSGI server** running as a background daemon. This makes the application live and accessible worldwide over the public internet.
  >
  > **A challenge we solved during deployment** was that the development server was initially bound only to localhost `127.0.0.1`, which blocked outside internet traffic. By configuring Gunicorn and Flask to bind to `0.0.0.0`, all external requests from the AWS Public IP were successfully routed.
  >
  > **In conclusion:**
  > This project taught me how to seamlessly bridge Generative AI with fullstack engineering and cloud hosting on AWS. We successfully built a responsive, resilient application that provides genuine value to users.
  >
  > Thank you so much for watching my presentation!"

---

## Recording Tips for a High Grade
- **Timer Check:** If you talk quickly, take a few extra seconds during the live demo (Section 4) to show the "Meal Strategy" tab and the "Print Plan" button—this will easily keep you safely above the 4-minute mark.
- **Microphone:** Keep your microphone close and test a 10-second audio clip before doing the full take.
- **Pacing:** Pause slightly between sections so the transition is clear and professional.
