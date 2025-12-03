MERN Holidays - Full project (Backend + Frontend with Tailwind)

Backend:
  cd backend
  cp .env.example .env
  # edit .env if needed; .env.example already contains your MongoDB Atlas string
  npm install
  npm run seed   # optional: seed sample hotels + admin user
  npm run dev

Frontend:
  cd frontend
  npm install
  npm run dev

Frontend runs on port 5001 and expects backend at http://localhost:5000/api
Admin seed login: admin@seed.com / pass1234 (if you ran seed)
