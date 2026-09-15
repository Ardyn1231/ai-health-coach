// PulseCoach AI — Frontend Application Logic

let currentPlan = null;
let chatHistory = [];

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Check Backend & AI status
    checkBackendStatus();

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
                                <th class="pb-2 font-medium">Exercise</th>
                                <th class="pb-2 font-medium text-center">Sets</th>
                                <th class="pb-2 font-medium text-center">Reps</th>
                                <th class="pb-2 font-medium text-center">Rest</th>
                                <th class="pb-2 font-medium">Coaching Cue</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/50">
                            ${exercises.map(ex => `
                                <tr class="text-slate-300">
                                    <td class="py-2 font-semibold text-white">${ex.name}</td>
                                    <td class="py-2 text-center text-emerald-400 font-bold">${ex.sets || "3"}</td>
                                    <td class="py-2 text-center text-slate-300">${ex.reps || "10-12"}</td>
                                    <td class="py-2 text-center text-slate-400 text-[11px]">${ex.rest || "60s"}</td>
                                    <td class="py-2 text-[11px] text-slate-400 italic">${ex.cue || ex.notes || "Controlled tempo"}</td>
                                </tr>
                            `).join('')}
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

// Switch Plan Tabs
function switchPlanTab(tab) {
    const tabs = ["workouts", "nutrition", "lifestyle"];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab${t.charAt(0).toUpperCase() + t.slice(1)}Btn`);
        const content = document.getElementById(`tab${t.charAt(0).toUpperCase() + t.slice(1)}Content`);

        if (t === tab) {
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
