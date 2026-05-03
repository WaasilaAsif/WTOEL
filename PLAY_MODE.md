# Play Mode Implementation Guide

This document explains how Play Mode is implemented in LumaTasks, file by file, and how the mode changes flow through the app.

## What Play Mode Means

Play Mode is the gamified version of the app. It changes:

- the app theme and animation layer
- the lamp appearance
- the task dashboard presentation
- reward availability
- progression feedback such as XP, points, streaks, and hit effects

The mode is not a separate app or route. It is a persisted setting stored in the profile and then consumed by the React UI.

## The Core Mode Flag

### `server/data/profile.json`

Play Mode is persisted in the profile settings object as `settings.playMode`.

That means the server owns the saved value, and the frontend restores it on startup.

### `client/src/context/AppContext.jsx`

This file is the main runtime controller for Play Mode.

It does three important things:

1. Loads profile data on startup.
2. Sets the local `isPlayMode` state from `profile.settings.playMode`.
3. Exposes `toggleMode()` so the UI can flip the mode and save it back to the API.

Relevant behavior:

- `toggleMode()` inverts `isPlayMode`.
- The new mode is immediately reflected in the React tree.
- The updated value is written back to the profile through `api.updateProfile()`.

This is the root of the whole feature.

## UI Entry Point

### `client/src/pages/HomePage.jsx`

This is where Play Mode becomes visible.

The page reads `isPlayMode` from context and uses it to decide:

- which background class to apply
- whether to render the extra play-mode overlays
- whether to show the reward shop
- whether to animate beat-drop feedback
- whether to use the dark mint-heavy theme or the calm light theme

Key responsibilities here:

- wraps the whole page in a mode-dependent `<main>`
- injects the Play Mode aura, beams, and dance-floor grid
- renders `PlayParticles` only when Play Mode is enabled
- shows the XP bar at the top
- shows `RewardShop` only in Play Mode
- adds the `disco-hit-shake` effect when a beat drop lands

In short: `HomePage.jsx` is the composition layer that turns the mode flag into the visible experience.

## Mode Switch Control

### `client/src/components/LampToggle.jsx`

This is the control the user uses to switch modes.

How it works:

- It renders the hanging lamp and string.
- It receives `isPlayMode`, `onToggle`, and `mood` as props.
- Clicking or tapping the string calls `onToggle()`.
- A small lockout via `pulledRef` prevents accidental repeated toggles.

What changes visually:

- calm mode shows a lightbulb-style lamp
- play mode turns the lamp into a disco-ball style sphere
- the shade animation changes scale and rotation in play mode
- the lamp mood styling is layered on top from `useLampMood()`

This component is only a trigger; the saved state still lives in context and profile data.

## Mood And Lamp Feedback

### `client/src/hooks/useLampMood.js`

This hook decides how the lamp should feel and look.

It computes a mood object from:

- remaining tasks
- overdue tasks
- focus streak
- avatar mood
- whether Play Mode is active

The hook returns:

- `label`: a human-readable mood name
- `className`: an extra CSS class for the lamp
- `glow`: the lamp’s box-shadow glow

The important thing is that Play Mode influences the neutral fallback mood, but the lamp can still become golden, flickery, dim, or haloed based on productivity state.

### `client/src/index.css`

The lamp mood classes live here:

- `.lamp-flicker`
- `.lamp-golden`
- `.lamp-dim`
- `.lamp-halo`

This file also defines the disco-ball styling used in Play Mode.

## Play Mode Visual Layer

### `client/src/components/PlayParticles.jsx`

This component only renders when `enabled` is true.

In Play Mode, it creates floating colored particles using Framer Motion.

It is intentionally decorative and does not change app state. Its job is to make the mode feel alive.

### `client/src/index.css`

This is where the heavy visual language of Play Mode lives.

Important classes:

- `.play-mode-aura`
- `.play-beam`
- `.play-beam-a`
- `.play-beam-b`
- `.dance-floor-grid`
- `.disco-hit-flash`
- `.disco-hit-ring`
- `.disco-hit-shake`
- `.lamp-shade.play`
- `.lamp-shade.disco-ball`

These classes are responsible for:

- the dark gradient background atmosphere
- sweeping light beams
- the floor-grid perspective effect
- hit flash and ring pulses when progress lands
- lamp disco-ball visuals

The mode would feel much flatter without this file.

## Play Mode Dashboard

### `client/src/components/Sidebar.jsx`

In Play Mode the sidebar becomes more than just list navigation.

It still shows the list buttons, but it also renders:

- `AvatarPanel`
- the progress deck with XP, daily streak, focus streak, no-fail streak, velocity, and completion rate

This is the main progression summary panel in the app.

### `client/src/components/AvatarPanel.jsx`

This component surfaces the profile’s roleplay layer.

It shows:

- profile title
- level
- avatar name
- mood-dependent message
- animated avatar SVG

The mood text comes from `profile.avatarMood` and changes depending on focus success/failure and task behavior.

## Play Mode Economy

### `client/src/components/RewardShop.jsx`

The reward shop is only rendered in Play Mode.

It lists purchasable rewards from `rewards.shop` and allows spending points through `spendPoints()`.

This is the primary reason Play Mode matters beyond visuals: it unlocks an economy loop.

### `server/services/rewardService.js`

This service controls purchases.

It:

- loads the reward data
- finds the requested item
- checks that the profile has enough points
- subtracts points from the profile
- adds the item to inventory
- saves both profile and rewards data back to disk

### `server/controllers/rewardsController.js`

The controller exposes the shop data and handles spend requests.

If a purchase fails, it returns a 400 with a readable message such as:

- Reward not found
- Not enough points

## Play Mode Progression Rewards

### `server/services/focusService.js`

Play Mode is tightly connected to progression.

This service defines the reward math for focus sessions and task completion:

- `pointsForTask()` calculates point gains by task priority and due date
- `startFocus()` opens a focus session on the profile
- `failFocus()` penalizes points and streaks, and sets the avatar mood to sad
- `completeFocus()` awards XP, points, streaks, badges, and updates the profile progress

The `completeFocus()` path is what makes Play Mode feel rewarding.

### `server/controllers/focusController.js`

The controller connects the frontend action buttons to the focus service.

It implements:

- `POST /focus/start`
- `POST /focus/fail`
- `POST /focus/complete`

When a focus session completes, the controller also marks the task completed before applying the profile rewards.

### `client/src/components/FocusSession.jsx`

The focus session UI is part of Play Mode’s gameplay loop even though it is also used in calm mode.

In Play Mode, its success and failure feel more dramatic because:

- `onSuccess` plays the success sound
- `onFail` triggers the failure sound and profile penalty
- the page responds with beat-drop and flash effects through context

## Play Mode Task Behavior

### `client/src/components/TaskList.jsx`

Task completion and changes still happen here, but the mode changes how they feel.

In Play Mode:

- completed tasks contribute to beat-drop feedback
- due-soon tasks can show animated `DeadlineEyes`
- task cards use the darker mint-heavy visual style
- the list still supports drag, edit, pin, lock, and delete actions

### `client/src/context/AppContext.jsx`

Several Play Mode side effects are triggered here:

- completing a task refreshes the profile and triggers a beat drop
- completing a focus session refreshes tasks and triggers a stronger beat drop
- `focusFlash` is set when a focus session fails from tab switching

This means the mode’s game feel is not just visual. It is driven by state transitions in the app context.

## Audio Layer

### `client/src/hooks/useSound.js`

Play Mode uses sound to reinforce progress.

This hook creates Web Audio tones for:

- success
- failure

The sounds are short and intentionally lightweight. They are not tied to the backend; they are a client-side feedback layer.

## Backend Entry And Data Loading

### `server/index.js`

The backend simply serves the state that Play Mode depends on.

It mounts:

- `/profile`
- `/tasks`
- `/focus`
- `/rewards`

The profile route is especially important because it carries the saved Play Mode flag.

### `client/src/services/api.js`

This file is the frontend bridge to the backend.

It includes the requests Play Mode depends on:

- `getProfile()` to restore the saved mode
- `updateProfile()` to persist toggles
- `getRewards()` and `spendReward()` for the shop
- `startFocus()`, `failFocus()`, and `completeFocus()` for the progression loop

## File-By-File Summary

- `client/src/context/AppContext.jsx`: owns mode state and persistence.
- `client/src/pages/HomePage.jsx`: renders the play-mode experience.
- `client/src/components/LampToggle.jsx`: switches between calm and play.
- `client/src/hooks/useLampMood.js`: computes the lamp’s mood and glow.
- `client/src/components/PlayParticles.jsx`: adds floating play-mode particles.
- `client/src/components/Sidebar.jsx`: shows progress and profile stats in play mode.
- `client/src/components/AvatarPanel.jsx`: renders mood and level feedback.
- `client/src/components/RewardShop.jsx`: exposes the play-mode shop.
- `client/src/components/FocusSession.jsx`: drives focus gameplay.
- `client/src/components/TaskList.jsx`: shows task actions and beat-drop reactions.
- `client/src/index.css`: defines the full play-mode visual language.
- `client/src/hooks/useSound.js`: adds success and failure sounds.
- `server/services/focusService.js`: calculates progression and penalties.
- `server/services/rewardService.js`: handles point spending and inventory updates.
- `server/services/profileService.js`: derives level and title from XP.
- `server/data/profile.json`: stores the saved play-mode flag and current progression state.

## Practical Runtime Flow

1. The app loads the profile from the API.
2. `AppContext` reads `settings.playMode` and sets `isPlayMode`.
3. `HomePage` renders either the calm theme or the play theme.
4. `LampToggle` flips the mode and persists the new value.
5. Play Mode turns on extra visuals, the reward shop, and stronger progress feedback.
6. Focus completions and task completions trigger XP and point rewards.

## What Makes Play Mode Different From Just A Theme

This feature is not only visual.

It changes three layers at once:

- presentation: dark background, particles, beams, lamp disco-ball, animated hit effects
- behavior: reward shop visibility, stronger progress feedback, mode persistence
- progression: XP, points, streaks, badges, avatar mood, and profile updates

That combination is why Play Mode feels like a separate experience instead of a simple color swap.