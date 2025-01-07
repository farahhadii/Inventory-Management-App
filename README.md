## Build
Front-end developed with React.js framework.
Back-end developed using Node.js and Express.
Database used for this project is MongoDB.

## About
I wanted to better familiarize myself with full-stack and MERN stack development, particularly focusing on authentication. To achieve this, I developed a full-stack inventory management application that enables
businesses to efficiently add, delete, and monitor their product listings. This project included implementing secure user authentication and authorization, 
allowing businesses to create accounts, edit profiles, and manage their information with ease.

## Prerequisites
Ensure that npm and Node.js are installed on your machine.

## Steps to Run Locally
  1. Clone this repo
       git clone https://github.com/farahhadii/Inventory-Management-App.git
  2. Navigate to the frontend directory
       cd frontend 
  3. Install dependencies:
       npm install 
  4. Create a .env in the frontend with the format below
       REACT_APP_BACKEND_URL=http://localhost:5000
  5. Navigate to the backend directory
       cd backend
  6. Install dependencies
       npm install 
  7. Create a .env in the backend with the format below
       MONGO_URI=xxxxxxxxxxxxx  # Mongo connection string
       NODE_ENV=production
       JWT_SECRET=xxxxxxxxxx    # Generate a random JSON secret key
       FRONTEND_URL=http://localhost:3000
       CLOUDINARY_URL=xxxxxxxxxxxx  # Cloudinary URL for image uploads
       EMAIL_USER=xxxxxx@gmail.com  # Gmail account for email service
       EMAIL_PASS=xxxxxxx           # Email password

## Run the client
npm start 

## Run the server
npm start

## Access the application:
Visit https://inventorypro-management.vercel.app to check out the application. 
