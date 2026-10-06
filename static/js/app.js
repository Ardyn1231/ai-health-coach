// PulseCoach AI — Frontend Application Logic

let currentPlan = null;
let chatHistory = [];
let currentWaterGlasses = parseInt(localStorage.getItem("pulsecoach_water_glasses") || "0", 10);
const TARGET_GLASSES = 8;

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Check Backend & AI status
    checkBackendStatus();
    updateWaterUI();

    // Attach Event Listeners
    const coachForm = document.getElementById("coachForm");
    if (coachForm) {
        coachForm.addEventListener("submit", handleFormSubmit);
    }

    const chatForm = document.getElementById("chatForm");
    if (chatForm) {
        chatForm.addEventListener("submit", handleChatSubmit);
    }

    const printBtn = document.getElementById("printPlanBtn");
    if (printBtn) {
        printBtn.addEventListener("click", () => window.print());
    }

    const toggleThemeBtn = document.getElementById("toggleThemeBtn");
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener("click", () => {
            document.documentElement.classList.toggle("dark");
        });
    }
});

// Check AI status from server
async function checkBackendStatus() {
    const badge = document.getElementById("aiStatusBadge");
    const dot = document.getElementById("aiStatusDot");
    const text = document.getElementById("aiStatusText");

    try {
        const res = await fetch("/api/status");
        if (!res.ok) throw new Error("Status check failed");
        const data = await res.json();

        if (data.liveAI) {
            dot.className = "w-2 h-2 rounded-full bg-emerald-400";
            text.textContent = "Gemini Live AI Active";
            text.className = "text-emerald-300 font-medium";
        } else {
            dot.className = "w-2 h-2 rounded-full bg-amber-400";
            text.textContent = "Demo Mode (Mock AI Active)";
            text.className = "text-amber-300 font-medium";
        }
    } catch (err) {
        dot.className = "w-2 h-2 rounded-full bg-rose-400";
        text.textContent = "Server Offline";
        text.className = "text-rose-400 font-medium";
    }
}

// Handle Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const payload = {
        name: document.getElementById("nameInput").value.trim() || "User",
        age: parseInt(document.getElementById("ageInput").value, 10),
        gender: document.getElementById("genderInput").value,
        height: parseFloat(document.getElementById("heightInput").value),
        weight: parseFloat(document.getElementById("weightInput").value),
        activityLevel: document.getElementById("activityInput").value,
        goal: document.getElementById("goalInput").value,
        environment: document.getElementById("environmentInput").value,
        diet: document.getElementById("dietInput").value,
        limitations: document.getElementById("limitationsInput").value.trim() || "None"
    };

    // UI state transitions
    document.getElementById("emptyState").classList.add("hidden");
    document.getElementById("planContainer").classList.add("hidden");
    document.getElementById("loadingState").classList.remove("hidden");

    const generateBtn = document.getElementById("generateBtn");
    generateBtn.disabled = true;
    generateBtn.classList.add("opacity-75", "cursor-not-allowed");

    try {
        const response = await fetch("/api/generate-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Failed to generate plan");
        }

        currentPlan = data.plan;
        renderPlan(data.plan, data.isMock);

    } catch (error) {
        console.error("Error generating plan:", error);
        alert("An error occurred while generating your plan: " + error.message);
        document.getElementById("emptyState").classList.remove("hidden");
    } finally {
        document.getElementById("loadingState").classList.add("hidden");
        generateBtn.disabled = false;
        generateBtn.classList.remove("opacity-75", "cursor-not-allowed");
    }
}

// Render Plan Data to DOM
function renderPlan(plan, isMock) {
    const analysis = plan.analysis || {};
    const nutrition = plan.nutrition || {};
    const workout = plan.workoutPlan || {};
    const lifestyle = plan.lifestyleAdvice || [];

    // Header & Greeting
    document.getElementById("planUserGreeting").textContent = analysis.userGreeting || "Your Custom Regimen";
    document.getElementById("planSummaryText").textContent = analysis.summary || "";

    // Source Badge
    const sourceBadge = document.getElementById("planSourceBadge");
    if (isMock) {
        sourceBadge.textContent = "AI Demo Engine";
        sourceBadge.className = "px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20";
    } else {
        sourceBadge.textContent = "Gemini 2.5 Live AI";
        sourceBadge.className = "px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20";
    }

    // Biometrics
    document.getElementById("metricHealthyWeight").textContent = analysis.healthyWeightRange || "N/A";
    document.getElementById("metricBmi").textContent = analysis.bmi || "N/A";
    
    const bmiCatEl = document.getElementById("metricBmiCategory");
    bmiCatEl.textContent = analysis.bmiCategory || "Normal";
    if (analysis.bmiCategory === "Normal weight") {
        bmiCatEl.className = "text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-400/10";
    } else {
        bmiCatEl.className = "text-[10px] font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-400/10";
    }

    document.getElementById("metricCalories").textContent = `${analysis.targetCalories?.toLocaleString() || "2,000"} kcal`;
    document.getElementById("metricTdeeSub").textContent = `TDEE: ${analysis.tdee?.toLocaleString() || "N/A"} kcal`;

    const macros = analysis.macroBreakdown || {};
    document.getElementById("metricWater").textContent = `${macros.waterLiters || 3.0} L`;
    document.getElementById("macroProtein").textContent = `${macros.proteinGrams || 150}g`;
    document.getElementById("macroCarbs").textContent = `${macros.carbsGrams || 200}g`;
    document.getElementById("macroFats").textContent = `${macros.fatsGrams || 60}g`;

    // Dynamic Position of BMI Visual Gauge
    const bmiNum = parseFloat(analysis.bmi) || 22.0;
    // Map BMI 14 -> 36 to 5% -> 95%
    let gaugePercent = ((bmiNum - 14) / (36 - 14)) * 100;
    gaugePercent = Math.max(5, Math.min(95, gaugePercent));

    const pointerEl = document.getElementById("bmiGaugePointer");
    if (pointerEl) {
        pointerEl.style.left = `${gaugePercent}%`;
    }
    const pointerValEl = document.getElementById("bmiGaugePointerValue");
    if (pointerValEl) {
        pointerValEl.textContent = bmiNum.toFixed(1);
    }
    const zoneTextEl = document.getElementById("bmiZoneText");
    if (zoneTextEl) {
        zoneTextEl.textContent = `${analysis.bmiCategory || "Normal Zone"} (Target: ${analysis.healthyWeightRange || "Normal"})`;
    }

    // Render Workouts (Tab 1)
    renderWorkouts(workout);

    // Render Nutrition (Tab 2)
    renderNutrition(nutrition);

    // Render Lifestyle (Tab 3)
    renderLifestyle(lifestyle);

    // Show plan container
    const container = document.getElementById("planContainer");
    container.classList.remove("hidden");
    container.classList.add("animate-fade-in");

    // Re-initialize icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Scroll to plan on mobile
    if (window.innerWidth < 1024) {
        container.scrollIntoView({ behavior: "smooth" });
    }
}

// Render 7-Day Workout Protocol
function renderWorkouts(workout) {
    const container = document.getElementById("tabWorkoutContent");
    const days = workout.days || [];

    if (days.length === 0) {
        container.innerHTML = `<p class="text-sm text-slate-400">No workout days returned.</p>`;
        return;
    }

    let html = `<div class="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
        <span>${workout.splitName || "7-Day Personalized Schedule"}</span>
        <span class="text-emerald-400">7 Days Complete</span>
    </div>`;

    days.forEach((day, index) => {
        const isRest = (day.type || "").toLowerCase().includes("rest");
        const exercises = day.exercises || [];

        html += `
        <div class="day-card bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div class="flex items-center space-x-2">
                    <span class="w-6 h-6 rounded-md bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                        ${index + 1}
                    </span>
                    <h4 class="text-sm font-bold text-white">${day.day || `Day ${index + 1}`}</h4>
                    <span class="text-[11px] px-2 py-0.5 rounded-full ${isRest ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'} font-semibold">
                        ${day.type || "Training"}
                    </span>
                </div>
                <div class="text-[11px] text-slate-400 flex items-center space-x-2">
                    <span>${day.focus || ""}</span>
                    <span>•</span>
                    <span class="font-medium text-slate-300">${day.duration || "45 min"}</span>
                </div>
            </div>

            ${exercises.length > 0 ? `
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="text-slate-500 border-b border-slate-800/80">
                                <th class="pb-2 font-medium w-8 text-center" title="Mark Done">Log</th>
                                <th class="pb-2 font-medium">Exercise</th>
                                <th class="pb-2 font-medium text-center">Sets</th>
                                <th class="pb-2 font-medium text-center">Reps</th>
                                <th class="pb-2 font-medium text-center">Rest</th>
                                <th class="pb-2 font-medium">Technique & Visual</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/50">
                            ${exercises.map((ex, exIdx) => {
                                const checkKey = `done_d${index}_e${exIdx}`;
                                const isDone = localStorage.getItem(checkKey) === 'true';
                                const safeName = encodeURIComponent(ex.name);
                                return `
                                <tr class="text-slate-300 hover:bg-slate-800/40 transition-colors">
                                    <td class="py-2.5 text-center">
                                        <input type="checkbox" onchange="toggleExerciseCheck('${checkKey}', this.checked)" ${isDone ? 'checked' : ''} class="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500 cursor-pointer">
                                    </td>
                                    <td class="py-2.5 font-semibold text-white">
                                        <span>${ex.name}</span>
                                    </td>
                                    <td class="py-2.5 text-center text-emerald-400 font-bold">${ex.sets || "3"}</td>
                                    <td class="py-2.5 text-center text-slate-300">${ex.reps || "10-12"}</td>
                                    <td class="py-2.5 text-center text-slate-400 text-[11px]">${ex.rest || "60s"}</td>
                                    <td class="py-2.5">
                                        <div class="flex items-center space-x-2 justify-between">
                                            <span class="text-[11px] text-slate-400 italic">${ex.cue || ex.notes || "Controlled tempo"}</span>
                                            <button onclick="openExerciseModal('${safeName}')" class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1 transition-colors flex-shrink-0" title="View Technique & Visual Form">
                                                <i data-lucide="eye" class="w-3 h-3"></i>
                                                <span>Form Guide</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `}).join('')}
                        </tbody>
                    </table>
                </div>
            ` : `
                <p class="text-xs text-slate-400 italic">Rest and hydration day. Gentle walks or mobility stretches recommended.</p>
            `}
        </div>`;
    });

    container.innerHTML = html;
}

// Render Nutrition Strategy
function renderNutrition(nutrition) {
    const container = document.getElementById("tabNutritionContent");
    const meals = nutrition.meals || [];
    const tips = nutrition.tips || [];

    let html = `
    <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4 mb-4">
        <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Strategic Dietary Focus</h4>
        <p class="text-sm text-slate-200">${nutrition.focus || "Caloric balance and steady protein synthesis."}</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${meals.map(m => `
            <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold uppercase text-emerald-400">${m.meal}</span>
                        <span class="text-xs font-extrabold text-white">${m.calories || "500"} kcal</span>
                    </div>
                    <h5 class="text-sm font-bold text-white mb-1">${m.title || m.meal}</h5>
                    <p class="text-xs text-slate-400 leading-relaxed">${m.description || ""}</p>
                </div>
                ${m.macros ? `
                    <div class="mt-3 pt-2 border-t border-slate-800 text-[11px] font-semibold text-teal-300">
                        ${m.macros}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>

    ${tips.length > 0 ? `
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mt-3">
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-400"></i>
                <span>Dietitian Guidelines</span>
            </h4>
            <ul class="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                ${tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
    ` : ''}`;

    container.innerHTML = html;
}

// Render Lifestyle & Recovery Advice
function renderLifestyle(lifestyle) {
    const container = document.getElementById("tabLifestyleContent");

    if (lifestyle.length === 0) {
        container.innerHTML = `<p class="text-sm text-slate-400">No lifestyle guidelines found.</p>`;
        return;
    }

    let html = `
    <div class="grid grid-cols-1 gap-3">
        ${lifestyle.map(item => `
            <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-start space-x-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i data-lucide="shield-check" class="w-4 h-4"></i>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-white mb-1">${item.title}</h4>
                    <p class="text-xs text-slate-400 leading-relaxed">${item.tip}</p>
                </div>
            </div>
        `).join('')}
    </div>`;

    container.innerHTML = html;
}

// Switch Plan Tabs (Reliable fix for all tab IDs)
function switchPlanTab(tab) {
    const normalized = (tab === "workouts" || tab === "workout") ? "workout" : tab;
    const tabConfigs = [
        { key: "workout", btnId: "tabWorkoutBtn", contentId: "tabWorkoutContent" },
        { key: "nutrition", btnId: "tabNutritionBtn", contentId: "tabNutritionContent" },
        { key: "lifestyle", btnId: "tabLifestyleBtn", contentId: "tabLifestyleContent" }
    ];

    tabConfigs.forEach(t => {
        const btn = document.getElementById(t.btnId);
        const content = document.getElementById(t.contentId);
        if (!btn || !content) return;

        if (t.key === normalized) {
            btn.className = "pb-3 text-sm font-bold text-emerald-400 border-b-2 border-emerald-400 flex items-center space-x-2";
            content.classList.remove("hidden");
        } else {
            btn.className = "pb-3 text-sm font-semibold text-slate-400 hover:text-white flex items-center space-x-2";
            content.classList.add("hidden");
        }
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

// Interactive Coach Chat Submission
async function handleChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("chatInput");
    const msg = input.value.trim();
    if (!msg) return;

    input.value = "";
    appendChatMessage("user", msg);

    const chatSendBtn = document.getElementById("chatSendBtn");
    chatSendBtn.disabled = true;

    // Build context summary from current plan
    let contextSummary = "";
    if (currentPlan && currentPlan.analysis) {
        contextSummary = `User goal: ${document.getElementById("goalInput").value}, Calorie target: ${currentPlan.analysis.targetCalories}, Split: ${currentPlan.workoutPlan?.splitName}`;
    }

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: msg,
                contextSummary: contextSummary,
                history: chatHistory
            })
        });

        const data = await res.json();
        if (data.success && data.reply) {
            appendChatMessage("coach", data.reply);
            chatHistory.push({ user: msg, coach: data.reply });
        } else {
            appendChatMessage("coach", "I'm having a little trouble connecting to the network. Keep up the great work on your routine!");
        }
    } catch (err) {
        appendChatMessage("coach", "Connection error. Please verify your server is running.");
    } finally {
        chatSendBtn.disabled = false;
    }
}

function appendChatMessage(sender, text) {
    const container = document.getElementById("chatMessages");
    const isUser = sender === "user";

    const msgDiv = document.createElement("div");
    msgDiv.className = `flex items-start space-x-2 ${isUser ? 'justify-end' : ''}`;

    msgDiv.innerHTML = isUser ? `
        <div class="bg-emerald-600/90 text-white rounded-xl rounded-tr-none p-3 max-w-[85%] leading-relaxed">
            ${text}
        </div>
        <div class="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">
            You
        </div>
    ` : `
        <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">
            AI
        </div>
        <div class="bg-slate-800/80 rounded-xl rounded-tl-none p-3 text-slate-200 max-w-[85%] leading-relaxed border border-slate-700/50">
            ${text}
        </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function sendQuickPrompt(promptText) {
    document.getElementById("chatInput").value = promptText;
    document.getElementById("chatForm").dispatchEvent(new Event("submit"));
}

// Exercise Form & Visual Diagram Database
const EXERCISE_GUIDES = {
    "bench": {
        title: "Barbell / Dumbbell Bench Press",
        muscle: "Chest (Pectorals), Front Delts, Triceps",
        type: "Compound Upper Push",
        svg: `<svg viewBox="0 0 200 120" class="w-48 h-32 text-emerald-400 stroke-current fill-none stroke-2">
            <rect x="30" y="80" width="140" height="8" rx="2" class="fill-slate-800 stroke-slate-700"/>
            <line x1="50" y1="88" x2="45" y2="110" class="stroke-slate-700 stroke-[3]"/>
            <line x1="150" y1="88" x2="155" y2="110" class="stroke-slate-700 stroke-[3]"/>
            <path d="M 60 76 Q 100 74 140 76" class="stroke-emerald-400 stroke-[5]"/>
            <circle cx="50" cy="74" r="7" class="fill-emerald-400/20 stroke-emerald-400"/>
            <path d="M 95 75 L 100 45 L 90 25" class="stroke-emerald-300 stroke-[3]"/>
            <path d="M 105 75 L 100 45 L 110 25" class="stroke-emerald-300 stroke-[3]"/>
            <line x1="60" y1="25" x2="140" y2="25" class="stroke-cyan-400 stroke-[4]"/>
            <circle cx="65" cy="25" r="9" class="fill-cyan-400/30 stroke-cyan-400 stroke-2"/>
            <circle cx="135" cy="25" r="9" class="fill-cyan-400/30 stroke-cyan-400 stroke-2"/>
        </svg>`,
        steps: [
            "Plant feet firmly into the floor. Grip the bar slightly wider than shoulder-width.",
            "Retract shoulder blades into the bench and unrack the weight with locked wrists.",
            "Lower with control to your mid-chest, keeping elbows tucked at 45 to 70 degrees.",
            "Press upward explosively through your chest without bouncing off the ribs."
        ],
        mistakes: "Flaring elbows to 90 degrees puts excess shear stress on the shoulders. Bouncing the barbell reduces pectoral hypertrophy."
    },
    "squat": {
        title: "Barbell / Goblet Squat",
        muscle: "Quadriceps, Glutes, Adductors, Core",
        type: "Compound Lower Body Push",
        svg: `<svg viewBox="0 0 200 120" class="w-48 h-32 text-emerald-400 stroke-current fill-none stroke-2">
            <line x1="20" y1="112" x2="180" y2="112" class="stroke-slate-700 stroke-2"/>
            <circle cx="95" cy="30" r="7" class="fill-emerald-400/20 stroke-emerald-400"/>
            <line x1="95" y1="37" x2="85" y2="65" class="stroke-emerald-400 stroke-[4]"/>
            <line x1="85" y1="65" x2="115" y2="68" class="stroke-emerald-400 stroke-[4]"/>
            <line x1="115" y1="68" x2="110" y2="110" class="stroke-emerald-300 stroke-[4]"/>
            <line x1="60" y1="36" x2="130" y2="36" class="stroke-cyan-400 stroke-[4]"/>
            <circle cx="65" cy="36" r="8" class="fill-cyan-400/30 stroke-cyan-400"/>
            <circle cx="125" cy="36" r="8" class="fill-cyan-400/30 stroke-cyan-400"/>
        </svg>`,
        steps: [
            "Stand with feet shoulder-width apart, toes pointed slightly outward (15-30 degrees).",
            "Inhale, brace your core 360-degrees, and break at hips and knees simultaneously.",
            "Descend until thighs are at least parallel to the floor, keeping knees tracking toes.",
            "Drive up through the midfoot to return to full hip extension."
        ],
        mistakes: "Allowing knees to cave inward (valgus collapse) or letting your heels lift off the ground."
    },
    "deadlift": {
        title: "Romanian / Barbell Deadlift",
        muscle: "Hamstrings, Gluteus Maximus, Lower Back, Lats",
        type: "Compound Posterior Chain",
        svg: `<svg viewBox="0 0 200 120" class="w-48 h-32 text-emerald-400 stroke-current fill-none stroke-2">
            <line x1="20" y1="112" x2="180" y2="112" class="stroke-slate-700 stroke-2"/>
            <circle cx="80" cy="35" r="7" class="fill-emerald-400/20 stroke-emerald-400"/>
            <line x1="80" y1="42" x2="115" y2="68" class="stroke-emerald-400 stroke-[4]"/>
            <line x1="115" y1="68" x2="110" y2="110" class="stroke-emerald-400 stroke-[4]"/>
            <line x1="90" y1="50" x2="90" y2="95" class="stroke-emerald-300 stroke-[3]"/>
            <circle cx="90" cy="95" r="10" class="fill-cyan-400/30 stroke-cyan-400 stroke-2"/>
        </svg>`,
        steps: [
            "Maintain soft knees and push your hips straight back as if closing a door behind you.",
            "Keep the bar tight against your shins and thighs with your spine locked in neutral.",
            "Lower until you feel a deep stretch in the hamstrings (around mid-shin height).",
            "Drive hips forward through the glutes to lock out standing tall."
        ],
        mistakes: "Rounding the lower spine or turning the movement into a squat by bending knees too much."
    },
    "row": {
        title: "Dumbbell / Cable Row",
        muscle: "Lats, Rhomboids, Rear Delts, Biceps",
        type: "Compound Upper Pull",
        svg: `<svg viewBox="0 0 200 120" class="w-48 h-32 text-emerald-400 stroke-current fill-none stroke-2">
            <line x1="20" y1="112" x2="180" y2="112" class="stroke-slate-700 stroke-2"/>
            <circle cx="85" cy="35" r="7" class="fill-emerald-400/20 stroke-emerald-400"/>
            <line x1="85" y1="42" x2="115" y2="70" class="stroke-emerald-400 stroke-[4]"/>
            <line x1="115" y1="70" x2="110" y2="110" class="stroke-emerald-400 stroke-[4]"/>
            <path d="M 92 50 L 105 55 L 100 45" class="stroke-cyan-400 stroke-[3]"/>
            <circle cx="100" cy="45" r="6" class="fill-cyan-400/30 stroke-cyan-400"/>
        </svg>`,
        steps: [
            "Hinge forward at 45 degrees with flat spine and abs braced.",
            "Pull your elbows back towards your hip bone, driving through the lats.",
            "Squeeze your shoulder blades together at the top of the contraction for 1 second.",
            "Lower smoothly with control for a full lat stretch."
        ],
        mistakes: "Yanking with the arms or using momentum by standing up during the pull."
    },
    "press": {
        title: "Overhead Shoulder Press",
        muscle: "Deltoids (Shoulders), Triceps, Upper Chest",
        type: "Compound Vertical Push",
        svg: `<svg viewBox="0 0 200 120" class="w-48 h-32 text-emerald-400 stroke-current fill-none stroke-2">
            <line x1="20" y1="112" x2="180" y2="112" class="stroke-slate-700 stroke-2"/>
            <circle cx="100" cy="38" r="7" class="fill-emerald-400/20 stroke-emerald-400"/>
            <line x1="100" y1="45" x2="100" y2="85" class="stroke-emerald-400 stroke-[4]"/>
            <line x1="100" y1="85" x2="95" y2="112" class="stroke-emerald-400 stroke-[3]"/>
            <line x1="100" y1="85" x2="105" y2="112" class="stroke-emerald-400 stroke-[3]"/>
            <line x1="90" y1="50" x2="85" y2="20" class="stroke-emerald-300 stroke-[3]"/>
            <line x1="110" y1="50" x2="115" y2="20" class="stroke-emerald-300 stroke-[3]"/>
            <line x1="60" y1="18" x2="140" y2="18" class="stroke-cyan-400 stroke-[4]"/>
            <circle cx="65" cy="18" r="7" class="fill-cyan-400/30 stroke-cyan-400"/>
            <circle cx="135" cy="18" r="7" class="fill-cyan-400/30 stroke-cyan-400"/>
        </svg>`,
        steps: [
            "Start with weight at chin/shoulder height, forearms vertical.",
            "Squeeze glutes and brace core to protect the lower spine.",
            "Press the weights straight overhead in a smooth vertical bar path.",
            "Lock out overhead and lower under control."
        ],
        mistakes: "Arching your lower back backward excessively to push the weight."
    },
    "plank": {
        title: "Forearm Plank / Core Hold",
        muscle: "Abdominals, Deep Core, Glutes, Shoulders",
        type: "Isometric Core Stability",
        svg: `<svg viewBox="0 0 200 120" class="w-48 h-32 text-emerald-400 stroke-current fill-none stroke-2">
            <line x1="20" y1="105" x2="180" y2="105" class="stroke-slate-700 stroke-2"/>
            <circle cx="50" cy="65" r="7" class="fill-emerald-400/20 stroke-emerald-400"/>
            <line x1="57" y1="68" x2="150" y2="78" class="stroke-emerald-400 stroke-[5]"/>
            <line x1="68" y1="70" x2="68" y2="105" class="stroke-cyan-400 stroke-[3]"/>
            <line x1="150" y1="78" x2="150" y2="105" class="stroke-cyan-400 stroke-[3]"/>
        </svg>`,
        steps: [
            "Place elbows under shoulders with forearms flat on the ground.",
            "Form a rigid straight line from head to heels.",
            "Contract glutes and pull belly button toward your spine.",
            "Hold steadily while breathing through the diaphragm."
        ],
        mistakes: "Sagging hips in the lower back or raising hips high like a tent."
    }
};

// Exercise Modal Controller
function openExerciseModal(encodedName) {
    const rawName = decodeURIComponent(encodedName);
    const lower = rawName.toLowerCase();

    let guide = null;
    for (const key of Object.keys(EXERCISE_GUIDES)) {
        if (lower.includes(key)) {
            guide = EXERCISE_GUIDES[key];
            break;
        }
    }

    if (!guide) {
        guide = {
            title: rawName,
            muscle: "Targeted Kinetic Chain",
            type: "Resistance Training",
            svg: `<svg viewBox="0 0 200 120" class="w-48 h-32 text-emerald-400 stroke-current fill-none stroke-2">
                <circle cx="100" cy="40" r="10" class="fill-emerald-400/20 stroke-emerald-400"/>
                <line x1="100" y1="50" x2="100" y2="85" class="stroke-emerald-400 stroke-[4]"/>
                <line x1="100" y1="85" x2="80" y2="110" class="stroke-emerald-300 stroke-[3]"/>
                <line x1="100" y1="85" x2="120" y2="110" class="stroke-emerald-300 stroke-[3]"/>
                <line x1="80" y1="65" x2="120" y2="65" class="stroke-cyan-400 stroke-[3]"/>
            </svg>`,
            steps: [
                "Establish a grounded, balanced athletic posture with core engaged.",
                "Inhale and stabilize your torso before initiating the movement.",
                "Perform the lifting phase smoothly through full pain-free range of motion.",
                "Control the lowering phase for 2 to 3 seconds to maximize muscular stimulation."
            ],
            mistakes: "Rushing repetitions or compromising posture under fatigue."
        };
    }

    document.getElementById("modalExerciseTitle").textContent = guide.title;
    document.getElementById("modalMuscleBadge").textContent = `Primary: ${guide.muscle}`;
    document.getElementById("modalTypeBadge").textContent = guide.type;
    document.getElementById("modalIllustrationContainer").innerHTML = guide.svg;

    const stepList = document.getElementById("modalStepList");
    stepList.innerHTML = guide.steps.map(step => `<li class="py-0.5">${step}</li>`).join('');

    document.getElementById("modalMistakesText").textContent = guide.mistakes;

    const modal = document.getElementById("exerciseModal");
    modal.classList.remove("hidden");

    if (window.lucide) lucide.createIcons();
}

function closeExerciseModal() {
    const modal = document.getElementById("exerciseModal");
    if (modal) modal.classList.add("hidden");
}

// Hydration Tracker Controller
function updateWaterUI() {
    const container = document.getElementById("waterGlassesContainer");
    if (!container) return;

    let html = "";
    for (let i = 1; i <= TARGET_GLASSES; i++) {
        const isFilled = i <= currentWaterGlasses;
        html += `
            <button onclick="toggleWaterGlass(${i})" class="p-1.5 rounded-lg transition-transform transform active:scale-90 ${isFilled ? 'text-cyan-400 bg-cyan-500/20 border border-cyan-500/40 shadow-sm shadow-cyan-500/20' : 'text-slate-600 bg-slate-900 border border-slate-800 hover:text-slate-400'}" title="Glass ${i} (250ml)">
                <i data-lucide="glass-water" class="w-4 h-4"></i>
            </button>
        `;
    }
    container.innerHTML = html;

    const progressEl = document.getElementById("waterProgressText");
    if (progressEl) {
        const totalLiters = (currentWaterGlasses * 0.25).toFixed(1);
        progressEl.textContent = `${currentWaterGlasses} / ${TARGET_GLASSES} glasses (${totalLiters}L)`;
    }

    if (window.lucide) lucide.createIcons();
}

function toggleWaterGlass(glassNum) {
    if (currentWaterGlasses === glassNum) {
        currentWaterGlasses = glassNum - 1;
    } else {
        currentWaterGlasses = glassNum;
    }
    localStorage.setItem("pulsecoach_water_glasses", currentWaterGlasses);
    updateWaterUI();
}

function toggleExerciseCheck(checkKey, isChecked) {
    localStorage.setItem(checkKey, isChecked ? 'true' : 'false');
}

// Local Storage Save & Load Plan
function savePlanToLocalStorage() {
    if (!currentPlan) {
        alert("Please generate a coaching plan first before saving!");
        return;
    }
    const profile = {
        plan: currentPlan,
        savedDate: new Date().toLocaleDateString('sv-SE'),
        name: document.getElementById("nameInput").value,
        age: document.getElementById("ageInput").value,
        height: document.getElementById("heightInput").value,
        weight: document.getElementById("weightInput").value,
        gender: document.getElementById("genderInput").value
    };
    localStorage.setItem("pulsecoach_saved_plan", JSON.stringify(profile));
    alert("✅ Plan successfully saved! It will be remembered on this computer.");
}

function loadPlanFromLocalStorage() {
    const savedStr = localStorage.getItem("pulsecoach_saved_plan");
    if (!savedStr) {
        alert("No saved plan found in browser memory. Generate and save a plan first!");
        return;
    }
    try {
        const profile = JSON.parse(savedStr);
        currentPlan = profile.plan;
        if (profile.name) document.getElementById("nameInput").value = profile.name;
        if (profile.age) document.getElementById("ageInput").value = profile.age;
        if (profile.height) document.getElementById("heightInput").value = profile.height;
        if (profile.weight) document.getElementById("weightInput").value = profile.weight;
        if (profile.gender) document.getElementById("genderInput").value = profile.gender;

        document.getElementById("emptyState").classList.add("hidden");
        renderPlan(currentPlan, false);
        alert(`✅ Loaded saved regimen from ${profile.savedDate}!`);
    } catch (e) {
        alert("Error loading saved plan: " + e.message);
    }
}
