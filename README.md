# LumaTasks

LumaTasks is a full-stack task management web app that merges calm productivity with playful gamification through a hanging lamp interaction.

## Stack

- Frontend: React + Tailwind CSS + Framer Motion
- Backend: Node.js + Express
- Persistence: local JSON files

## Project Structure

- client/
  - components/
  - pages/
  - hooks/
  - context/
  - assets/
  - animations/
- server/
  - routes/
  - controllers/
  - services/
  - data/

## Run Locally

1. Install dependencies
   - `cd client && npm install`
   - `cd ../server && npm install`
2. Start backend API
   - `cd server`
   - `npm run dev`
3. Start frontend
   - `cd client`
   - `npm run dev`
4. Open `http://localhost:5173`

## API Endpoints

- GET /tasks
- POST /tasks
- PUT /tasks/:id
- DELETE /tasks/:id
- POST /focus/start
- POST /focus/fail
- POST /focus/complete
- GET /profile
- PUT /profile
- GET /rewards
- POST /rewards/spend

## Notes

- The app persists tasks/profile/rewards in JSON files under server/data.
- Pull the lamp string to switch between Focus Mode and Play Mode.
- Focus Session fails when user switches tabs (Visibility API).
