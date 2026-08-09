# MediCare Hospital Management System - Features Guide

## Overview

A complete, modern, and responsive Hospital Management System frontend built with **React 19 + Vite**. Features a beautiful teal/sage green color scheme with glassmorphism UI, 19 fully functional modules, interactive charts, calendar views, and localStorage-based data persistence (ready for backend migration).

---

## Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Pure White | `#FBFDFD` | Page background |
| Dark Teal | `#103D3E` | Sidebar background, primary dark text |
| Teal | `#147570` | Primary accent, buttons, active states |
| Sage Green | `#8FB59A` | Secondary accent, icons, badges |

---

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Router**: React Router DOM 7 (BrowserRouter)
- **Styling**: Custom CSS with CSS Variables, no external CSS framework
- **Charts**: Recharts (Area, Bar, Line, Pie charts)
- **Icons**: Lucide React + React Icons
- **Font**: Inter (Google Fonts)
- **Linting**: Oxlint (0 warnings, 0 errors)

---

## Design Highlights

- **Glassmorphism Navbar**: Backdrop blur with sticky positioning
- **Dark Teal Sidebar**: Gradient background with active indicators, hover animations, and collapsible on mobile
- **Gradient Cards**: Dashboard cards with category-specific gradient icons and hover lift effects
- **Smooth Animations**: Modal fade/slide, card hover transitions, sidebar collapse animations
- **Responsive Layout**: Sidebar collapses on mobile with backdrop overlay, cards stack on small screens
- **Calendar View**: Monthly appointment grid with event dots and status colors
- **Modern Tables**: Searchable, sortable-style data tables with hover row effects
- **Animated Modals**: Backdrop blur with slide-up panel animation
- **Trend Indicators**: Dashboard cards show up/down trend arrows
- **WhatsApp Button**: Floating consultation button with gradient

---

## All 19 Modules

---

### 1. Dashboard
- Quick statistics cards (Patients, Doctors, Appointments, Revenue)
- Trend indicators with percentage changes (up/down arrows)
- Secondary stats bar (Pending Appointments, Beds Occupied, Low Stock, Pending Lab Tests)
- **Recent Activity Feed**: Real-time activity stream showing latest records added
- Recent Patients table (top 5)
- Recent Doctors table (top 5)
- 3 Interactive charts: Patient Growth Line Chart, Doctors by Department Bar Chart, Department Overview Pie Chart
- Today's date display

**Data Source**: `patients`, `doctors`, `appointments`, `bills`, `medicines`, `rooms`, `labTests` (localStorage)

---

### 2. Patients Management
- Add / Edit / Delete patients
- Fields: Name, Age, Gender, Disease, Phone
- **Searchable patient list** with real-time filtering
- Inline edit and delete action buttons
- Summary badge showing total patients count
- Modal form with validation

**Data Source**: `patients` (localStorage array)

---

### 3. Doctors Management
- Add / Edit / Delete doctors
- Fields: Name, Specialization, Phone, Experience
- Searchable doctor list
- Specialization badges (soft-pill styling)
- Summary badge showing total doctors count

**Data Source**: `doctors` (localStorage array)

---

### 4. Appointments
- **Dual View Mode**: List view + Calendar view (toggle buttons)
- **Calendar View**: Monthly grid with day navigation, appointment dots, event previews
- Add / Edit / Delete appointments
- Fields: Patient Name, Doctor Name, Date, Time, Status (Pending/Confirmed/Completed)
- Status color coding (Pending = yellow, Confirmed = teal, Completed = green)
- Searchable by patient name
- Summary badges: Total Appointments, Pending, Confirmed, Completed

**Data Source**: `appointments` (localStorage array)
**Component**: CalendarView.jsx (reusable calendar component)

---

### 5. Billing & Invoicing
- Add / Edit / Delete bills
- Fields: Patient, Doctor, Treatment, Amount, Payment Method (Cash/Card/Online), Status (Pending/Paid), Date
- **Revenue calculation**: Auto-sums all bill amounts
- **Payment status badges**: Paid (green), Pending (yellow)
- Searchable by patient name
- Summary badges: Total Bills, Total Revenue
- Form validation (Patient and Amount required)

**Data Source**: `bills` (localStorage array with unique IDs)

---

### 6. Prescriptions (Rx)
- **Doctor writes prescriptions for patients**
- Add / Edit / Delete prescriptions
- Fields: Patient, Doctor, Medicines, Dosage, Duration, Date, Notes
- Searchable by patient or doctor name
- Summary badges: Total Prescriptions, Today's Prescriptions
- Modal form with full prescription details

**Data Source**: `prescriptions` (localStorage array)

---

### 7. Pharmacy & Medicines
- **Medicine Inventory Management**
- Add / Edit / Delete medicines
- Fields: Name, Category (Tablet/Syrup/etc.), Stock Quantity, Price, Expiry Date, Supplier
- **Low Stock Alert**: Items with <= 10 stock show warning badge
- **Inventory Value**: Auto-calculates total stock value (stock * price)
- Searchable by medicine name
- Summary badges: Total Medicines, Low Stock Count, Inventory Value (Rs.)

**Data Source**: `medicines` (localStorage array)

---

### 8. Rooms & Beds Management
- **Room and Bed Occupancy Tracking**
- Add / Edit / Delete rooms
- Fields: Room Number, Type (General/Private/ICU/OT/Emergency), Total Beds, Occupied Beds, Floor, Status
- **Occupancy calculation**: Available = Total - Occupied
- Status badges: Available (green), Full (yellow), Maintenance (orange)
- Searchable by room number
- Summary badges: Total Rooms, Total Beds, Occupied, Available

**Data Source**: `rooms` (localStorage array)

---

### 9. Laboratory & Diagnostics
- **Lab Test Record Management**
- Add / Edit / Delete lab tests
- Fields: Patient, Test Name (Blood Test/X-Ray/etc.), Doctor, Date, Result (Pending/Completed/Critical), Notes
- **Result status badges**: Completed (green), Pending (yellow), Critical (red)
- Searchable by patient or test name
- Summary badges: Total Tests, Pending, Completed

**Data Source**: `labTests` (localStorage array)

---

### 10. Staff & Nurses
- **Hospital Staff Management**
- Add / Edit / Delete staff members
- Fields: Name, Role (Nurse/Receptionist/Lab Technician/Pharmacist/Accountant/Security/Cleaner), Department, Phone, Shift (Morning/Evening/Night), Monthly Salary
- **Payroll Summary**: Auto-calculates total monthly salary
- Searchable by name or role
- Summary badges: Total Staff, Monthly Payroll (Rs.)

**Data Source**: `staff` (localStorage array)

---

### 11. Blood Bank
- **Blood Donation & Inventory**
- Add / Edit / Delete blood donations
- Fields: Donor Name, Blood Group (A+/A-/B+/B-/O+/O-/AB+/AB-), Units (ml), Date, Contact, Status (Available/Used/Expired)
- **Blood group badges** with color coding
- **Inventory tracking**: Available units auto-calculated
- Searchable by donor or blood group
- Summary badges: Total Donations, Total Units, Available Units

**Data Source**: `bloodBank` (localStorage array)

---

### 12. Ambulance Services
- **Ambulance Fleet Management**
- Add / Edit / Delete ambulances
- Fields: Vehicle Number, Driver Name, Driver Phone, Type (Basic/Advanced Life Support/Mortuary), Status (Available/On Duty/Maintenance), Last Service Date
- **Status badges**: Available (green), On Duty (yellow), Maintenance (orange)
- Searchable by vehicle or driver
- Summary badges: Total Ambulances, Available, On Duty

**Data Source**: `ambulances` (localStorage array)

---

### 13. Emergency & Triage
- **Emergency Case Management**
- Add / Edit / Delete emergency cases
- Fields: Patient, Condition, Priority (Critical/High/Medium/Low), Attending Doctor, Vitals (BP/HR), Status (Waiting/In Treatment/Admitted/Discharged/Referred), Time
- **Priority color coding**: Critical (red), High (orange), Medium (green), Low (teal)
- **Status badges** with full color coding
- **Triage counts**: Waiting, In Treatment, Critical cases
- Searchable by patient or condition
- Summary badges: Total Cases, Waiting, In Treatment, Critical

**Data Source**: `emergencyCases` (localStorage array)

---

### 14. OT & Surgery Schedule
- **Surgery & Operation Theater Scheduling**
- Add / Edit / Delete surgeries
- Fields: Patient, Surgeon, Surgery Type (Appendectomy/C-Section/etc.), OT Room, Date, Time, Duration, Priority (Normal/High/Urgent), Status (Scheduled/In Progress/Completed/Cancelled), Pre-op Notes
- **Priority badges**: Urgent (red), High (orange), Normal (teal)
- **Status badges**: Scheduled, In Progress, Completed, Cancelled
- **Today's surgery count**
- Searchable by patient, surgeon, or surgery type
- Summary badges: Today, Scheduled, Completed, Urgent

**Data Source**: `surgeries` (localStorage array)

---

### 15. Medical Equipment
- **Equipment Inventory & Maintenance**
- Add / Edit / Delete equipment
- Fields: Name, Type, Serial Number, Manufacturer, Location, Purchase Date, Last Service, Next Service, Status (Operational/Under Maintenance/Out of Order)
- **Overdue Service Alert**: Shows warning badge if next service date is past
- **Status badges**: Operational (green), Under Maintenance (yellow), Out of Order (red)
- Searchable by name, serial, or location
- Summary badges: Total, Operational, Maintenance, Out of Order, Service Overdue

**Data Source**: `equipments` (localStorage array)

---

### 16. Visitor Management
- **Visitor Entry/Exit Log**
- Add / Edit / Delete visitor records
- Fields: Visitor Name, Patient Being Visited, Relation, Phone, Purpose, Entry Time (datetime), Exit Time (datetime)
- **Currently Inside count**: Visitors with entry but no exit time
- **Today's visitor count**
- Searchable by visitor or patient name
- Summary badges: Total Visitors, Currently Inside, Today

**Data Source**: `visitors` (localStorage array)

---

### 17. Notice Board
- **Hospital Announcements & Notices**
- Add / Edit / Delete notices
- Fields: Title, Message, Category (General/Staff/Patients/Emergency/Event/Holiday), Priority (Normal/High), Date, **Pin toggle**
- **Pin functionality**: Pinned notices show pin icon and stay at top
- **Priority badges**: High priority shows red badge with bell icon
- **Category pills** for easy identification
- **Pin/unpin action button** inline
- Searchable by title, message, or category
- Summary badges: Total Notices, Pinned, High Priority

**Data Source**: `notices` (localStorage array)

---

### 18. Reports & Analytics
- **Comprehensive Data Visualization Dashboard**
- **Revenue vs Expenses Area Chart**: Monthly comparison with gradient fills
- **Department Performance Bar Chart**: Patient count and revenue per department
- **Patient Gender Distribution Pie Chart**: Male/Female/Other breakdown from real patient data
- **Appointment Status Pie Chart**: Pending/Confirmed/Completed breakdown
- **Staff Salary by Role Bar Chart**: Payroll analysis per role
- **Summary Cards**: Total Revenue, Beds Occupied, Inventory Value, Monthly Payroll
- All charts use the hospital's teal/sage color scheme
- Charts render "No Data" state gracefully when no records exist

**Data Sources**: `patients`, `appointments`, `rooms`, `medicines`, `staff`, `bills` (all localStorage)

---

### 19. Settings
- **Hospital Configuration Panel**
- **Hospital Information**: Name, Address, Phone, Email
- **Currency Selector**: Pakistani Rupee (Rs.), US Dollar ($), British Pound (GBP), Euro (EUR)
- **Theme Selector**: Light, Dark, Auto
- **Notifications Toggle**: Enable/disable alerts
- **Save Settings**: Persists to localStorage with success confirmation
- **Danger Zone**: Reset All Data button with confirm dialog (clears all 10 localStorage keys)
- Settings load automatically on page visit

**Data Source**: `hospitalSettings` (localStorage object)

---

## Shared Components

### DataTable
- Reusable table component used across all modules
- Features: Search bar (optional), title header, record count, empty state message
- Column-based rendering with custom cell renderers
- Action buttons column (edit/delete)
- Row hover effect
- Responsive horizontal scroll on mobile

### Modal
- Reusable modal dialog with overlay and panel
- Features: Title, close button, animated open/close (fade + slide)
- Click outside to close (with stopPropagation on panel)
- Used for all add/edit forms across the system

### CalendarView
- Monthly calendar grid with navigation (prev/next/today)
- Appointment event dots and preview cards
- Status color coding on events
- Sticky header with weekday labels
- Responsive grid layout

### DashboardCard
- Icon + number + label layout
- Category-specific gradient icons (patients, doctors, appointments, revenue, etc.)
- Hover lift and icon rotation animation
- Decorative gradient overlay on right side

---

## Navigation (Sidebar)

All 19 modules accessible via sidebar navigation with Lucide icons:

1. Dashboard (LayoutDashboard)
2. Patients (Users)
3. Doctors (Stethoscope)
4. Appointments (CalendarDays)
5. Billing (ReceiptText)
6. Prescriptions (FileText)
7. Pharmacy (Pill)
8. Rooms & Beds (BedDouble)
9. Laboratory (FlaskConical)
10. Staff (UserCog)
11. Blood Bank (Droplets)
12. Ambulance (Ambulance)
13. Emergency (HeartPulse)
14. OT & Surgery (Scissors)
15. Equipment (Wrench)
16. Visitors (UserCheck)
17. Notice Board (Megaphone)
18. Reports (BarChart3)
19. Settings (Settings)

**Sidebar Features**:
- Collapsible on desktop (click hamburger icon)
- Slides in/out on mobile with backdrop overlay
- Active page indicator with left border and gradient background
- Hover effects with smooth transitions

---

## Data Persistence

All data is stored in browser `localStorage` with the following keys:

| Key | Module | Data Type |
|-----|--------|-----------|
| `patients` | Patients | Array |
| `doctors` | Doctors | Array |
| `appointments` | Appointments | Array |
| `bills` | Billing | Array (with `id`) |
| `prescriptions` | Prescriptions | Array (with `id`) |
| `medicines` | Pharmacy | Array (with `id`) |
| `rooms` | Rooms | Array (with `id`) |
| `labTests` | Laboratory | Array (with `id`) |
| `staff` | Staff | Array (with `id`) |
| `bloodBank` | Blood Bank | Array (with `id`) |
| `ambulances` | Ambulance | Array (with `id`) |
| `emergencyCases` | Emergency | Array (with `id`) |
| `surgeries` | Surgery | Array (with `id`) |
| `equipments` | Equipment | Array (with `id`) |
| `visitors` | Visitors | Array (with `id`) |
| `notices` | Notice Board | Array (with `id`) |
| `hospitalSettings` | Settings | Object |

---

## Backend Migration Guide

When connecting to a backend API, replace these patterns:

### Current (localStorage)
```javascript
const data = JSON.parse(localStorage.getItem("patients")) || [];
localStorage.setItem("patients", JSON.stringify(data));
```

### Future (API)
```javascript
// Fetch
const response = await fetch("/api/patients");
const data = await response.json();

// Create
await fetch("/api/patients", { method: "POST", body: JSON.stringify(patient) });

// Update
await fetch(`/api/patients/${id}`, { method: "PUT", body: JSON.stringify(patient) });

// Delete
await fetch(`/api/patients/${id}`, { method: "DELETE" });
```

**Note**: All components use the same data structure, so backend migration is straightforward. Each module's `useEffect` hook reading from localStorage is the only place that needs to change.

---

## How to Run

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Build

```bash
npm run build
```

Output goes to `frontend/dist/`.

---

## Lint

```bash
npm run lint
```

Currently: **0 warnings, 0 errors** on 34 files.

---

## Screenshots & UI Preview

### Dashboard
- Glassmorphism navbar with search bar
- 4 primary stat cards + 4 secondary stat cards
- Activity feed panel + Recent tables
- 3 charts area

### Sidebar (Collapsed)
- Shows only icons, hides labels
- Smooth 0.4s transition animation

### Mobile View
- Sidebar becomes slide-out drawer
- Backdrop overlay with blur
- Cards stack vertically
- Tables scroll horizontally

---

## Future Enhancements (Suggested)

- [ ] **Patient Detail Page**: Full medical history, prescriptions, visits, vitals graph
- [ ] **Discharge Summary**: Auto-generated PDF from patient stay data
- [ ] **Insurance Claims**: Track insurance processing status
- [ ] **Vaccination Records**: Track patient immunization history
- [ ] **Diet/Food Management**: Meal plans for admitted patients
- [ ] **Inventory Alerts**: Auto-alerts for low medicine stock, equipment overdue
- [ ] **Email/Notification System**: Real-time alerts for emergencies, appointments
- [ ] **Multi-language Support**: Urdu/English toggle
- [ ] **Dark Mode**: Full dark theme implementation
- [ ] **Print & Export**: PDF reports, CSV exports for all modules
- [ ] **Role-based Access**: Doctor, Nurse, Admin, Receptionist permissions
- [ ] **Patient Portal**: Separate login for patients to view records
- [ ] **Doctor Schedule**: Weekly availability calendar for doctors
- [ ] **Billing Receipts**: Printable invoice/receipt generation
- [ ] **SMS Integration**: Appointment reminders via SMS

---

## Author

- **Frontend**: React 19 + Vite + Custom CSS
- **Design**: Teal/Sage Medical Theme
- **Status**: Frontend Complete | Backend Ready for Integration

---

*Last Updated: August 2026*
