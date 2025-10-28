# CampusCare
# 🎓 CampusCare: College Grievance Management System (v3)

## 📘 Project Overview
**CampusCare** is a comprehensive **College Grievance Management System** designed to provide a transparent, efficient, and role-based platform for handling grievances within an academic institution.  
It enables **Students**, **Faculty**, and **Administrators** to submit, track, manage, and resolve grievances with real-time visibility, analytics, and chatbot support.

---

## 🎯 1. Project Objective
To design and develop a secure, role-based grievance handling system that ensures:
- Safe login and access control for Students, Faculty, and Admins.
- Real-time grievance tracking via unique Grievance IDs.
- Efficient resolution workflows and analytics for administrators.
- An integrated chatbot for 24/7 user assistance.

---

## ⚙️ 2. Key System Modules & Features

### 👩‍🎓 Authentication & Griever Panel (Student/Faculty)
- **Secure Role-Based Login:** Differentiates users as Student or Faculty.  
- **Dynamic Submission Form:** Captures detailed input based on category/subcategory.  
- **My Grievances Dashboard:** Displays all submitted grievances with live status updates.  
- **Grievance ID:** Each grievance receives a unique, human-readable ID (e.g., `G-2025-101`).  

### 🧑‍💼 Admin Panel (Resolver)
- **Secure Admin Login:** Restricted access for Admins only.  
- **Master Grievance Dashboard:** View, sort, and filter all grievances by category, status, or department.  
- **Resolution Workflow:** Assign grievances, update statuses, and post resolution comments.  

### 📊 Analytics Dashboard (Admin-Only)
- Visual charts and graphs showing grievance trends.  
- Key metrics include:
  - Grievances by category  
  - Average resolution time  
  - Pending vs. resolved ratio  
  - Recurring problem areas  

### 💬 Chatbot
- Provides **24/7 user support** and FAQs.  
- Guides users through grievance submission and general help topics.  

---

## 👥 3. User Roles & Permissions

| Role | Description | Permissions |
|------|--------------|--------------|
| **Student (Griever)** | Submit grievances and track their own cases | Create, Read |
| **Faculty (Griever)** | Submit and monitor faculty-specific grievances | Create, Read |
| **Admin (Resolver)** | Access all grievances, manage users, resolve cases, view analytics | Full CRUD |

---

## 🧱 4. Technology Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React.js / Angular / Vue.js |
| **Backend** | Node.js with Express.js |
| **Database** | MongoDB |
| **Chatbot** | Dialogflow / Rasa / Custom JS-based bot |
| **Visualization** | Chart.js / Recharts (for analytics) |

---

## 🗄️ 5. Core Database Schema (MongoDB Collections)

### 🧍 A. Users Collection
Stores authentication and profile data for all users.

```json
{
  "_id": "ObjectId",
  "email": "String",
  "password": "String",
  "role": "String", // ['Student', 'Faculty', 'Admin']
  "fullName": "String",
  "userId": "String",
  "department": "String",
  "createdAt": "Date"
}
