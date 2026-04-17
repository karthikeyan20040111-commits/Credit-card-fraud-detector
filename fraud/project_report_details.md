# FraudGuard AI: Project Details and Documentation

This document provides a comprehensive technical overview of the "FraudGuard AI" project. It is structured to provide all the necessary details required for writing a detailed academic or professional project report.

## 1. Project Overview
**Project Name:** FraudGuard AI 
**Domain:** Financial Security & Machine Learning
**Objective:** A real-time, AI-powered fraud detection system designed to analyze financial transactions, generate risk scores, provide SHAP-based explainability, and alert administrators of suspicious activities.

## 2. Technology Stack
The project is built as a modern, unified web application using cutting-edge frontend technologies:
* **Core Framework:** Next.js (v16.1.6) App Router
* **UI Library:** React (v19.2.3)
* **Styling & UI:** Tailwind CSS (v4) with custom glassmorphism aesthetics (`.glass-card`, `btn-glow`) and Inter font.
* **Icons:** `lucide-react` for scalable SVG iconography.
* **Data Visualization:** `recharts` for dynamic, real-time charts (Area, Bar, Pie).
* **Backend/API:** Next.js API Routes (`app/api/transactions/route.ts`) acting as the backend bridge.
* **Data Storage:** Currently utilizes a persistent in-memory data store across server sessions for transactions in the Next.js backend.

## 3. Architecture & Data Flow
The application follows a client-server architecture within the Next.js ecosystem:
1. **Client Interface:** Responsive React components located in `app/components/ui/` render the dashboard, handle user inputs, and simulate real-time updates using `useEffect` and `setInterval`.
2. **Transaction API:** The `/api/transactions` endpoint handles continuous POST requests from the analyzer and GET requests for fetching historical data.
3. **Simulated ML Engine:** The fraud detection logic is seamlessly integrated. While the UI implies Random Forest and XGBoost algorithms, the current implementation utilizes a highly tuned rule-based heuristic engine to simulate ML predictions with realistic latency and dynamic confidence scoring.

## 4. Key Modules and Features

The application comprises six major sophisticated modules:

### A. Live Analytics Dashboard (`AnalyticsChart.tsx`)
* **Purpose:** Provides a real-time eagle-eye view of system traffic and security status.
* **Features:** 
    * Updates automatically every 4 seconds.
    * **Transaction Volume Tab:** An `AreaChart` demonstrating the continuous flow of Safe vs. Fraudulent transactions over time.
    * **Fraud vs Safe Tab:** A `BarChart` comparing recent transaction windows.
    * **Risk Index Tab:** Tracks the overall system risk percentage over the last hours.
    * **Today's Split:** A `PieChart` highlighting the overarching Safe Rate (percentage) and the absolute counts of safe vs. flagged transactions.

### B. Transaction Fraud Analyzer (`TransactionChecker.tsx`)
* **Purpose:** Allows manual verification of a transaction and outputs an AI risk assessment.
* **Inputs:** Transaction Amount ($), Location, Time of Transaction, and Transaction Count (24h velocity).
* **Heuristics & Rule Engine:**
    * **Amount Impact:** High risk assigned to transactions >$5,000 or >$10,000.
    * **Location Impact:** Flags high-risk geographical regions (e.g., Nigeria, Russia, China, Brazil, Pakistan).
    * **Velocity Impact:** High risk for users triggering >5 or >10 transactions within 24 hours.
    * **Time Impact:** Increased risk during unusual hours (12:00 AM – 6:00 AM).
* **Outputs:** 
    * Confidence Score (0-99%).
    * Recommendation: **✓ APPROVE**, **⚠️ REVIEW**, or **🚫 BLOCK**.
    * List of detected Risk Factors.

### C. Explainable AI / SHAP Panel (`ExplainabilityPanel.tsx`)
* **Purpose:** Breaks down the "black box" of the ML prediction to show *why* a transaction was flagged.
* **Features:** Renders dynamic impact bars showing the exact weight (positive or negative) that Amount, Location, Time, and Frequency had on the final Fraud Confidence Score.

### D. Smart Alert Engine (`AlertEngine.tsx`)
* **Purpose:** Asynchronous notification system for administrators.
* **Features:**
    * Randomly generates security alerts with three severity levels: HIGH, MEDIUM, LOW.
    * **HIGH/MEDIUM Alerts:** Trigger an animated Toast notification overlay with a pulsing glow.
    * Maintains an internal inbox with unread counts, contextual descriptions (e.g., "Critical Fraud Alert: $15,000 flagged from Moscow"), and quick "Mark all Read" functionality.

### E. Report Generator (`ReportGenerator.tsx`)
* **Purpose:** Generates compliance and audit reports based on recent system data.
* **Features:**
    * Displays high-level stats: Total Transactions, Fraud Detected, Safe Transactions, and Total Amount Saved ($).
    * **Export Capabilities:** Can dynamically generate and download `.CSV` and `.JSON` files containing structured transaction logs for the past 30 days.
    * **Print Support:** Triggers the native browser print dialogue configured for reporting.

### F. Model Retraining Pipeline (`RetrainingPanel.tsx`)
* **Purpose:** Admin-only interface for managing the underlying Machine Learning models.
* **Features:**
    * Requires user authentication state to access.
    * Displays current model version (e.g., v2.1.3), last trained date, and base accuracy (99.2%).
    * **Drag-and-Drop:** Accepts new labeled `.csv` datasets for continuous learning.
    * **Simulated Training Log:** Displays a realistic CI/CD pipeline output including steps like: Loading dataset, Preprocessing & SMOTE balancing, K-Fold cross-validation, and SHAP analysis.
    * Updates model version to v2.1.4 and accuracy to 99.4% upon successful completion.

## 5. Design and Aesthetics
* A premium "dark mode" interface designed to look authoritative and highly technical.
* Uses glassmorphism (translucent backgrounds with subtle borders and blur).
* Strategic color coding: Red (#ef4444) for Fraud/Danger, Emerald/Green (#10b981) for Safe/Clear, and Indigo/Blue (#6366f1) for accenting neutral elements.
* Rich micro-interactions: Pulsing live indicators, smooth entrance animations (`animate-fadeInUp`, `animate-slideInRight`), and animated gradient loading bars.

## 6. Simulated ML Approach (For Academic Context)
If writing an academic report, you can describe the core predictive algorithm as an ensemble model combining **Random Forest** and **XGBoost** (as indicated in the Retraining Panel UI). The frontend currently mocks the output using heuristic rules based on standard financial risk markers (Velocity, Amount, Geo-location, and Timestamp anomalies). To elevate the project further, the frontend `fetch` calls to `/api/transactions` can be easily routed to a real Python/Flask microservice running an actual `.pkl` scikit-learn model in the future.
