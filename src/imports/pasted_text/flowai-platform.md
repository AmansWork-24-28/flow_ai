Create a full-stack SaaS web application called “FlowAI – Intelligent Workforce Operations Platform”.

This system helps managers input company details, define workforce structure based on industry, run operational simulations, and view analytics through a multi-tab enterprise dashboard.

The system must follow a strict multi-step workflow:

STEP 1 → COMPANY SETUP  
STEP 2 → INDUSTRY SELECTION  
STEP 3 → OPERATIONAL DATA INPUT (ROLE-BASED DYNAMIC TABLES)  
STEP 4 → ENTERPRISE DASHBOARD (MULTI-TAB SYSTEM)

---

# 🧩 STEP 1: COMPANY INFORMATION SCREEN

Create a clean onboarding form page.

Fields:
- Company Name (text input)
- Country (dropdown list of countries)
- Region (dropdown dependent on country)
- Manager Name (text input)
- Official Email (email input)

Validation:
- All fields required
- Email must be valid format

Button:
→ “Continue”

On submit:
Store data as global state: companyProfile

---

# 🌍 STEP 2: INDUSTRY SELECTION SCREEN

After submission, navigate to Industry Selection.

Display 6 selectable industry cards:

- Logistics & Supply Chain
- Healthcare & Hospitals
- Manufacturing
- Public Transport & Mobility
- Municipal / Disaster Management
- IT Operations

Each card includes:
- Icon
- Name
- Short description
- Hover effect

On selection:
Set global state: selectedIndustry

Then proceed to next screen automatically.

---

# 📊 STEP 3: OPERATIONAL DATA INPUT (DYNAMIC ROLE ENGINE)

This is the MOST IMPORTANT SCREEN.

When an industry is selected, dynamically generate a ROLE-BASED WORKFORCE TABLE.

---

## 🧠 CORE CONCEPT

Each industry has:
- Roles (people)
- Assets (optional physical resources)
- Critical role tagging system

---

# 🚚 INDUSTRY ROLE STRUCTURES

---

## 🚚 Logistics & Supply Chain

Roles:
- Driver
- Dispatcher
- Warehouse Staff
- Route Planner
- Delivery Executive

Assets:
- Trucks
- Delivery Vans
- Warehouses

---

## 🏥 Healthcare & Hospitals

Roles:
- Doctor
- Nurse
- Surgeon
- Pharmacist
- Lab Technician
- Emergency Staff

Assets:
- Ambulances
- ICU Beds
- Medical Equipment

---

## 🏭 Manufacturing

Roles:
- Machine Operator
- Quality Inspector
- Maintenance Engineer
- Production Supervisor

Assets:
- Machines
- Production Lines
- Warehouses

---

## 🚌 Public Transport & Mobility

Roles:
- Driver
- Conductor
- Fleet Manager
- Route Coordinator

Assets:
- Buses
- Trains
- Depots

---

## 🏙️ Municipal / Disaster Management

Roles:
- Field Worker
- Emergency Responder
- Utility Technician
- Coordinator

Assets:
- Rescue Vehicles
- Equipment Units

---

## 💻 IT Operations

Roles:
- Software Engineer
- DevOps Engineer
- Incident Manager
- Support Engineer
- System Admin

Assets:
- Servers
- Cloud Systems
- Monitoring Tools

---

# 🧾 ROLE TABLE UI (IMPORTANT)

For selected industry, generate a dynamic editable table:

Columns:

- Role Name
- Number of Employees (numeric input)
- Critical Role (checkbox toggle)
- Priority Level (1–5 dropdown optional)

---

# ⚠️ CRITICAL ROLE LOGIC

If a role is marked as “Critical”:
- Its absence increases system risk significantly
- It becomes a key dependency in simulation engine

---

# ➕ ADD CUSTOM ROLE FEATURE

Button:
→ “+ Add New Role”

Modal fields:
- Role Name
- Number of Employees
- Critical Role toggle

Allow dynamic addition to table.

---

# 💾 DATA EXPORT REQUIREMENT

After submission of operational data:

- Save all data into a structured “Company Data Sheet”
- Format: Excel-style structured dataset (internally representable as spreadsheet)

Data must include:
- Company Profile
- Industry
- Roles & counts
- Critical role flags
- Assets
- Timestamp

This dataset must be updatable over time (versioned records).

---

# 🚀 STEP 4: ENTERPRISE DASHBOARD (MULTI-TAB SYSTEM)

After submitting operational data, user lands on a professional dashboard (like the provided reference image).

Create top navigation tabs:

- Dashboard
- Simulator
- Routes
- AI Insights
- Analytics

---

🟦 1. DASHBOARD TAB (EXECUTIVE OVERVIEW)
🎯 Purpose:
Provide a high-level real-time summary of company operations, workforce health, and risk status in a single executive view.
🧩 CONTENT STRUCTURE:
📊 KPI SUMMARY CARDS:
Total Workforce Count
Active Operational Capacity (%)
System Efficiency Score
Current Risk Level (Low / Medium / High)
Critical Alerts Count

📈 PERFORMANCE VISUALIZATIONS:
Workforce vs Demand trend chart
Capacity utilization gauge chart
Risk level progression over time

⚠️ LIVE ALERT PANEL:
Displays real-time operational issues such as:
Critical role shortages
Department overload warnings
Resource imbalance alerts
 Each alert includes severity color coding and affected department.

🧠 AI SUMMARY INSIGHT:
A short automated analysis describing current system health, key risks, and operational stability in natural language.

🔁 OUTPUT:
A clear executive snapshot of company-wide operational health.

🧠 2. SIMULATOR TAB (SCENARIO-DRIVEN ENGINE)
🎯 Purpose:
Allow users to simulate real-world disruption scenarios and analyze their operational impact on workforce, assets, and service delivery.
🧩 CONTENT STRUCTURE:
📌 SCENARIO SELECTOR (LEFT PANEL):
User selects one scenario:
Driver Shortage
Demand Surge
Disaster Response
Rural Depopulation
IT System Outage
Each scenario defines predefined simulation rules and impact multipliers.

📊 PRE-SIMULATION METRICS:
Live preview cards showing:
Workforce availability
Service capacity estimate
Predicted delay impact
Estimated cost impact
Risk level indicator

⚙️ SIMULATION CONTROLS:
Demand multiplier slider
Absentee rate control
Operational stress level selector
Asset availability inputs (vehicles, systems, etc.)

🔘 SIMULATION EXECUTION:
A “Run Simulation” button triggers calculation engine.

📊 POST-SIMULATION RESULTS:
Before vs After comparison charts
Capacity drop analysis
Delay and efficiency impact metrics
Bottleneck detection results

🧠 AI RECOVERY STRATEGIES:
AI-generated optimization suggestions such as:
Workforce reallocation
Route or process optimization
Shift restructuring
Resource balancing recommendations

🔁 OUTPUT:
Simulation-based decision intelligence for “what-if” analysis.

🛣️ 3. ROUTES TAB (OPERATION FLOW OPTIMIZATION)
🎯 Purpose:
Visualize and optimize movement of resources, people, and operations across the system depending on industry type.
🧩 CONTENT STRUCTURE:
🗺️ INDUSTRY-SPECIFIC FLOW VIEW:
Logistics: delivery routes, warehouse-to-customer paths
Healthcare: ambulance routing, emergency priority flows
Manufacturing: production line dependency flow
Transport: bus/train network optimization paths

⚠️ ROUTE ISSUE DETECTION:
Delay-prone routes
Congestion or overload zones
Bottleneck nodes in operational flow

🤖 AI ROUTE OPTIMIZATION:
Suggested route improvements
Load balancing across routes
Resource redistribution recommendations
Efficiency improvement suggestions

🔁 OUTPUT:
Optimized operational flow visualization and route intelligence.

🤖 4. AI INSIGHTS TAB (DECISION ENGINE OUTPUT)
🎯 Purpose:
Act as an AI operations advisor that continuously analyzes system state and provides actionable decisions.
🧩 CONTENT STRUCTURE:
🧠 AI INSIGHT CARDS:
Each card contains:
Detected operational issue
Severity level (Low / Medium / High / Critical)
Root cause explanation
Recommended action

💡 EXAMPLE INSIGHTS:
Workforce imbalance detected in logistics department
Critical healthcare role shortage increasing system risk
IT incident response delay above threshold
Manufacturing line efficiency drop detected

⚙️ ACTIONABLE RECOMMENDATIONS:
Reassign workforce across departments
Hire temporary or contract staff suggestions
Shift timing optimization
Load redistribution strategies

🔁 OUTPUT:
AI-driven operational decision support system.

📈 5. ANALYTICS TAB (PREDICTIVE INTELLIGENCE LAYER)
🎯 Purpose:
Provide deep analytical insights, historical performance tracking, and predictive forecasting of system behavior.
🧩 CONTENT STRUCTURE:
📊 PERFORMANCE ANALYTICS:
Workforce utilization heatmaps
Efficiency trends over time
Demand vs supply gap analysis
Department-wise performance comparison

🧠 ROLE ANALYTICS:
Role-wise workload distribution
Critical role dependency impact
Bottleneck contribution scoring

🔮 PREDICTIVE INSIGHTS:
Future risk prediction (next 24h / 7 days)
Expected resource shortage areas
Operational failure probability forecast

📦 SIMULATION HISTORY:
Past scenario results tracking
Comparison between multiple simulations
Improvement tracking over time

🔁 OUTPUT:
Data-driven forecasting and performance intelligence for strategic planning.


---

# 🎨 DESIGN SYSTEM

- Modern enterprise SaaS UI
- Dark theme with blue accents
- Red = risk, Yellow = warning, Green = safe
- Clean card-based layout
- Minimal text, high clarity
- Executive dashboard style
- Inspired by real logistics control centers

---

# 🧭 USER FLOW

Company Setup → Industry Selection → Role-Based Input → Data Save → Dashboard → Simulation → Insights → Analytics


