# Video Presentation Script: PulseCoach AI
**Presenter Profile:** Final-month Drifttekniker (Systems/Cloud Infrastructure) Student at Jensen Education (Sweden)  
**Project Context:** Final Internship / LIA Project  
**Target Duration:** ~5:00 minutes (Safely above the 4:00 minute requirement)  
**Language:** English  
**Recording Tools:** OBS Studio, Loom, or Microsoft PowerPoint Screen Recorder  

---

## Pre-Recording Setup Checklist
1. Open your browser with the live app running on your **AWS Public IP** (`http://YOUR_EC2_PUBLIC_IP`).
2. Have **Visual Studio Code** open showing `app.py`, `templates/index.html`, and `DOCUMENTATION.md`.
3. Have your **AWS EC2 Console** or your terminal SSH window open showing the Ubuntu instance and running Gunicorn process.
4. Keep a glass of water nearby, take a deep breath, and speak at a steady, conversational pace.

---

## Timed Video Script & Visual Cues

### [0:00 - 0:50] Section 1: Introduction, Student Background & Purpose
- **What to show on screen:**
  - Browser displaying the PulseCoach AI homepage on your AWS Public IP.
  - Smoothly hover your mouse over the title, navigation bar, and status badge.

- **What to say:**
  > "Hello everyone, and welcome to my presentation!
  >
  > My name is Omar, and I am currently in the final month of the **Drifttekniker** program at **Jensen Education** in Sweden.
  > This project represents my final work connected to my internship, where the objective was to design, develop, and deploy a real-world Generative AI web application hosted in the cloud on **Amazon Web Services (AWS)**.
  >
  > Today, I am proud to present **PulseCoach AI**—an intelligent health, nutrition, and fitness coaching platform.
  >
  > The goal of this application is to solve a genuine problem: providing accessible, science-based health and fitness coaching. By taking user biometrics—such as age, gender, height, weight, activity level, and specific physical limitations—the system calculates metabolic baselines, recommended healthy weight ranges, macronutrient distributions, and crafts an adaptive 7-day training schedule.
  >
  > And most importantly, from an infrastructure perspective, it runs as a production web server on an **AWS EC2 Ubuntu instance**, with full Git version control."

---

### [0:50 - 1:55] Section 2: The Real Journey — Copilot Challenges & The Turning Point
- **What to show on screen:**
  - Switch to **Visual Studio Code** showing the project file tree and `README.md` or `DOCUMENTATION.md`.

- **What to say:**
  > "Before demonstrating the live application, I want to share the honest story of how this project was developed, because the journey involved significant problem-solving.
  >
  > Initially, I began developing this project using **Microsoft Copilot**. However, I ran into serious roadblocks. While Copilot was helpful for small autocomplete snippets, I repeatedly hit the '90% trap'—I would get nearly to the end of a feature or stage, only to encounter complex integration bugs that Copilot could not resolve.
  >
  > Everything had to be debugged and assembled manually. I managed to get a very basic prototype working locally, but when it came to making the AI reliably communicate with the web interface and preparing it for cloud deployment, we encountered persistent errors—from environment discrepancies to broken API handshakes.
  >
  > I tried repeatedly to make that setup work, but problem after problem caused me to exceed my original project timeline. Fortunately, my teacher was kind and understanding enough to grant me an extension.
  >
  > That was my turning point. I realized that as a future Drifttekniker, choosing the right tools and methodology is just as important as writing code. I decided to pivot and adopt advanced agentic pair-programming with **Antigravity and Google Gemini**. This transformed the entire workflow—allowing us to architect the system properly from the ground up: isolating virtual environments, writing clean REST endpoints in Flask, and automating our AWS deployment."

---

### [1:55 - 2:50] Section 3: Phase 1 & 2 — Architecture & What I Actually Built
- **What to show on screen:**
  - In **VS Code**, show `app.py`.
  - Scroll down through `calculate_biometrics()` and the Gemini API prompt handling.

- **What to say:**
  > "Now let's examine what I actually built and engineered behind the scenes.
  >
  > In `app.py`, the backend is built on **Python Flask**. I implemented verified sports science formulas:
  > - We calculate Body Mass Index (BMI) and determine healthy weight ranges using World Health Organization guidelines.
  > - We use the **Mifflin-St Jeor equation** to calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) based on activity level.
  > - We then dynamically calibrate daily caloric targets and macronutrient splits: protein at 1.8 to 2 grams per kilo of bodyweight, healthy fats at 25%, and complex carbs for energy.
  >
  > To integrate Generative AI, I constructed structured prompts for **Google Gemini**.
  >
  > **A major technical problem we solved here:**
  > Large language models frequently return JSON wrapped in markdown code fences (` ```json `), which crashes standard JSON parsers. I engineered a regex sanitization pipeline that strips out all markdown syntax, ensuring our parser receives pure, valid JSON every single time.
  >
  > Furthermore, from a systems operations standpoint, I built a **Dual-Mode architecture**. If an API key is missing or encounters network rate limits, an internal simulation engine takes over seamlessly. The application *never crashes*—high availability is guaranteed."

---

### [2:50 - 4:00] Section 4: Live Demonstration of PulseCoach AI
- **What to show on screen:**
  - Switch back to the **web browser** showing the live app on your **AWS Public IP**.
  - Fill in the form live:
    - Name: Alex
    - Age: 24
    - Gender: Male
    - Height: 180 cm
    - Weight: 82 kg
    - Activity: Moderately Active
    - Goal: Fat Loss (or Muscle Gain)
  - Click **'Generate My AI Coaching Plan'**.
  - Show the loading spinner and then reveal the generated dashboard.
  - Click the tabs: **7-Day Workout Protocol**, **Meal Strategy**, **Recovery & Habits**.
  - Scroll down to **"Ask Your AI Coach"** and click a quick question chip (e.g., *"What should I eat 1 hour before working out?"*). Show the coach reply.
  - Briefly click the **"Print Plan"** button to show the clean print preview.

- **What to say:**
  > "Now, let's see PulseCoach AI running live in the browser!
  >
  > Notice that we are connected directly to our **AWS Public IP address**.
  > On the left, we have our biometric intake form. Let's enter a profile: Alex, 24 years old, male, 180 cm tall, 82 kg, moderately active, aiming for fat loss while maintaining strength.
  >
  > Let's click **'Generate My AI Coaching Plan'**.
  >
  > In real time, the system computes the exact metrics:
  > - It determines that for someone 180 cm tall, the healthy target weight range is approximately 60 to 80 kg.
  > - It identifies a current BMI of 25.3.
  > - It prescribes a sustainable daily target of approximately 2,150 calories—a safe ~450 calorie deficit from his calculated TDEE.
  > - It provides the exact macronutrient distribution: 165g of protein, 210g of carbs, and 60g of healthy fats.
  >
  > Looking at the **7-Day Workout Protocol**, the AI structures the entire week—Push days, Pull days, lower body, and dedicated active recovery—complete with sets, reps, rest intervals, and coaching cues.
  >
  > Under **Meal Strategy**, we have balanced meals with calorie breakdowns for breakfast, lunch, dinner, and snacks.
  >
  > And down here is our **interactive AI Coach**. If Alex has a question, for example: *'What should I eat 1 hour before working out?'*, we click send, and the coach provides immediate, contextual guidance.
  >
  > We even implemented a dedicated print stylesheet so the user can click **'Print Plan'** and take a clean PDF directly to the gym!"

---

### [4:00 - 4:55] Section 5: Phase 3 — AWS Infrastructure, Gunicorn & Drifttekniker Operations
- **What to show on screen:**
  - Switch to your **terminal** showing your SSH connection to the AWS EC2 instance (`ubuntu@ip-172-31-...`), or show the AWS EC2 console showing instance details and Security Groups.
  - Show `ps aux | grep gunicorn` in the terminal to show the running background workers.

- **What to say:**
  > "Finally, let's look at the infrastructure and deployment, which connects directly to my education as a **Drifttekniker**.
  >
  > For our cloud hosting:
  > 1. I provisioned an **Ubuntu 24.04 LTS instance on AWS EC2**.
  > 2. I configured AWS **Security Groups** to manage firewall rules, opening port 22 for SSH administration and port 80 for public HTTP web traffic.
  > 3. On the server, I created an isolated Python virtual environment (`venv`) to keep all dependencies clean and reproducible.
  > 4. To satisfy the 'Level 3 Web Server' requirement, I configured **Gunicorn**—a production-grade WSGI HTTP server—running with 3 worker processes as a background daemon.
  >
  > **Two critical deployment challenges we solved:**
  > - First, the Flask development server was initially bound only to `127.0.0.1` (localhost), which prevented external access. I reconfigured Gunicorn to bind to `0.0.0.0:80`, successfully routing public internet traffic through the AWS Elastic Network Interface.
  > - Second, closing the SSH terminal originally terminated the process. By launching Gunicorn in daemon mode, the web server persists independently with continuous uptime.
  >
  > All source code, including configuration templates and our full technical documentation, is tracked on GitHub under proper version control."

---

### [4:55 - 5:25] Section 6: Conclusion & Reflections
- **What to show on screen:**
  - Switch back to the browser showing the application or the GitHub repository page.

- **What to say:**
  > "To conclude:
  > This project has been an incredible learning experience. Going through the initial struggles with Copilot taught me perseverance and the importance of choosing modern, capable developer tooling. Switching to Antigravity enabled me to turn a stalled project into a complete, polished, and cloud-hosted application.
  >
  > I want to express my sincere gratitude to my teacher for the extension and the support throughout this project. As I complete my final month at Jensen Education, this project brings together everything I have learned about systems administration, Linux, cloud networking, and modern AI integration.
  >
  > Thank you so much for your time, and I welcome any questions!"

---

## Practical Recording Advice
- **Watch the Clock:** Use a stopwatch or phone timer next to your keyboard. If you hit Section 4 at around 3:00, you are on perfect pace to finish right around 5 minutes.
- **Tone:** Be proud and authentic! Sharing your real experience with Copilot and the extension makes your presentation stand out as genuine, mature, and reflective.
