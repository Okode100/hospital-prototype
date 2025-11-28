## Hospital Prototype

A full-stack prototype for a hospital patient registry and QR-enabled scanning workflow. The frontend lets staff register patients, view or scan them via QR codes, and view detailed medical information. The backend exposes REST APIs that persist data to MongoDB.

> **Note:** This application uses mock/sample data and is intended for prototyping only. Do not store real patient information.

---

### Tech Stack
- **Frontend:** React 19, Tailwind CSS, React Router, axios, HTML5 QR scanner
- **Backend:** Node.js, Express.js, Mongoose, MongoDB
- **Tooling:** dotenv for config, npm scripts, seed data script

---

### Getting Started

#### 1. Clone & install
```bash
git clone <repo-url>
cd hospital-prototype

# install frontend deps
cd frontend
npm install

# install backend deps
cd ../backend
npm install
```

#### 2. Environment Variables
Create `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/hospital_prototype
PORT=5000            # optional, defaults to 5000
```

Create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

#### 3. Seed the database (optional demo data)
```bash
cd backend
node seed.js
```

#### 4. Start backend
```bash
cd backend
npm start           # or: node server.js
```

#### 5. Start frontend
```bash
cd frontend
npm start
```

Frontend runs on http://localhost:3000 by default; backend on http://localhost:5000.

---

### App Features & Usage
1. **Register Patient** – Enter basic details, contact info, and emergency data. On submit, the app saves to MongoDB and redirects to the new patient profile.
2. **Patients List** – View all patients with their serial numbers, demographics, and quick “View” actions.
3. **Patient Detail** – Displays full medical history, contacts, screening history, and a QR code linking to the patient page (with copy-link helper).
4. **Scan QR** – Uses device camera (HTML5 QR scanner) to read a patient QR code, fetch their record, log a scan event, and navigate to the detail page.

---

### API Overview
- `POST /api/patient` – create patient
- `GET /api/patient/:serialNumber` – fetch patient
- `PUT /api/patient/:serialNumber` – update patient
- `GET /api/patients` – list all patients
- `POST /api/patient/:serialNumber/scan` – record a scanner event

---

### Notes
- Camera access is required for scanning.
- All data in this project is sample/demo only.
- Tailwind is configured in `frontend/tailwind.config.js`, PostCSS in `frontend/postcss.config.js`.
- The backend seed script inserts 5 sample patient profiles with serial numbers `uwra00001` – `uwra00005`.

Feel free to extend with authentication, richer medical history, or hospital-specific workflows.

# hospital-prototype
