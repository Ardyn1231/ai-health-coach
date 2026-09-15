"""
AI Health & Fitness Coach (PulseCoach AI)
A Generative AI web application built with Python Flask and Google Gemini.
Designed for local development and AWS Ubuntu deployment.
"""

import os
import json
import re
import math
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests

# Load environment variables from .env
load_dotenv()

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# -------------------------------------------------------------
# Biometric Helper Functions
# -------------------------------------------------------------
def calculate_biometrics(age, gender, height_cm, weight_kg, activity_level, goal):
    """
    Calculates estimated BMI, healthy weight range, BMR, and TDEE.
    Uses the Mifflin-St Jeor equation.
    """
    height_m = height_cm / 100.0
    bmi = round(weight_kg / (height_m ** 2), 1)

    # Standard WHO BMI categories
    if bmi < 18.5:
        bmi_cat = "Underweight"
    elif bmi < 25.0:
        bmi_cat = "Normal weight"
    elif bmi < 30.0:
        bmi_cat = "Overweight"
    else:
        bmi_cat = "Obese"

    # Healthy weight range based on normal BMI (18.5 - 24.9)
    min_healthy_wt = round(18.5 * (height_m ** 2), 1)
    max_healthy_wt = round(24.9 * (height_m ** 2), 1)

    # Mifflin-St Jeor Equation for BMR
    if str(gender).lower() in ["male", "man", "kille", "herr"]:
        bmr = int(10 * weight_kg + 6.25 * height_cm - 5 * age + 5)
    else:
        bmr = int(10 * weight_kg + 6.25 * height_cm - 5 * age - 161)

    # Activity multipliers
    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "very_active": 1.725,
        "athlete": 1.9
    }
    multiplier = activity_multipliers.get(activity_level.lower(), 1.4)
    tdee = int(bmr * multiplier)

    # Goal calorie target
    goal_lower = str(goal).lower()
    if "lose" in goal_lower or "loss" in goal_lower:
        target_calories = max(1200, tdee - 450)
    elif "gain" in goal_lower or "muscle" in goal_lower or "build" in goal_lower:
        target_calories = tdee + 350
    else:
        target_calories = tdee

    # Macronutrient breakdown (approximate healthy ratios)
    # Protein: 2.0g per kg for active/weight goals, carbs: remainder, fat: 25-30%
    protein_g = int(weight_kg * 1.8)
    protein_cals = protein_g * 4
    fat_cals = int(target_calories * 0.25)
    fat_g = int(fat_cals / 9)
    carbs_cals = max(0, target_calories - protein_cals - fat_cals)
    carbs_g = int(carbs_cals / 4)
    water_l = round(weight_kg * 0.035, 1)

    return {
        "bmi": bmi,
        "bmiCategory": bmi_cat,
        "healthyWeightRange": f"{min_healthy_wt} - {max_healthy_wt} kg",
        "bmr": bmr,
        "tdee": tdee,
        "targetCalories": target_calories,
        "macros": {
            "proteinGrams": protein_g,
            "carbsGrams": carbs_g,
            "fatsGrams": fat_g,
            "waterLiters": water_l
        }
    }


# -------------------------------------------------------------
# Mock Data Generator (Robust Fallback)
# -------------------------------------------------------------
def generate_mock_plan(user_data, biometrics):
    """
    Returns a comprehensive, high-quality plan when Gemini API key is not present.
    """
    goal = user_data.get("goal", "General Fitness")
    name = user_data.get("name", "Fitness Enthusiast")
    env = user_data.get("environment", "Gym")
    
    return {
        "analysis": {
            "userGreeting": f"Hello {name}! Here is your personalized AI coaching plan.",
            "bmi": biometrics["bmi"],
            "bmiCategory": biometrics["bmiCategory"],
            "healthyWeightRange": biometrics["healthyWeightRange"],
            "targetCalories": biometrics["targetCalories"],
            "bmr": biometrics["bmr"],
            "tdee": biometrics["tdee"],
            "macroBreakdown": biometrics["macros"],
            "summary": (
                f"Based on your profile ({user_data.get('age')} years old, {user_data.get('weight')}kg, "
                f"{user_data.get('height')}cm), your calculated healthy weight range is {biometrics['healthyWeightRange']}. "
                f"To achieve your goal of '{goal}', your target daily intake is {biometrics['targetCalories']} kcal."
            )
        },
        "nutrition": {
            "focus": f"Balanced macronutrients calibrated for {goal}.",
            "dailyCalories": biometrics["targetCalories"],
            "meals": [
                {
                    "meal": "Breakfast",
                    "title": "Energizing Oats & Protein Bowl",
                    "description": "Rolled oats cooked with almond milk, topped with 1 scoop of protein, chia seeds, and fresh berries.",
                    "calories": int(biometrics["targetCalories"] * 0.25),
                    "macros": "35g P / 55g C / 12g F"
                },
                {
                    "meal": "Lunch",
                    "title": "Lean Mediterranean Quinoa Bowl",
                    "description": "Grilled chicken breast (or tofu), quinoa, steamed broccoli, roasted sweet potato, and olive oil vinaigrette.",
                    "calories": int(biometrics["targetCalories"] * 0.35),
                    "macros": "45g P / 65g C / 18g F"
                },
                {
                    "meal": "Dinner",
                    "title": "Restorative Salmon & Greens",
                    "description": "Pan-seared wild salmon with asparagus, brown rice, and a mixed garden salad with avocado slices.",
                    "calories": int(biometrics["targetCalories"] * 0.30),
                    "macros": "40g P / 45g C / 22g F"
                },
                {
                    "meal": "Snack",
                    "title": "Greek Yogurt & Walnuts",
                    "description": "Non-fat Greek yogurt with a handful of raw walnuts and a drizzle of honey.",
                    "calories": int(biometrics["targetCalories"] * 0.10),
                    "macros": "20g P / 15g C / 10g F"
                }
            ],
            "tips": [
                f"Aim to drink at least {biometrics['macros']['waterLiters']} liters of water per day.",
                "Prioritize whole food sources and eat protein with every primary meal.",
                "Maintain consistent meal timing to regulate blood sugar and sustain energy levels."
            ]
        },
        "workoutPlan": {
            "splitName": f"Personalized 7-Day Protocol ({env})",
            "days": [
                {
                    "day": "Day 1 - Monday",
                    "type": "Strength",
                    "focus": "Upper Body Push & Pull",
                    "duration": "45-50 min",
                    "exercises": [
                        {"name": "Dumbbell / Barbell Bench Press", "sets": "4", "reps": "8-10", "rest": "90s", "cue": "Controlled descent, drive through chest."},
                        {"name": "Bent-Over Dumbbell Rows", "sets": "3", "reps": "10-12", "rest": "60s", "cue": "Keep spine neutral, pull toward hip."},
                        {"name": "Overhead Shoulder Press", "sets": "3", "reps": "10", "rest": "60s", "cue": "Brace core, don't arch lower back."},
                        {"name": "Incline Push-ups / Cable Flyes", "sets": "3", "reps": "12-15", "rest": "45s", "cue": "Squeeze at peak contraction."}
                    ]
                },
                {
                    "day": "Day 2 - Tuesday",
                    "type": "Strength",
                    "focus": "Lower Body & Core Foundations",
                    "duration": "45-50 min",
                    "exercises": [
                        {"name": "Goblet Squats / Barbell Squats", "sets": "4", "reps": "8-10", "rest": "90s", "cue": "Weight through midfoot, knees track over toes."},
                        {"name": "Romanian Deadlifts (RDL)", "sets": "3", "reps": "10-12", "rest": "90s", "cue": "Hinge at the hips, feel hamstring stretch."},
                        {"name": "Walking Lunges", "sets": "3", "reps": "12 steps/leg", "rest": "60s", "cue": "Torso upright, 90-degree bend at knees."},
                        {"name": "Plank with Shoulder Taps", "sets": "3", "reps": "45 sec hold", "rest": "45s", "cue": "Avoid rocking hips."}
                    ]
                },
                {
                    "day": "Day 3 - Wednesday",
                    "type": "Recovery",
                    "focus": "Active Recovery & Mobility",
                    "duration": "30 min",
                    "exercises": [
                        {"name": "Brisk Outdoor Walk or Light Cycling", "sets": "1", "reps": "25 min", "rest": "N/A", "cue": "Zone 2 conversational pace."},
                        {"name": "Hip Flexor & Hamstring Mobility Flow", "sets": "2", "reps": "5 min", "rest": "N/A", "cue": "Breathe deeply through tight spots."}
                    ]
                },
                {
                    "day": "Day 4 - Thursday",
                    "type": "Strength",
                    "focus": "Posterior Chain & Back Hypertrophy",
                    "duration": "45-50 min",
                    "exercises": [
                        {"name": "Lat Pulldowns or Pull-ups", "sets": "4", "reps": "8-10", "rest": "90s", "cue": "Drive elbows down toward ribcage."},
                        {"name": "Dumbbell Deadlifts", "sets": "3", "reps": "10", "rest": "90s", "cue": "Engage lats and brace abdominal wall."},
                        {"name": "Face Pulls", "sets": "3", "reps": "15", "rest": "45s", "cue": "Great for rear delts and posture."},
                        {"name": "Bicep Curls superset Tricep Dips", "sets": "3", "reps": "12 each", "rest": "60s", "cue": "Full range of motion."}
                    ]
                },
                {
                    "day": "Day 5 - Friday",
                    "type": "Conditioning",
                    "focus": "Full Body Conditioning & Core",
                    "duration": "40 min",
                    "exercises": [
                        {"name": "Kettlebell / Dumbbell Swings", "sets": "4", "reps": "15", "rest": "60s", "cue": "Explosive hip snap, flat back."},
                        {"name": "Box Step-Ups or Jump Squats", "sets": "3", "reps": "12/leg", "rest": "60s", "cue": "Controlled landing."},
                        {"name": "Push-ups to Renegade Row", "sets": "3", "reps": "10 total", "rest": "60s", "cue": "Keep torso stable."},
                        {"name": "Hanging Knee Raises / Deadbug", "sets": "3", "reps": "15", "rest": "45s", "cue": "Exhale as knees lift."}
                    ]
                },
                {
                    "day": "Day 6 - Saturday",
                    "type": "Cardio",
                    "focus": "Aerobic Conditioning & Outdoor Activity",
                    "duration": "35-45 min",
                    "exercises": [
                        {"name": "Jogging, Swimming, or Cycling", "sets": "1", "reps": "35 min", "rest": "N/A", "cue": "Steady cardiovascular effort."},
                        {"name": "Full-body static stretching", "sets": "1", "reps": "10 min", "rest": "N/A", "cue": "Hold each stretch for 30 seconds."}
                    ]
                },
                {
                    "day": "Day 7 - Sunday",
                    "type": "Rest",
                    "focus": "Complete Rest & Mental Restoration",
                    "duration": "All day",
                    "exercises": [
                        {"name": "Hydration, sleep optimization & meal prep", "sets": "1", "reps": "Full Day", "rest": "N/A", "cue": "Prepare meals and mentally recharge for the week."}
                    ]
                }
            ]
        },
        "lifestyleAdvice": [
            {
                "title": "Sleep Optimization",
                "tip": "Target 7.5 to 8.5 hours of uninterrupted sleep. Growth hormone secretion and muscular recovery peak during deep slow-wave sleep."
            },
            {
                "title": "Daily Step Goal",
                "tip": "Aim for 8,000 to 10,000 daily steps. Non-Exercise Activity Thermogenesis (NEAT) is the largest contributor to daily calorie burn after BMR."
            },
            {
                "title": "Consistency Over Intensity",
                "tip": "A moderate workout done consistently for 6 months beats an intense workout done for 2 weeks. Focus on progressive overload."
            }
        ]
    }


# -------------------------------------------------------------
# Call Google Gemini API
# -------------------------------------------------------------
def call_gemini_api(prompt_text, system_instruction=""):
    """
    Invokes Google Gemini Generative AI via HTTP API endpoint.
    Uses gemini-2.5-flash or gemini-1.5-flash.
    """
    if not GEMINI_API_KEY:
        return None

    # Try gemini-2.5-flash, fallback to gemini-1.5-flash
    models = ["gemini-2.5-flash", "gemini-1.5-flash"]
    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt_text}]
                }
            ],
            "generationConfig": {
                "temperature": 0.3,
                "topP": 0.9,
                "maxOutputTokens": 3000
            }
        }
        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=25)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text
            else:
                print(f"Gemini API ({model}) error {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"Exception calling Gemini API ({model}): {e}")
            continue

    return None


# -------------------------------------------------------------
# API Routes
# -------------------------------------------------------------
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/status", methods=["GET"])
def status():
    """Returns application health and whether Live AI or Mock AI is active."""
    return jsonify({
        "status": "online",
        "service": "PulseCoach AI",
        "liveAI": bool(GEMINI_API_KEY),
        "environment": os.getenv("FLASK_ENV", "production")
    })


@app.route("/api/generate-plan", methods=["POST"])
def generate_plan():
    """
    Receives user profile, calculates biometrics, calls Gemini AI to build
    a customized health and coaching plan, and falls back to smart mock if needed.
    """
    try:
        data = request.get_json(force=True) or {}
        
        # Extract inputs with sensible defaults
        name = str(data.get("name", "User")).strip() or "User"
        age = int(data.get("age", 25))
        gender = str(data.get("gender", "Other")).strip()
        height_cm = float(data.get("height", 175))
        weight_kg = float(data.get("weight", 75))
        activity_level = str(data.get("activityLevel", "moderate"))
        goal = str(data.get("goal", "General Health"))
        diet = str(data.get("diet", "None"))
        environment = str(data.get("environment", "Gym"))
        limitations = str(data.get("limitations", "None"))

        # Calculate exact biometrics
        biometrics = calculate_biometrics(age, gender, height_cm, weight_kg, activity_level, goal)

        # Build prompt for Gemini
        system_prompt = (
            "You are PulseCoach, an expert sports scientist, registered dietitian, and elite fitness coach. "
            "Your mission is to provide personalized, science-backed, encouraging, and safe health and workout plans. "
            "You MUST respond ONLY with a single valid JSON object, without markdown ticks, comments, or preamble."
        )

        prompt = f"""
Analyze the following user profile and return a complete health & fitness plan in valid JSON format:
- Name: {name}
- Age: {age} years
- Gender: {gender}
- Height: {height_cm} cm
- Weight: {weight_kg} kg
- Activity Level: {activity_level}
- Primary Goal: {goal}
- Diet/Allergies: {diet}
- Preferred Workout Setting: {environment}
- Physical Limitations / Injuries: {limitations}

Biometric Reference:
- Calculated BMI: {biometrics['bmi']} ({biometrics['bmiCategory']})
- Calculated Healthy Weight Range for this height: {biometrics['healthyWeightRange']}
- Estimated BMR: {biometrics['bmr']} kcal
- Estimated TDEE: {biometrics['tdee']} kcal
- Target Daily Calories: {biometrics['targetCalories']} kcal
- Target Daily Protein: {biometrics['macros']['proteinGrams']}g
- Target Daily Carbs: {biometrics['macros']['carbsGrams']}g
- Target Daily Fats: {biometrics['macros']['fatsGrams']}g
- Daily Hydration: {biometrics['macros']['waterLiters']}L

Return JSON matching this exact structure:
{{
  "analysis": {{
    "userGreeting": "string",
    "bmi": {biometrics['bmi']},
    "bmiCategory": "{biometrics['bmiCategory']}",
    "healthyWeightRange": "{biometrics['healthyWeightRange']}",
    "targetCalories": {biometrics['targetCalories']},
    "bmr": {biometrics['bmr']},
    "tdee": {biometrics['tdee']},
    "macroBreakdown": {{
      "proteinGrams": {biometrics['macros']['proteinGrams']},
      "carbsGrams": {biometrics['macros']['carbsGrams']},
      "fatsGrams": {biometrics['macros']['fatsGrams']},
      "waterLiters": {biometrics['macros']['waterLiters']}
    }},
    "summary": "Detailed 2-3 sentence overview of their physical condition and recommendation for their specific age and gender."
  }},
  "nutrition": {{
    "focus": "Key nutritional strategy",
    "dailyCalories": {biometrics['targetCalories']},
    "meals": [
      {{"meal": "Breakfast", "title": "Meal title", "description": "Ingredients & preparation", "calories": 500, "macros": "35g P / 40g C / 15g F"}},
      {{"meal": "Lunch", "title": "Meal title", "description": "Ingredients & preparation", "calories": 700, "macros": "45g P / 60g C / 20g F"}},
      {{"meal": "Dinner", "title": "Meal title", "description": "Ingredients & preparation", "calories": 650, "macros": "40g P / 50g C / 18g F"}},
      {{"meal": "Snack", "title": "Meal title", "description": "Ingredients & preparation", "calories": 250, "macros": "15g P / 20g C / 8g F"}}
    ],
    "tips": ["tip 1", "tip 2", "tip 3"]
  }},
  "workoutPlan": {{
    "splitName": "Workout Split Name",
    "days": [
      {{
        "day": "Day 1 - Monday",
        "type": "Strength / Cardio / Rest",
        "focus": "Focus area",
        "duration": "45 min",
        "exercises": [
          {{"name": "Exercise Name", "sets": "3", "reps": "10-12", "rest": "60s", "cue": "Form guidance cue"}}
        ]
      }}
      ... (include all 7 days from Monday to Sunday, with appropriate rest days)
    ]
  }},
  "lifestyleAdvice": [
    {{"title": "Sleep & Recovery", "tip": "Actionable advice on sleep duration and deep recovery."}},
    {{"title": "Daily Movement & Steps", "tip": "Advice on NEAT and cardiovascular health."}},
    {{"title": "Mindset & Habit Formation", "tip": "Actionable advice on adherence."}}
  ]
}}
"""
        plan_data = None
        is_mock = True

        if GEMINI_API_KEY:
            raw_response = call_gemini_api(prompt, system_instruction=system_prompt)
            if raw_response:
                # Clean up any potential markdown code blocks
                clean_json = re.sub(r"^```(json)?", "", raw_response.strip(), flags=re.MULTILINE)
                clean_json = re.sub(r"```$", "", clean_json.strip(), flags=re.MULTILINE).strip()
                try:
                    plan_data = json.loads(clean_json)
                    is_mock = False
                except Exception as json_err:
                    print(f"JSON parsing error from Gemini output: {json_err}. Using mock fallback.")

        if not plan_data:
            plan_data = generate_mock_plan(data, biometrics)
            is_mock = True

        return jsonify({
            "success": True,
            "isMock": is_mock,
            "plan": plan_data
        })

    except Exception as e:
        print(f"Error generating plan: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Interactive AI Coach chat endpoint to answer questions or modify plans.
    """
    try:
        data = request.get_json(force=True) or {}
        user_message = data.get("message", "").strip()
        history = data.get("history", [])
        context_summary = data.get("contextSummary", "")

        if not user_message:
            return jsonify({"success": False, "error": "Message cannot be empty."}), 400

        system_instruction = (
            "You are PulseCoach, a warm, motivating, science-based health and fitness coach. "
            "Keep your responses concise, actionable, and structured (under 150 words). "
            "Provide helpful tips for exercise swaps, nutrition questions, recovery, or motivation."
        )

        chat_prompt = f"User Context:\n{context_summary}\n\nUser Question:\n{user_message}"

        if GEMINI_API_KEY:
            ai_reply = call_gemini_api(chat_prompt, system_instruction=system_instruction)
            if ai_reply:
                return jsonify({"success": True, "reply": ai_reply, "isMock": False})

        # Mock Coach response if no API key
        mock_replies = [
            f"Great question! For your goal, consistency is key. When adjusting this routine, make sure to replace any exercise with a compound movement that targets similar muscle groups (for example, swapping squats with leg presses or goblet squats). Remember to listen to your body and prioritize proper form!",
            f"Regarding nutrition and recovery: drinking ample water and aiming for 7-8 hours of sleep will amplify your results significantly. Keep your daily protein around the recommended target and fuel yourself 1-2 hours before training.",
            f"That's a smart adjustment to make. If you experience discomfort in any joint, stop immediately and substitute with an exercise with lower axial loading. What other questions do you have about your schedule?"
        ]
        import random
        return jsonify({
            "success": True,
            "reply": random.choice(mock_replies),
            "isMock": True
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    # Listen on 0.0.0.0 so AWS EC2 public IP can access it
    app.run(host="0.0.0.0", port=port, debug=False)
