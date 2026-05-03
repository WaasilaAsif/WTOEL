# LumaTasks App Guide

This document explains the project structure, how the app is wired together, and how the two main modes work.

## What This App Is

LumaTasks is a full-stack productivity app with two personalities:

- A calm task manager for planning and focus.
- A playful gamified mode with XP, points, rewards, and visual effects.

The frontend is a React app. The backend is an Express API that stores state in local JSON files.

## Project Structure

```text
WTOEL/
├─ README.md
├─ client/
│  ├─ package.json
│  ├─ index.html
│  ├─ vite.config.js
│  └─ src/
│     ├─ App.jsx
│     ├─ App.css
│     ├─ index.css
│     ├─ main.jsx
│     ├─ assets/
│     ├─ components/
│     │  ├─ AvatarPanel.jsx
│     │  ├─ DeadlineEyes.jsx
│     │  ├─ FocusSession.jsx
│     │  ├─ LampToggle.jsx
│     │  ├─ PlayParticles.jsx
│     │  ├─ RewardShop.jsx
│     │  ├─ Sidebar.jsx
│     │  ├─ TaskComposer.jsx
│     │  └─ TaskList.jsx
│     ├─ context/
│     │  └─ AppContext.jsx
│     ├─ hooks/
│     │  ├─ useLampMood.js
│     │  └─ useSound.js
│     ├─ pages/
│     │  └─ HomePage.jsx
│     └─ services/
│        └─ api.js
└─ server/
   ├─ package.json
   ├─ index.js
   ├─ controllers/
   │  ├─ focusController.js
   │  ├─ profileController.js
   │  ├─ rewardsController.js
   │  └─ tasksController.js
   ├─ routes/
   │  ├─ focus.js
   │  ├─ profile.js
   │  ├─ rewards.js
   │  └─ tasks.js
   ├─ services/
   │  ├─ dataService.js
   │  ├─ focusService.js
   │  ├─ profileService.js
   │  ├─ rewardService.js
   │  └─ taskService.js
   └─ data/
      ├─ profile.json
      ├─ rewards.json
      └─ tasks.json
```

## How The App Boots

1. `client/src/main.jsx` mounts the React app.
2. `client/src/App.jsx` wraps the app in `AppProvider`.
3. `AppContext.jsx` loads tasks, profile, and rewards from the API.
4. When loading finishes, `HomePage.jsx` renders the actual UI.

If the backend is unavailable, the app shows an error screen that tells you to start the server on port 4000.

## Frontend Architecture

### `AppProvider`

The app’s central state lives in `client/src/context/AppContext.jsx`.

It owns:

- `tasks`
- `profile`
- `rewards`
- `selectedList`
- `isPlayMode`
- `loading` and `error`
- focus flash and beat-drop animation triggers

It also exposes the main actions used by the UI:

- create, update, delete, and reorder tasks
- start, fail, and complete focus sessions
- spend rewards
- toggle between calm and play mode

### `HomePage`

`client/src/pages/HomePage.jsx` is the main dashboard.

It composes the whole experience:

- `LampToggle` switches modes
- `Sidebar` shows lists and profile stats
- `TaskComposer` creates new tasks
- `FocusSession` runs timed focus work
- `TaskList` shows tasks and task actions
- `RewardShop` appears in play mode
- `PlayParticles` and other effects only appear in play mode

### Shared UI State

The context also drives small app-wide effects:

- `focusFlash` briefly flashes the screen when a focus session fails.
- `beatDrop` triggers a stronger visual hit effect when task completion or focus completion grants progress.
- `listCounts` powers the list sidebar badges.
- `filteredTasks` changes based on the selected list.

## Modes

The app has one real mode flag: `settings.playMode` in the profile data. The UI treats it as two experiences.

### Calm Mode

Calm mode is the default productivity view.

What it does:

- Uses a light, soft background.
- Shows the lamp in its calm state.
- Focuses the UI on task planning and focus sessions.
- Hides the reward shop and the heavier game effects.

What you use here:

- add, edit, complete, delete, and move tasks
- start a focus session for a task
- filter by list from the sidebar

### Play Mode

Play mode is the gamified version of the app.

What it does:

- Switches the interface to a dark neon theme.
- Turns the lamp into a disco-ball style visual.
- Adds ambient particles, beams, and hit effects.
- Shows the reward shop.
- Displays XP, level, streaks, and progression panels.

What changes in practice:

- Completing tasks feels more game-like because the UI reacts with a beat-drop effect.
- Completing focus sessions gives a larger reward burst.
- The sidebar expands into a progress dashboard.

### How Mode Switching Works

`LampToggle.jsx` is the mode switch.

When the lamp string is clicked or tapped:

- the local `isPlayMode` state flips immediately
- the new value is saved to `profile.settings.playMode`
- the lamp mood and the whole visual theme update

## Focus Sessions

`FocusSession.jsx` is the timed work flow.

Steps:

1. Pick a task.
2. Pick a duration.
3. Start the session.
4. Complete it or fail it.

Important rule:

- switching browser tabs while a focus session is active fails the session automatically

Failure consequences come from the backend and include reduced streaks, a sad avatar mood, and a point penalty.

Completion consequences include XP, points, streak increases, badge changes, and refreshed profile progress.

## Tasks And Lists

Tasks live in `server/data/tasks.json` and are managed through the task service.

Each task can have:

- `title`
- `notes`
- `list`
- `completed`
- `priority`
- `color`
- `dueAt`
- `locked`
- timestamps

The sidebar lists are:

- My Day
- Important
- Scheduled
- Completed
- Locked

The task list view supports:

- completion toggles
- delete
- edit title
- pin or unpin priority
- lock or unlock
- move between lists
- drag and drop reordering on the client side

Deadline warning behavior:

- tasks due within 10 minutes show the animated `DeadlineEyes` marker

## Rewards And Progression

The progression system is split between profile data and rewards data.

### Profile Progression

Profile data tracks:

- points
- XP
- level
- title
- streaks
- badges
- recent wins
- avatar mood
- focus session state
- settings

Level and title are derived from XP by the profile service.

### Rewards Shop

The reward shop lives in `server/data/rewards.json`.

It has:

- `shop`: items available to buy with points
- `inventory`: purchased items

Buying a reward:

- checks whether the item exists
- checks whether you have enough points
- subtracts the cost from the profile
- adds the purchased item to inventory

## Backend Architecture

### `index.js`

`server/index.js` creates the Express app, enables CORS and JSON parsing, exposes `/health`, and mounts the route groups.

### Routes

- `/tasks` -> task CRUD
- `/profile` -> read and update profile state
- `/focus` -> start, fail, and complete focus sessions
- `/rewards` -> read rewards and spend points

### Controllers

Controllers are thin request handlers.

They validate input, call services, and return JSON responses.

### Services

- `dataService.js` reads and writes the JSON files.
- `taskService.js` manages task creation, updates, deletion, and sorting.
- `profileService.js` loads profile data and derives level/title progress.
- `focusService.js` handles focus session state, streak updates, and XP/point rewards.
- `rewardService.js` spends points and records purchases.

### Data Files

The app uses local JSON files as its database.

- `tasks.json` stores tasks.
- `profile.json` stores player progression and settings.
- `rewards.json` stores shop items and owned rewards.

## Data Flow In Plain English

1. The frontend loads tasks, profile, and rewards from the API.
2. The user edits tasks or starts focus sessions from the React UI.
3. The client calls the backend API through `client/src/services/api.js`.
4. The backend updates the JSON files through service helpers.
5. The client refreshes local state so the UI reflects the new profile, streaks, points, and task list.

## Visual System

The visual behavior comes from `client/src/index.css` and the mode-aware class names in the components.

Key effects:

- lamp animations and mood classes
- focus failure flash
- play-mode beams, floor grid, and particle effects
- hit shake and hit flash when progress lands

The result is a calm planner that can turn into a flashy reward loop without changing the underlying task model.

## Useful Entry Points

- Frontend mount: `client/src/main.jsx`
- App shell: `client/src/App.jsx`
- State and actions: `client/src/context/AppContext.jsx`
- Main dashboard: `client/src/pages/HomePage.jsx`
- API client: `client/src/services/api.js`
- Server entry: `server/index.js`

## Notes

- The app expects the API on `http://localhost:4000`.
- The frontend runs on Vite, usually on `http://localhost:5173`.
- The JSON files in `server/data` are the source of truth for persistence.
- Focus is deliberately fragile: tab switching fails the session by design.