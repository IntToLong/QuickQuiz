# QuickQuiz AI

**QuickQuiz AI** is an interactive quiz platform powered by AI. It allows users to take engaging quizzes and receive instant feedback with explanations. Designed with a sleek UI and strong testing practices, QuickQuiz AI is built for learning, fun, and flexibility.

**Live Site**: [https://quick-quiz-delta.vercel.app/](https://quick-quiz-delta.vercel.app/)

## Preview
![home](https://github.com/user-attachments/assets/277d3482-018e-4ff8-800c-a344423484ae)

## Features

- AI-generated quizzes
- Real-time result summaries with detailed feedback
- Highlighting correct and incorrect answers
- Performance statistics and score breakdown
- Option to start a new quiz
- Modal interface for improved UX
- Fully tested with Jest + React Testing Library

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Testing**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/)
- **Styling**: CSS Modules
- **Routing**: Next.js built-in router
- **AI Integration**: [Google Gemini API](https://ai.google.dev/) (`@google/genai`)  
  - Quizzes are dynamically generated based on user-defined topic, complexity, and quantity.
  - Requests are handled via a `POST` endpoint using `generateContent()` from Gemini’s Flash model.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 16.x)
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/IntToLong/QuickQuiz.git
cd QuickQuiz

# Install dependencies
npm install
# or
yarn install

