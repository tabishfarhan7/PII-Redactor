# 🔏 SafeRedact: PII Redaction Studio

An intelligent, client-side application designed to automatically detect and safely redact Personally Identifiable Information (PII) from sensitive documents. 

Instead of relying on rigid regular expressions, this tool leverages Large Language Models (LLMs) to understand context, ensuring accurate detection of unstructured data like names, companies, and addresses while substituting them with realistic, safe placeholders.

---

## ⚙️ How It Works (Architecture)

The application is a single-page React app that delegates the heavy lifting of Named Entity Recognition (NER) to an AI model via API. 

1. **Dynamic Prompting:** When the user clicks "Redact", the app checks which PII categories are toggled `ON`. It then dynamically injects only those selected categories into a strict system prompt.
2. **Contextual Analysis (Groq + Llama 3.3):** The prompt and source text are sent to the Groq API. Because we use an LLM instead of Regex, the engine reads the *context* of the sentence to determine if a word is a person's name, a company, or a physical address.
3. **Structured JSON Output:** The API is forced to respond purely in JSON format using `response_format: { type: "json_object" }`.
4. **UI Rendering:** The React frontend parses the JSON response to instantly update the UI—displaying the safe text, rendering the statistical bar charts, and populating the audit ledger.

---

## 📊 Evaluation Criteria & Approach

### 1. Recall vs. Precision
When dealing with sensitive information, the balance between **Recall** (catching every instance) and **Precision** (avoiding false positives) is critical.

*   **High Recall (Priority):** The primary goal of a PII redactor is to ensure absolutely no sensitive data leaks. Traditional Regex scripts have terrible recall for unstructured text (like a person's name). By using Llama 3.3, this tool achieves exceptionally high recall, identifying context-dependent entities that pattern-matching would miss entirely.
*   **Precision (Trade-off):** Because the tool is instructed to be aggressive in catching potential PII, there is a minor trade-off in precision. It may occasionally flag fictional names, order numbers, or industry-specific jargon as PII (False Positives). **Choice rationale:** In data security, a false positive is highly preferable to a false negative. It is better to accidentally redact a benign serial number than to accidentally leak a real Credit Card number.

### 2. Code Quality & Extensibility
The codebase is designed to be highly readable, modular, and—most importantly—effortlessly extensible. 

**How to extend it to a new PII type:**
You do not need to write complex Regex patterns to add a new category. The application is entirely data-driven. To add a new PII type (e.g., "Passport Numbers"), you simply add one line to the `PII_TYPES` array at the top of `App.jsx`:

\`\`\`javascript
const PII_TYPES = [
  // ... existing types
  { id: "passport", label: "Passport Numbers", icon: <svg>...</svg> }
];
\`\`\`

The UI will automatically generate a new toggle button for it in the sidebar, and the dynamic `run()` function will automatically append "Passport Numbers" to the LLM instructions.

### 3. Communication
This README serves to clearly communicate the technical decisions, architecture, and deployment steps required to utilize the SafeRedact application.

---

## ✨ Features

- **Context-Aware Detection:** Recognizes entities based on sentence structure rather than just syntax.
- **Realistic Substitutions:** Replaces sensitive data with contextually accurate fake data (e.g., swapping a real name for a realistic fake name) to maintain document readability.
- **Granular Control:** Toggle specific PII scanners on or off (Names, Emails, Phones, Companies, Addresses, SSN/Tax IDs, Credit Cards, DOBs, IPs).
- **Audit Ledger:** Automatically generates a detailed breakdown of all redacted items, their original values, and their secure substitutes.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite
- **Styling:** Tailwind CSS
- **AI/Inference:** Groq API (`llama-3.3-70b-versatile`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- A free [Groq API Key](https://console.groq.com/keys)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/tabishfarhan7/PII-Redactor.git
   cd PII-Redactor
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up your environment variables:
   Create a `.env` file in the root directory and add your Groq API key:
   \`\`\`env
   VITE_GROQ_API_KEY=gsk_your_api_key_here
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

---

## 👤 Author

**Mohammad Tabish**
- GitHub: [@tabishfarhan7](https://github.com/tabishfarhan7)
