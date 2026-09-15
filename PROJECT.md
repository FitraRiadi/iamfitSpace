# IamFit Space

## Product Requirements Document (PRD)

**Version:** 1.0
**Status:** Initial Product Definition
**Product Owner:** Fitra / IamFit
**Product Type:** Personal Digital Ecosystem & Business Management Platform

---

## 1. Product Overview

IamFit Space adalah platform digital pribadi milik IamFit yang menggabungkan portfolio, pengelolaan bisnis jasa web development, showcase project, dan digital product store dalam satu ekosistem.

Platform ini berfungsi sebagai:

1. Personal brand website.
2. Dashboard operasional bisnis jasa web.
3. Portfolio dan showcase karya.
4. Katalog serta marketplace produk digital.
5. Pusat pengelolaan seluruh cabang IamFit.

IamFit Space bukan hanya website portfolio. Platform ini dirancang sebagai fondasi untuk membangun dan mengembangkan berbagai lini bisnis dan produk digital IamFit.

### Core Concept

> One Space. Multiple Branches. Endless Possibilities.

---

## 2. Vision & Mission

### Vision

Menjadikan IamFit Space sebagai pusat ekosistem digital pribadi yang menghubungkan karya, bisnis, dan produk digital IamFit.

### Mission

* Membangun personal brand yang profesional.
* Mengelola bisnis jasa web development secara terstruktur.
* Mendokumentasikan dan memamerkan seluruh project.
* Menjual source code, template, dan aplikasi siap pakai.
* Menyediakan fondasi yang mudah dikembangkan menjadi berbagai cabang baru.

---

## 3. Brand Architecture

IamFit Space merupakan brand induk.

Setiap cabang memiliki fokus bisnis atau aktivitas yang berbeda, tetapi tetap menggunakan identitas IamFit.

```text
IamFit Space
│
├── IamFit Web Development
│   ├── Web Development Services
│   ├── Client Management
│   ├── Project Management
│   └── Financial Management
│
├── IamFit GameDev
│   ├── Game Development
│   ├── Game Portfolio
│   └── Game Projects
│
├── IamFit Store
│   ├── Source Code
│   ├── Web Template
│   ├── App Siap Jadi
│   ├── UI/UX Assets
│   └── Digital Products
│
└── IamFit Labs
    ├── Experiments
    ├── Research
    └── Future Projects
```

### Brand Rules

* IamFit Space adalah identitas utama.
* Cabang tidak boleh memiliki identitas yang sepenuhnya terpisah dari IamFit.
* Setiap cabang dapat memiliki warna aksen dan visual tersendiri.
* Semua cabang harus dapat diakses melalui navigasi utama IamFit Space.
* Penambahan cabang baru tidak boleh membutuhkan perubahan besar pada arsitektur platform.

---

## 4. Target Users

### Primary User

Fitra sebagai pemilik dan operator IamFit Space.

Kebutuhan utama:

* Mengelola project.
* Mengelola klien.
* Mengelola keuangan jasa web.
* Menampilkan portfolio.
* Mengelola produk digital.
* Memantau perkembangan bisnis.

### Secondary User

Pengunjung umum, calon klien, dan calon pembeli produk digital.

Kebutuhan utama:

* Mengenal IamFit.
* Melihat portfolio.
* Melihat layanan.
* Melihat katalog produk.
* Melihat detail produk.
* Menghubungi IamFit.
* Membeli produk digital jika tersedia.

---

## 5. Product Modules

IamFit Space terdiri dari beberapa modul utama.

### 5.1 Space Dashboard

Dashboard utama yang menjadi pusat kendali seluruh ekosistem.

Fitur:

* Ringkasan project aktif.
* Ringkasan pendapatan dan pengeluaran.
* Jumlah produk digital.
* Aktivitas terbaru.
* Shortcut menuju setiap cabang.
* Statistik bisnis secara keseluruhan.

Dashboard harus memberikan gambaran singkat tentang kondisi IamFit Space tanpa mengharuskan pengguna membuka setiap modul.

---

### 5.2 IamFit Portfolio

Website portfolio publik.

Fitur:

* Hero section.
* Profil IamFit.
* About.
* Skills.
* Services.
* Selected projects.
* Branch showcase.
* Contact.
* Link menuju IamFit Store.

Portfolio harus menonjolkan karya nyata, bukan hanya daftar teknologi.

Setiap project dapat memiliki:

* Judul.
* Deskripsi.
* Kategori.
* Screenshot.
* Teknologi.
* Link demo.
* Link repository jika tersedia.
* Status project.
* Cabang terkait.

---

### 5.3 IamFit Web Development

Cabang yang berfokus pada jasa pembuatan website dan aplikasi web.

#### Public Website

Menampilkan:

* Layanan.
* Portfolio web.
* Teknologi yang digunakan.
* Proses kerja.
* Estimasi atau paket layanan jika tersedia.
* Call to action untuk menghubungi IamFit.

#### Business Dashboard

Dashboard internal untuk mengelola bisnis jasa web.

##### Client Management

Data klien:

* Nama.
* Kontak.
* Email.
* Perusahaan atau organisasi.
* Catatan.
* Daftar project terkait.

##### Lead Pipeline

Mengelola calon klien dari awal sampai menjadi project.

Contoh status:

```text
New Lead
    ↓
Contacted
    ↓
Discussion
    ↓
Proposal Sent
    ↓
Negotiation
    ↓
Won / Lost
```

Fitur:

* Tambah lead.
* Edit lead.
* Ubah status.
* Catatan komunikasi.
* Estimasi nilai project.
* Tanggal follow-up.
* Relasi dengan klien.
* Riwayat perubahan status.

##### Project Management

Data project:

* Nama project.
* Klien.
* Cabang.
* Deskripsi.
* Status.
* Deadline.
* Nilai kontrak.
* Progress.
* Catatan.
* Link demo.
* Link repository.

Status project:

```text
Planning
In Progress
Review
Completed
Archived
```

##### Financial Management

Pengelolaan keuangan jasa web.

Fitur:

* Pendapatan.
* Pengeluaran.
* Invoice.
* Pembayaran.
* Status pembayaran.
* Kategori transaksi.
* Catatan transaksi.
* Ringkasan profit.

Contoh kategori pendapatan:

* Website Development.
* Maintenance.
* Consultation.
* Other Services.

Contoh kategori pengeluaran:

* Hosting.
* Domain.
* Software.
* Asset.
* Operational.

Dashboard keuangan harus dapat menampilkan:

* Total income.
* Total expense.
* Net profit.
* Outstanding payment.
* Pendapatan berdasarkan periode.
* Pengeluaran berdasarkan kategori.

---

### 5.4 IamFit GameDev

Cabang untuk pengembangan game.

Fitur:

* Game portfolio.
* Daftar game project.
* Development progress.
* Game status.
* Screenshot dan trailer.
* Teknologi atau engine.
* Link demo/download.
* Development notes.

Contoh project:

* Knight Battle.
* Game prototype.
* Game experiment.

Setiap game project dapat memiliki status:

```text
Idea
Prototype
In Development
Testing
Released
Archived
```

Modul ini harus dapat berkembang menjadi game development workspace tanpa mengganggu modul web development.

---

### 5.5 IamFit Store

IamFit Store adalah marketplace pribadi untuk menjual dan memamerkan produk digital buatan IamFit.

#### Product Categories

1. Source Code.
2. Web Template.
3. App Siap Jadi.
4. UI/UX Assets.
5. Game Assets.
6. Digital Products.

#### Example Products

Source Code:

* Laravel API.
* React CRUD.
* PHP MVC.
* Authentication System.

Web Template:

* Landing Page.
* Portfolio Website.
* Admin Dashboard.
* Business Website.

App Siap Jadi:

* Sistem Perpustakaan.
* Point of Sale.
* Inventory System.
* Management System.

Game Assets:

* Pixel Art.
* UI Game.
* Sprite.
* Godot Assets.

#### Store Features

Public:

* Product listing.
* Category filter.
* Search.
* Product detail.
* Screenshot.
* Demo preview.
* Feature list.
* Technology.
* Version.
* Price.
* Purchase CTA.
* Download access setelah pembelian.

Admin:

* Create product.
* Edit product.
* Delete product.
* Upload product assets.
* Manage pricing.
* Manage product version.
* Manage product status.
* Manage orders.
* Manage customers.
* Manage downloads.

Product status:

```text
Draft
Published
Archived
```

#### Product Detail

Setiap produk harus memiliki:

* Product name.
* Short description.
* Full description.
* Category.
* Price.
* Preview images.
* Demo link.
* Technology.
* Requirements.
* Installation instructions.
* Version.
* Changelog.
* License information.
* Download file jika tersedia.

#### Store Business Model

Model awal:

* One-time purchase.
* Free product.
* Premium product.

Sistem pembayaran harus dapat dikembangkan kemudian.

Untuk MVP, pembayaran dapat berupa:

* Manual payment verification.
* External payment link.
* Payment gateway jika sudah tersedia.

Jangan mengimplementasikan payment gateway kompleks sebelum kebutuhan bisnis tervalidasi.

---

### 5.6 IamFit Labs

Cabang untuk eksperimen teknologi dan project yang belum menjadi produk utama.

Fitur:

* Experiment listing.
* Research notes.
* Prototype showcase.
* Technology tags.
* Development status.
* Documentation.

IamFit Labs berfungsi sebagai tempat eksplorasi teknologi baru sebelum project dipindahkan menjadi produk atau cabang resmi.

---

## 6. Core User Flows

### 6.1 Public Visitor

```text
Open IamFit Space
        ↓
Explore Portfolio
        ↓
View Branches
        ↓
Open Project / Service / Store
        ↓
Contact IamFit or Purchase Product
```

### 6.2 Manage Web Client

```text
Admin Login
        ↓
Web Development Dashboard
        ↓
Create Lead
        ↓
Contact Client
        ↓
Create Project
        ↓
Track Progress
        ↓
Create Invoice
        ↓
Record Payment
        ↓
Complete Project
```

### 6.3 Publish Digital Product

```text
Admin Login
        ↓
Open IamFit Store
        ↓
Create Product
        ↓
Upload Assets
        ↓
Add Description and Price
        ↓
Save Draft
        ↓
Publish
        ↓
Product Appears in Store
```

### 6.4 Manage Game Project

```text
Admin Login
        ↓
Open IamFit GameDev
        ↓
Create Game Project
        ↓
Add Description and Assets
        ↓
Update Development Status
        ↓
Publish Game Portfolio
```

---

## 7. Functional Requirements

### Authentication

* Admin login.
* Secure session management.
* Protected dashboard routes.
* Logout.
* Role-based access if needed later.

Public visitors tidak membutuhkan login untuk melihat portfolio dan katalog produk.

### Content Management

Semua konten penting harus dapat dikelola melalui dashboard:

* Portfolio.
* Branches.
* Projects.
* Services.
* Products.
* Game projects.
* Experiments.

### Search & Filter

Search dan filter minimal tersedia untuk:

* Portfolio projects.
* Store products.
* Client leads.
* Business projects.

### Responsive Design

Platform harus dapat digunakan pada:

* Desktop.
* Laptop.
* Tablet.
* Mobile.

Dashboard dapat memprioritaskan desktop, tetapi tidak boleh rusak pada layar kecil.

---

## 8. Non-Functional Requirements

### Performance

* Gunakan lazy loading untuk gambar dan asset berat.
* Optimalkan ukuran gambar.
* Hindari animasi berlebihan pada dashboard.
* Gunakan pagination untuk daftar data besar.
* Hindari polling yang tidak diperlukan.
* Prioritaskan performa mobile untuk halaman publik.

### Security

* Validasi input.
* Proteksi authentication.
* Authorization pada dashboard.
* Validasi upload file.
* Jangan menyimpan password secara plaintext.
* Jangan mengekspos data keuangan kepada pengunjung publik.
* Jangan menyimpan secret API di frontend.

### Maintainability

* Modular architecture.
* Reusable components.
* Separation of concerns.
* Konsisten dalam naming.
* Dokumentasi endpoint.
* Environment variables.
* Struktur folder yang jelas.

### Scalability

Arsitektur harus mendukung penambahan:

* Cabang baru.
* Produk baru.
* User role.
* Payment gateway.
* Customer account.
* Analytics.
* Notification.
* Subscription.

---

## 9. Technical Architecture

### Recommended Stack

Frontend:

* React.
* Vite.
* JavaScript atau TypeScript.
* Bootstrap 5 atau UI component system yang konsisten.

Backend:

* Laravel.
* REST API.
* Authentication.
* Validation.
* Business logic.

Database:

* MySQL atau PostgreSQL.

Storage:

* Local storage untuk development.
* Object storage untuk deployment jika dibutuhkan.

Deployment:

* Frontend hosting.
* Backend hosting.
* Managed database.

### Architecture

```text
Frontend
   │
   │ REST API
   ▼
Laravel Backend
   │
   ├── Authentication
   ├── Portfolio Module
   ├── Branch Module
   ├── Web Development Module
   ├── GameDev Module
   ├── Store Module
   └── Financial Module
   │
   ▼
Database
```

### Development Principles

* Jangan membuat semua fitur dalam satu file besar.
* Pisahkan UI, API, dan business logic.
* Gunakan reusable components.
* Jangan mengubah fitur lama secara destruktif.
* Sebelum refactor, pahami struktur project yang sudah ada.
* Jangan menghapus data atau file tanpa izin eksplisit.
* Jangan menginstal dependency baru tanpa alasan teknis yang jelas.
* Gunakan migration dan seed data untuk database.
* Setiap fitur harus dapat diuji secara terpisah.

---

## 10. Suggested Database Entities

Entitas awal yang disarankan:

```text
users
branches
portfolio_projects
services
clients
leads
business_projects
invoices
transactions
products
product_categories
product_files
orders
order_items
game_projects
experiments
```

Relasi penting:

```text
branches
    ├── portfolio_projects
    ├── business_projects
    ├── game_projects
    └── products

clients
    ├── leads
    ├── business_projects
    └── invoices

business_projects
    ├── invoices
    └── transactions

products
    ├── product_categories
    ├── product_files
    └── order_items
```

Struktur ini adalah fondasi awal. AI Agent harus mengevaluasi relasi dan kebutuhan aktual sebelum membuat migration final.

---

## 11. MVP Scope

MVP harus fokus pada platform yang dapat digunakan Fitra sehari-hari.

### Phase 1 — Foundation

* Project setup.
* Database setup.
* Authentication.
* Basic layout.
* Public landing page.
* Dashboard layout.
* Branch navigation.

### Phase 2 — Portfolio

* Portfolio management.
* Project detail.
* Public project showcase.
* Services page.
* Contact information.

### Phase 3 — Web Development Dashboard

* Client management.
* Lead pipeline.
* Project management.
* Income and expense tracking.
* Basic financial dashboard.

### Phase 4 — IamFit Store

* Product listing.
* Product detail.
* Product categories.
* Admin product management.
* Product publishing.
* Basic order management.

### Phase 5 — GameDev & Labs

* Game project management.
* Game showcase.
* Experiment management.
* Public project pages.

### Phase 6 — Polish & Deployment

* Responsive refinement.
* Performance optimization.
* Security review.
* Testing.
* Deployment.
* Documentation.

---

## 12. Out of Scope for Initial MVP

Fitur berikut tidak wajib untuk versi pertama:

* Multi-vendor marketplace.
* Subscription billing.
* Complex payment gateway.
* Advanced CRM automation.
* Mobile native app.
* Real-time chat.
* AI assistant.
* Multi-user organization.
* Advanced accounting compliance.
* Complex inventory system.

Fitur tersebut dapat dipertimbangkan setelah core platform stabil.

---

## 13. UI/UX Direction

### Design Personality

IamFit Space harus terasa:

* Modern.
* Personal.
* Professional.
* Creative.
* Technical.
* Modular.
* Memiliki karakter startup digital.

### Design System

Gunakan design system yang konsisten:

* Typography.
* Spacing.
* Buttons.
* Cards.
* Forms.
* Tables.
* Badges.
* Navigation.
* Modal.
* Toast notification.

Setiap cabang boleh memiliki aksen visual berbeda, tetapi tetap mengikuti design system IamFit Space.

### Dashboard UX

Dashboard harus:

* Mudah dipahami.
* Tidak terlalu padat.
* Memprioritaskan informasi penting.
* Memiliki navigasi jelas.
* Memiliki empty state.
* Memiliki loading state.
* Memiliki error state.
* Memberikan feedback setelah aksi CRUD.

---

## 14. AI Agent Development Rules

AI Agent yang mengerjakan IamFit Space harus mengikuti aturan berikut.

### Before Coding

1. Baca PRD ini.
2. Periksa struktur repository.
3. Identifikasi stack yang sudah digunakan.
4. Periksa database dan migration yang sudah ada.
5. Identifikasi fitur yang sudah berjalan.
6. Jangan mengasumsikan project masih kosong.
7. Tanyakan jika requirement bertentangan atau tidak jelas.

### During Coding

* Implementasikan fitur secara modular.
* Ikuti struktur project yang sudah ada.
* Gunakan naming convention yang konsisten.
* Jangan menghapus fitur yang sudah berjalan.
* Jangan mengganti stack tanpa persetujuan.
* Jangan membuat fitur di luar scope tanpa alasan.
* Gunakan data dummy untuk testing jika diperlukan.
* Validasi semua input.
* Pastikan error handling tersedia.

### After Coding

* Jalankan aplikasi.
* Periksa error frontend dan backend.
* Test alur utama.
* Pastikan database migration berjalan.
* Pastikan responsive layout.
* Dokumentasikan perubahan.
* Laporkan file yang diubah.
* Laporkan fitur yang belum selesai.
* Jangan menyatakan fitur selesai jika belum diuji.

### Coding Priority

```text
Correctness
    ↓
Maintainability
    ↓
Security
    ↓
Performance
    ↓
Visual Polish
```

---

## 15. Definition of Done

Sebuah fitur dianggap selesai apabila:

* Requirement sudah dipahami.
* Implementasi sesuai scope.
* Tidak merusak fitur lama.
* UI dapat digunakan.
* API atau backend berjalan.
* Validasi tersedia.
* Error handling tersedia.
* Data tersimpan dengan benar.
* Alur utama sudah diuji.
* Dokumentasi perubahan tersedia.

---

## 16. Success Metrics

Pada tahap awal, keberhasilan IamFit Space diukur melalui:

### Personal Productivity

* Semua project tercatat.
* Lead dapat dikelola.
* Keuangan jasa web dapat dipantau.
* Portfolio mudah diperbarui.

### Brand Development

* Portfolio dapat diakses publik.
* Cabang IamFit memiliki halaman yang jelas.
* Project dapat dipamerkan secara profesional.

### Product Development

* Produk digital dapat dipublikasikan.
* Katalog Store dapat dikelola.
* Produk siap dijual atau didistribusikan.
* Platform dapat berkembang tanpa refactor besar.

---

## 17. Long-Term Vision

IamFit Space dapat berkembang menjadi:

* Personal SaaS.
* Digital product marketplace.
* Client portal.
* Business management system.
* Developer portfolio ecosystem.
* Game development studio platform.
* Product distribution platform.

Namun, semua pengembangan harus tetap berangkat dari kebutuhan nyata IamFit.

### Final Product Principle

> IamFit Space is the home of everything I build, manage, and ship.

---

## 18. First Implementation Task

AI Agent harus memulai dengan:

1. Membaca PRD ini.
2. Melakukan audit repository.
3. Menjelaskan struktur aplikasi saat ini.
4. Mengidentifikasi fitur yang sudah tersedia.
5. Menyusun implementation plan.
6. Menentukan MVP pertama.
7. Meminta persetujuan sebelum melakukan perubahan besar.

Jangan langsung membangun seluruh modul sekaligus.

Mulai dari fondasi yang stabil, kemudian kembangkan IamFit Space secara bertahap.
