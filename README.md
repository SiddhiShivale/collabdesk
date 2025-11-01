# CollabDesk: Intelligent Task Management Workspace

CollabDesk is a full-stack team collaboration platform built to simplify task management. It lets teams create, assign, and prioritize tasks with smart automation and visual analytics - helping everyone stay aligned and productive.

---

# ✨ Key Features

## 👥 Role-Based Access Control
- **Three-tier permission system:** Admin, Team Lead, and Member  
- **Secure authentication** with JWT tokens and refresh token rotation  
- **Fine-grained authorization** ensuring users access only permitted resources  

---

## 🗂️ Intelligent Task Management
- **Full CRUD operations** with comprehensive validation  
- **Task dependencies** to manage complex workflows  
- **Multi-user assignments** for collaborative tasks  
- **Due date tracking** with automated reminders  
- **Rich text descriptions** for detailed task specifications  

---

## ⚙️ Smart Prioritization Engine
- **Priority scoring** based on:
  - Task importance (High / Medium / Low)
  - Urgency (days until due date)
  - Workload balancing across team members  
- **Automatic task sorting** for optimal productivity  
- **Dependency-aware scheduling** preventing blocked workflows  

---

## 📈 Advanced Analytics Dashboard
- **Real-time metrics** for system-wide insights  
- **Team performance tracking** with visual charts  
- **Completion rate analytics** and overdue task monitoring  
- **Workload distribution** across teams and members  

---

## 📬 Automated Notification System
- **Email notifications** for:
  - Task assignments and updates  
  - Status changes  
  - Deadline reminders (24-hour advance notice)  
  - Account setup invitations  
- **Password reset functionality** with secure OTP verification  


---

## 💻 Tech Stack & Tools

The project follows a modular architecture - the backend (Spring Boot) handles business logic and APIs, while the frontend (Angular) manages the client interface with reactive updates.

---

### 🧠 Backend

| Technology | Description |
| :--- | :--- |
| **Spring Boot** | Main backend framework used to build RESTful microservices and handle business logic. |
| **Spring Security** | Implemented for JWT-based authentication and role-based authorization (Admin, Lead, Member). |
| **Hibernate (JPA)** | Used for ORM mapping between Java entities and PostgreSQL tables. |
| **PostgreSQL** | Primary database for storing user data, tasks, and project-related information. |
| **REST APIs** | Designed clean, versioned endpoints for frontend-backend communication. |
| **JWT** | Used for secure token-based authentication with refresh token rotation. |
| **Swagger (OpenAPI)** | Integrated for testing and documenting all REST APIs interactively. |
| **Maven** | Handles dependency management and build automation. |
| **Lombok & MapStruct** | Simplified entity/DTO conversions and reduced repetitive boilerplate code. |

---

### 🖥️ Frontend

| Technology | Description |
| :--- | :--- |
| **Angular** | Framework used to develop a responsive, single-page interface for users and admins. |
| **TypeScript** | Ensured strong typing and better maintainability for all Angular components. |
| **RxJS** | Managed async data streams for API calls and reactive UI updates. |
| **Tailwind CSS** | Used for modern, mobile-friendly UI with fast styling and layout control. |
| **NgCharts** | Added data visualization for analytics dashboards using Chart.js. |
| **Angular CLI** | Streamlined project setup, builds, and testing with preconfigured tooling. |
