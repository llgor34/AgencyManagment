# Installation
1. Create new firebase project.
2. Initialize Auth, Firestore and Functions.
3. Run `npm install -g firebase-tools firebase`
4. Run `npm install`.
5. Cd into project, run `firebase init`, don't overwrite existing files.
6. Run `firebase deploy --only firestore:rules`.
7. Run `firebase deploy --only functions`.

# How to run
To start project, run `npm start`

# 🎇 Main Features
🔐 Auth
  - 🔒 Login Panel
  - ❔ Remind password Panel
👨‍💼 Manage Employees (Admin)
  - 👨‍💼 You can see all employees and informations about them.
  - 📨 You can reset employee password.
  - ❌ You can delete employee account.
  - 🛠 You can edit employee permissions, based on role.
  - ⚙ You can edit employee information
  - 👮‍♂️ This panel can be accessed only by person with admin role.
  - 🚫 Appropriate Toasts are displayed in case of success and error.
  - ❓ Backend additionally verifies user trying to execute any admin operation.
📲 Projects Managment
  - 🤖 You can view projects assigned to users (admin).
  - 💼 You can view assigned to you projects and manage their tasks.
  - ❎ You can manage project (admin || assigned user).
  - ❌ When user gets deleted and it appears to be assigned to some projects, he also get's removed from them.
⚙ Admin settings
  - ➕ You can add project templates.
  - 💾 They can be used to create new project with initial tasks to do.
😴 Every functionality is lazy loaded


