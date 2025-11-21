
# 🚀 TinyLink – URL Shortener (MERN Stack)

TinyLink is a lightweight, production-ready **URL shortener** application inspired by Bit.ly.
It allows users to shorten long URLs, track click analytics, view stats, and manage links through an intuitive dashboard.


---

## 🌟 Features

### 🔗 **Short Link Creation**

* Convert long URLs into short, shareable codes.
* Optionally choose a **custom short code** (6–8 alphanumeric characters).
* Validates URL format before saving.
* Prevents duplicate short codes (returns **409 Conflict**).

### 🔁 **Redirection**

* Visiting `/<code>` performs a **302 redirect** to the target URL.
* Each redirect:

  * Increments total click count
  * Updates the **last clicked** timestamp

### 🗑️ **Link Management**

* View all your shortened links on the Dashboard.
* Delete any link.
* Deleted links return **404 Not Found** on access.

### 📊 **Stats Page**

* View detailed analytics for any code:

  * Target URL
  * Total Clicks
  * Last Clicked
  * Created At

### ❤️ **Quality UI**

* Clean and responsive layout
* Loading states, empty states, success & error messages
* Copy-to-clipboard button
* Truncated long URLs
* Consistent UX with Tailwind CSS

---

## 🛠️ Tech Stack

### **Frontend**

* React.js
* React Router
* Tailwind CSS
* Fetch API

### **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* CORS + dotenv

### **Deployment**

* Frontend: Vercel / Netlify / Surge
* Backend: Render / Railway
* Database: MongoDB Atlas (or local MongoDB)

---

## 📁 Project Structure

```
TinyLink/
│
├── backend/
│   ├── models/Link.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.js
│   ├── public/
│   └── .env
│
└── README.md
```

---

## 🔌 API Documentation

### **Healthcheck**

```
GET /healthz
```

Response:

```json
{ "ok": true, "version": "1.0" }
```

---

### **Create Link**

```
POST /api/links
Content-Type: application/json
{
  "url": "https://example.com",
  "code": "custom123"  // optional
}
```

**Responses**

* `201` – Link created
* `409` – Code already exists
* `400` – Invalid URL or invalid code

---

### **Get All Links**

```
GET /api/links
```

---

### **Get Stats for One Code**

```
GET /api/links/:code
```

---

### **Delete a Link**

```
DELETE /api/links/:code
```

---

### **Redirect**

```
GET /:code
```

* Returns **302** → redirects to target
* If deleted or missing → **404**

---

## ⚙️ Environment Variables

Create these files:

### **backend/.env**

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/tinylink
BASE_URL=http://localhost:4000
```

### **frontend/.env**

```
REACT_APP_BASE_URL=http://localhost:4000
```

---

## 🏃‍♀️ Running Locally

### **1. Backend**

```
cd backend
npm install
npm run dev
```

### **2. Frontend**

```
cd frontend
npm install
npm start
```

Open:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧪 Manual Test Checklist (as per assignment)

### ✔ 1. `/healthz` returns 200

### ✔ 2. Create link → duplicate returns 409

### ✔ 3. Redirect increments click count

### ✔ 4. Delete removes access → 404

### ✔ 5. UI meets expectations

* Loading states
* Empty states
* Error messages
* Responsive layout
* Copy button
* Stats page

---

## 📦 Deployment Steps

### **Backend (Render/Railway)**

* Add environment variables
* Deploy `backend/` folder

### **Frontend (Vercel/Netlify)**

* Deploy `frontend/` folder
* Add environment variable
  `REACT_APP_BASE_URL=https://your-backend-url`

---



## 👩‍💻 Author

**Nikita Gour**

* 🌐 [https://www.linkedin.com/in/nikita-gour-933539203/](https://www.linkedin.com/in/nikita-gour-933539203/)
* 📧 [nikitagour533@gmail.com](mailto:nikitagour533@gmail.com)

---
