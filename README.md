# noqclinic-mvp

An online platform for doctors to manage appointments, handle medical records, and reduce paperwork.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [About Seed Data](#About-Seed-Data)
- [Usage](#usage)
- [Configuration](#configuration)
- [Technologies Used](#technologies-used)
- [Author](#author)
- [Acknowledgments](#acknowledgments)
- [Deploy on Vercel](#Deploy-on-Vercel)
- [Changelog](#Changelog)

## Introduction

**noqclinic-mvp** is a web application designed to streamline the workflow of medical professionals by providing tools for patient appointments, medical record management, and minimizing administrative tasks.

## Features

- **Patient Appointment Scheduling**: Easy booking and management of patient appointments.
- **Medical Record Management**: Secure storage and access to patient medical records.
- **Reduced Paperwork**: Digitize forms and documents to minimize manual paperwork.
- **Real-Time Communication**: Instant messaging between doctors and patients via Pusher.
- **Email Notifications**: Automated emails for appointment confirmations and reminders.
- **Third-Party Login**: Simplified authentication using Google services.

## Installation

### Prerequisites

- **Node.js** (v14.0.0 or higher)
- **npm** or **yarn**

### Steps

1. **Install dependencies**

   ```bash
   $ npm install
   # or
   $ yarn install
   ```

2. **Set up environment variables**

   Create a `.env` file in the root directory and add the following:

   ```markdown
   # env
   NODE_ENV="development"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   NOQCLINIC_ADMIN_SECRET_KEY="Jurong@2024"
   
   # Database
   DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
   
   # Auth
   AUTH_SECRET="somethingreallyreallysecret"
   
   # Cloudinary - Photo storage
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your cloud name"
   NEXT_PUBLIC_CLOUDINARY_API_KEY="your api key"
   NEXT_PUBLIC_CLOUDINARY_MEMBER_IMAGE_UPLOAD_PRESET="your upload preset"
   CLOUDINARY_API_SECRET="api secret"
   
   # Pusher - websocket
   NEXT_PUBLIC_PUSHER_APP_KEY="your pusher app key"
   PUSHER_APP_ID="your app id"
   PUSHER_SECRET="your pusher secret"
   NEXT_PUBLIC_PUSHER_CLUSTER="your user cluster"
   
   # Resend - Email Service
   RESEND_API_KEY="your resend api key"
   RESEND_FROM_EMAIL="email from your email service"
   RESEND_EMAIL_VERIFICATION_SERVICE="true or false to turn on/off email verification service"
   
   # Google Service
   GOOGLE_CLIENT_ID="your google client id"
   GOOGLE_CLIENT_SECRET="your google client secret"
   ```

   Replace the placeholder values with your actual credentials.

3. **Generate prisma client**

   ~~~bash
   $ npx prisma generate
   ~~~

   

4. **Run the development server**

   ```bash
   $ npm run dev
   # or
   $ yarn dev
   ```

5. **Access the application**

   Open http://localhost:3000 in your browser.



## About Seed Data

~~~bash
# insert seed data
$ npx prisma db seed

# update prisma client
$ npx prisma generate

# run prisma studio
$ npx prisma studio

# update database
$ npx prisma db push

# clean database
$ npx prisma migrate reset --skip-seed
~~~



## Usage

- **Scheduling Appointments**

  Doctors can set their availability, and patients can book appointments accordingly.

- **Managing Medical Records**

  Securely upload and access patient medical records using Cloudinary for storage.

- **Real-Time Communication**

  Use the built-in messaging system powered by Pusher for instant communication.

- **Email Notifications**

  Automated emails sent via Resend for confirmations and reminders.

- **Third-Party Authentication**

  Simplify user login with Google OAuth integration.

## Configuration

- **Neon Database**

  Ensure your `NEXT_PUBLIC_DATABASE_URL` is correctly set to connect to your Neon database instance.

- **Cloudinary**

  Configure your Cloudinary account URL in `NEXT_PUBLIC_CLOUDINARY_URL` for image and file storage.

- **Pusher**

  Set up your Pusher credentials (`NEXT_PUBLIC_PUSHER_APP_KEY`, `NEXT_PUBLIC_PUSHER_APP_CLUSTER`) for real-time features.

- **Resend**

  Add your Resend API key (`RESEND_API_KEY`) to enable email functionalities.

- **Google Authentication**

  Provide your Google Client ID and Secret (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) for OAuth login.

## Technologies Used

- **Next.js (App Router)**
- **Node.js**
- **Neon Database**
- **Cloudinary**
- **Pusher**
- **Resend**
- **Google OAuth**



## Author

- Jurong
- Rohan
- Leo
- Lu

## Acknowledgments

- Special thanks to all external service providers and contributors who have made this project possible.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Changelog

### 2024-10-26

###### v0.0.2

- admin portal structure done
  - admin edit other member's file
  - admin edit other member's photos
  - admin delete other users
  - admin chat with other user
  - admin check messages
  - admin edit their own file
  - admin edit their own photos

### 2024-10-23

###### v0.0.1

- Framework setup completed
- Patient and doctor registration and login
- Patient login with google (add google email before testing)
- Patients can view the list of doctors
- Patients and doctors can edit personal information
- Patients and doctors can upload images and set avatars
- Real-time chat between patients and doctors
- Real-time online status of patients and doctors
- Message history between patients and doctors
- Email verification for patients and doctors
- Password recovery for patients and doctors

