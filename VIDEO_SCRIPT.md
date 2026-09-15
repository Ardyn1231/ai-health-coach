# Video Presentation Script: PulseCoach AI
**Presenter Profile:** Drifttekniker Student at Jensen Education (Sweden)  
**Project Context:** Internship Project  
**Target Duration:** ~4:30 minutes (Safely above the 4:00 minute requirement)  
**Language:** English  
**Tone:** Honest, realistic, down-to-earth student perspective (beginner-to-intermediate with AI & coding)  

---

## Pre-Recording Setup Checklist
1. Open your web browser with your app running on your **AWS Public IP** (`http://YOUR_EC2_PUBLIC_IP`).
2. Have **Visual Studio Code** open in the background with `app.py` and `templates/index.html`.
3. Have your terminal open with the SSH connection to your AWS Ubuntu server (or the AWS EC2 Management Console).
4. Take a deep breath, speak in a relaxed and steady pace.

---

## Timed Video Script & Visual Cues

### [0:00 - 0:45] Section 1: Introduction & Project Idea
- **What to show on screen:**
  - Browser showing the PulseCoach AI website loaded via your **AWS Public IP address**.
  - Move your mouse gently across the page to show it is live.

- **What to say:**
  > "Hi everyone, and welcome to my presentation!
  >
  > My name is Omar, and I am currently a student in the **Drifttekniker** program at **Jensen Education** in Sweden.
  > I worked on this project as part of my internship, where the task was to build an application using Generative AI and host it live in the cloud on **Amazon Web Services (AWS)**.
  >
  > For this project, I decided to build **PulseCoach AI**, which is a personal health and fitness coaching web app.
  > The idea is simple: a user enters their age, gender, height, weight, activity level, and goals. The application then analyzes this information to show what a healthy weight range is for that person, how many calories they need, and uses AI to generate a 7-day workout schedule and meal suggestions."

---

### [0:45 - 1:50] Section 2: My Honest Journey (Copilot Struggles & Teacher Extension)
- **What to show on screen:**
  - Switch to **Visual Studio Code**, showing the files (`app.py`, `templates`, `static`).

- **What to say:**
  > "To be completely honest, I am still quite a beginner when it comes to coding and working with AI models. Because of that, this project was definitely a learning curve for me.
  >
  > At first, I started building this project using **Microsoft Copilot**. But as I worked through it, I ran into a lot of difficulties. I would get about 90% through a part of the project, but then always get stuck on the last 10% trying to solve technical issues with Copilot.
  >
  > I had to do almost everything manually, and while I eventually got a very simple version running on my local computer, I had way too many problems trying to get the AI and the web server to work properly online. Every time we tried to fix one thing, another error showed up.
  >
  > Because of these problems, I fell behind and went over the project time limit. Fortunately, my teacher was very kind and gave me an extension so I could finish it.
  >
  > That was when I decided to try a different approach and test other AI tools, like **Antigravity**. That made a huge difference for me as a learner. It helped guide me step-by-step through setting up the Python Flask server, fixing the dependencies, and deploying it cleanly onto an AWS Ubuntu server."

---

### [1:50 - 2:40] Section 3: How the Application Works Behind the Scenes
- **What to show on screen:**
  - In **VS Code**, show `app.py`.
  - Scroll through `calculate_biometrics()` and the Gemini API function.

- **What to say:**
  > "Let's take a quick look at the code in Visual Studio Code.
  >
  > In `app.py`, the backend is built with **Python and Flask**:
  > - First, when the user submits their information, the code calculates standard biometric values. It calculates the Body Mass Index (BMI) and uses standard health guidelines to show what an ideal healthy weight range is for that person's height and age.
  > - It also calculates estimated daily calories based on whether the person wants to lose weight, maintain, or build muscle.
  > - Then, it sends this data to the **Google Gemini AI** model. We give the AI clear instructions to return a 7-day workout routine and meal suggestions in JSON format.
  >
  > **One problem I had to solve here:**
  > Sometimes the AI model wraps its response in markdown formatting, which broke the code when trying to read the data. So we added a clean-up function with regular expressions to strip out that extra text.
  >
  > We also built in a fallback demo mode, so if the AI API is slow or missing an API key, the website still works and doesn't crash."

---

### [2:40 - 3:50] Section 4: Live Demonstration on AWS
- **What to show on screen:**
  - Switch to your **web browser** showing the live site on your AWS Public IP.
  - Fill in the form:
    - Name: Alex
    - Age: 24
    - Gender: Male
    - Height: 180 cm
    - Weight: 82 kg
    - Activity: Moderately Active
    - Goal: Fat Loss (or Muscle Gain)
  - Click **'Generate My AI Coaching Plan'**.
  - Show the loading indicator, and then show the results!
  - Click through the tabs: **7-Day Workout Protocol**, **Meal Strategy**, **Recovery & Habits**.
  - Scroll to **"Ask Your AI Coach"** and click a question (e.g., *"What should I eat 1 hour before working out?"*).
  - Briefly click **"Print Plan"**.

- **What to say:**
  > "Now let's see the application working live.
  >
  > As you can see up in the address bar, this is running live from our **AWS Public IP address**.
  > On the left side, we have our profile form. Let's test it with an example: Alex, 24 years old, male, 180 cm, 82 kg, with moderate activity, looking to lose fat and tone up.
  >
  > Let's click **'Generate My AI Coaching Plan'**.
  >
  > Right away, the application gives us a clear overview:
  > - For someone 180 cm tall, it shows a healthy weight range of roughly 60 to 80 kg.
  > - It shows a current BMI of 25.3.
  > - It calculates a daily target of around 2,150 calories, giving a safe deficit for fat loss.
  > - It also shows daily protein, carbs, fats, and water recommendations.
  >
  > If we look at the **7-Day Workout Protocol**, the AI has organized the entire week with exercises, sets, reps, and helpful coaching cues for proper form.
  > Under **Meal Strategy**, it gives simple meal ideas for breakfast, lunch, dinner, and snacks.
  >
  > And at the bottom, there is an **interactive AI coach**. I can click a question like: *'What should I eat 1 hour before working out?'*, and the coach responds with practical advice.
  > There is also a **Print Plan** button if someone wants to print or save their routine as a PDF."

---

### [3:50 - 4:40] Section 5: AWS Cloud Hosting & Drifttekniker Experience
- **What to show on screen:**
  - Switch to your **terminal** showing your SSH connection to Ubuntu (`ubuntu@ip-172-31-...`), or show your AWS EC2 Console with the running instance.

- **What to say:**
  > "Finally, let's talk about the cloud hosting part, which was a very important part of my education as a **Drifttekniker**.
  >
  > To host the project:
  > 1. I set up an **Ubuntu Linux server on AWS EC2**.
  > 2. In AWS **Security Groups**, I opened port 22 for SSH management and port 80 for HTTP web traffic so the site is accessible to anyone online.
  > 3. On the Ubuntu server, I cloned the project from GitHub and set up a Python virtual environment.
  > 4. To run it as a proper web server, I used **Gunicorn**, which runs the app as a background process on port 80.
  >
  > **A couple of things I learned during deployment:**
  > At first, the app was only listening on `127.0.0.1` (localhost), so nobody could reach it from the outside. I learned that on a cloud server, you have to bind the web server to `0.0.0.0` so it accepts incoming web traffic.
  > I also learned how to run the server in the background so it doesn't shut down when I close my SSH terminal."

---

### [4:40 - 5:05] Section 6: Conclusion
- **What to show on screen:**
  - Switch back to the website in the browser or show your GitHub repository.

- **What to say:**
  > "To conclude:
  > Even though I started this project as a beginner and faced a lot of frustrating issues with Copilot at the beginning, I learned a huge amount by pushing through and trying new tools like Antigravity.
  >
  > I was able to connect Python, an AI model, and a web interface, and most importantly, deploy it live on an AWS Ubuntu server.
  >
  > I want to say a big thank you to my teacher for being understanding and giving me the extra time to get this working properly.
  >
  > Thank you so much for watching!"

---

## Helpful Recording Tips
- **Pacing:** Speak in your normal, calm English. Don't rush.
- **Timer:** If you reach the live demo (Section 4) around 2:40, you are right on track to finish safely around 4:30–5:00 minutes.
- **Tone:** This humble, honest tone will make your teacher really respect your work, because it shows genuine learning and problem solving!
