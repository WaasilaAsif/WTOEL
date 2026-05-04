# LumaTasks

LumaTasks is a full-stack productivity app that combines task management with a dual-mode experience:

- Focus Mode keeps the interface calm and minimal.
- Play Mode adds gamification, animated feedback, XP, points, and a reward shop.

The central interaction is the lamp at the top of the screen. Pulling the string switches the whole app between the two modes.

## What This App Does

The app lets you:

- create, edit, reorder, filter, and delete tasks
- mark tasks complete and earn points and XP
- start focus sessions on a chosen task with a timer length
- fail a focus session manually or automatically if the tab loses visibility
- switch between a calm work UI and a playful reward-driven UI
- spend points in the reward shop
- persist all data locally through JSON files on the server

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express
- Persistence: JSON files on disk
- Audio: Web Audio API for success and failure sounds

## High-Level Architecture

The app is split into two parts:

1. The frontend in `client/` handles all rendering, animation, interaction, and local UI state.
2. The backend in `server/` exposes REST endpoints and reads/writes JSON files under `server/data/`.

The frontend loads data from the backend on startup, keeps an in-memory copy in a single React context, and sends mutations back through the API whenever the user changes tasks, focus state, profile data, or rewards.

## Runtime Flow

### Startup

When the app loads, `client/src/main.jsx` renders `App`, which wraps the UI in `AppProvider`.

`AppProvider` does the first data fetch:

- tasks from `GET /tasks`
- profile from `GET /profile`
- rewards from `GET /rewards`

If the backend is unavailable, the app shows a loading or error state instead of the main dashboard.

### Main Screen

`client/src/pages/HomePage.jsx` is the primary dashboard. It composes the whole experience:

- lamp toggle at the top
- sidebar with list navigation and stats
- task composer
- focus session panel
- task list
- reward shop in Play Mode

The page switches styles based on `isPlayMode`, so the same app has two visual personalities without changing routes.

### Shared State

`client/src/context/AppContext.jsx` is the main state hub. It stores:

- `tasks`
- `profile`
- `rewards`
- `selectedList`
- `isPlayMode`
- loading and error states
- focus feedback state
- beat-drop animation state

All task, focus, reward, and profile actions are exposed from this provider so the rest of the UI stays thin and declarative.

## Frontend Structure

### `client/src/App.jsx`

This is the application shell. It decides whether to show loading, error, or the main page.

### `client/src/pages/HomePage.jsx`

This is the main composition layer. It reads shared state from context, wires success and failure callbacks for focus sessions, and switches the visual theme depending on the current mode.

### `client/src/components/LampToggle.jsx`

This is the mode switch. Pulling the lamp string triggers `toggleMode()` from context.

The lamp also reacts visually to the current mood returned by `useLampMood`, so it reflects task pressure, streaks, and play mode.

### `client/src/components/Sidebar.jsx`

The sidebar controls list filtering and shows profile stats. In Play Mode it also renders the avatar panel and the progression deck.

### `client/src/components/TaskComposer.jsx`

This is the task creation form. It lets the user set:

- title
- due date
- priority
- color

The task is assigned to the currently selected list unless the user is viewing special lists like Completed.

### `client/src/components/TaskList.jsx`

This renders the filtered task list. It supports:

- drag-and-drop reordering
- completion toggle
- edit title
- priority toggle
- lock toggle
- list change
- delete

Tasks near their deadline show a visual warning through `DeadlineEyes`.

### `client/src/components/FocusSession.jsx`

This is the focus workflow. The user selects a task and duration, then starts a session.

While a session is active, the user can:

- complete the focus session successfully
- fail it manually

If the browser tab loses visibility during an active session, the app treats that as a failure.

### `client/src/components/RewardShop.jsx`

This appears in Play Mode and lets the user spend points on rewards from the server-backed shop.

### `client/src/components/AvatarPanel.jsx`

This shows the user title, level, avatar mood, and a short status message. It reacts to the current profile state rather than storing its own state.

### `client/src/hooks/useLampMood.js`

This hook derives the lamp mood from:

- number of overdue tasks
- number of remaining incomplete tasks
- focus streak
- avatar mood
- current mode

### `client/src/hooks/useSound.js`

This hook plays lightweight success and failure tones using the Web Audio API.

## Backend Structure

### `server/index.js`

This creates the Express app, enables CORS and JSON parsing, exposes a health check, mounts the feature routes, and starts the API on port 4000 by default.

### Route Layout

- `GET /health` for a simple status check
- `/tasks` for task CRUD
- `/profile` for profile reads and updates
- `/focus` for focus session actions
- `/rewards` for the reward shop and spending

### Controllers

Controllers validate request payloads, call service functions, and return HTTP responses.

They do not contain persistence logic themselves. That work is delegated to the service layer.

### Services

The service layer owns the actual business rules:

- task storage and updates
- profile progression and level calculation
- focus session lifecycle
- reward purchases
- JSON file reads and writes

This separation keeps the controllers small and makes the behavior easier to follow.

## Data Model

The app persists three JSON documents under `server/data/`.

### `tasks.json`

Stores the task list. Each task can contain:

- `id`
- `title`
- `notes`
- `list`
- `completed`
- `priority`
- `color`
- `dueAt`
- `locked`
- timestamps

### `profile.json`

Stores the user progress state:

- points
- XP
- level
- title
- streaks
- badges
- unlocked titles
- avatar mood
- recent wins
- settings
- active focus session
- productivity stats

### `rewards.json`

Stores the reward shop and the purchased inventory.

## Core Behavior

### Tasks

Tasks are created through `POST /tasks` and immediately inserted into the in-memory frontend state after the server confirms the write.

When a task is updated through `PUT /tasks/:id`, the backend updates the file and returns the changed task.

If the task is marked complete, the backend also updates the profile:

- points increase based on priority and due date
- XP increases
- task completion stats increase
- recent wins are updated

Deleting a task removes it from the persisted task list.

### Focus Sessions

Focus sessions are stored on the profile as `focusSession`.

Starting a session:

- selects a task
- records the duration
- writes the active session to the profile

Completing a session:

- clears the active session
- awards XP and points
- advances streaks
- updates badges and avatar mood
- recalculates level and next level XP

Failing a session:

- clears the session
- reduces some progress values
- sets avatar mood to sad
- records the failure in recent wins

The frontend also listens for `visibilitychange` and fails the session automatically if the user switches tabs.

### Progression

The profile service converts XP into level using a simple square-root curve. It also assigns a title from a fixed list and stores the next XP threshold for the UI.

This means the app has two progression currencies:

- points are spendable
- XP is permanent progression

### Rewards

Rewards are bought from the shop with `POST /rewards/spend`.

The server checks:

- whether the reward exists
- whether the user has enough points

On success it:

- deducts points
- adds the item to inventory
- saves both the reward data and the profile

## User Experience Logic

The app is intentionally split into two emotional states.

### Focus Mode

Focus Mode is designed to feel quiet and low-friction:

- soft colors
- minimal dashboard noise
- calm task management
- reduced visual intensity

### Play Mode

Play Mode adds motivation and reward loops:

- stronger gradients and motion
- point and XP visibility
- reward shop
- avatar reactions
- beat-drop and particle effects

The design does not change the underlying task model. It changes how the same data is presented and rewarded.

## API Summary

### Tasks

- `GET /tasks` returns all tasks
- `POST /tasks` creates a task
- `PUT /tasks/:id` updates a task
- `DELETE /tasks/:id` deletes a task

### Profile

- `GET /profile` returns the computed profile state
- `PUT /profile` merges and saves profile updates

### Focus

- `POST /focus/start` starts a focus session
- `POST /focus/fail` fails the current session
- `POST /focus/complete` completes a focus session and awards progress

### Rewards

- `GET /rewards` returns the shop and inventory
- `POST /rewards/spend` spends points on a reward

## Local Development

### Install Dependencies

Install client and server dependencies separately:

```bash
cd client
npm install

cd ../server
npm install
```

### Run the Backend

```bash
cd server
npm run dev
```

The API runs on `http://localhost:4000` by default.

### Run the Frontend

```bash
cd client
npm run dev
```

The Vite app usually runs on `http://localhost:5173`.

### Build the Frontend

```bash
cd client
npm run build
```

## Project Layout

```text
client/
   src/
      components/
      context/
      hooks/
      pages/
      services/
   public/
server/
   controllers/
   routes/
   services/
   data/
```

## Design Notes

The separate `DESIGN_RATIONALE.md` file explains why the UI uses a dual-mode lamp metaphor, why JSON storage was chosen, and how the gamification model supports the productivity flow.

If you want, read that file alongside this README for the design intent behind the implementation.
