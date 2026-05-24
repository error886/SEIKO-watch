# Seiko Watches - High-End E-Commerce

A premium e-commerce web application for Seiko watches engineered in React, Vite, Tailwind CSS, Framer Motion (Motion), and persistent Google Firebase Firestore database storage.

## Features
- **Dynamic Product Showcase**: Live products synced directly with Firebase Firestore.
- **Interactive Carousel & Testimonials**: Fully customizable hero banner sliders and active review feedback panels manageable from an admin dashboard.
- **Complete Shopping Cart & Checkout Flow**: Intuitive, elegant drawer-styled shopping cart and smooth multi-step checkout form with dynamic SKU order generation.
- **Admin Dashboard**: Manage watches, view incoming customer orders, manage home page layouts, and append branding image banners on-the-fly.

---

## ⚡ Coolify One-Click Deployment

This project contains a highly optimized, fully configured multi-stage `Dockerfile` and `nginx.conf` designed explicitly for simple, reliable **one-click deployment on Coolify**.

### Setup Instructions for Coolify:

1. **Connect Repository**: 
   Inside Coolify, click **Create New Resource** -> **Application** and pick your GitHub repository containing this project.
   
2. **Auto-Detection**:
   Coolify will automatically detect the **Dockerfile** at the root of the project.
   
3. **Configuration Details**:
   - **Build Pack**: Dockerfile (automatically selected)
   - **Ports Exposed**: `80` (mapped automatically to your chosen domain)
   - **Destination Port**: `80`

4. **Deploy**:
   Click **Deploy**. Coolify will compile the application securely using Node.js, package the single-page application into an Nginx web server container, and make it available instantly with SSL.

---

## Local Development Setup

To test the application locally:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production preview:
   ```bash
   npm run build
   npm run preview
   ```

*Crafted lovingly with Google AI Studio & Coolify compliance integration.*
