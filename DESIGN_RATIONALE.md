# LumaTasks Design Rationale

## 1) Reconciling Conflicting Stakeholder Requirements

LumaTasks resolves the conflict between minimal productivity and rich engagement by introducing adaptive interface complexity. Instead of forcing a single compromise UI, the system uses one interaction model that intentionally switches cognitive load based on user intent.

## 2) Why Dual-Mode Design Was Chosen

A dual-mode architecture allows the same task workflow to be preserved while visual density, motivation mechanics, and animation intensity are changed at runtime. This avoids feature fragmentation and keeps mental mapping stable.

## 3) Why the Lamp Metaphor Solves Visual Conflict

The hanging lamp is both symbolic and functional. As a familiar physical metaphor, pulling the string naturally communicates mode switching without adding new navigation overhead. The metaphor also unifies thematic lighting, attention cues, and productivity state.

## 4) Why Minimal Mode Preserves Usability

Minimal Focus Mode defaults to soft colors, low-noise spacing, limited visible controls, and quick interaction targets. This supports low-friction planning and execution, particularly for users in high-concentration contexts.

## 5) Why Gamification Improves Retention

Play Mode introduces immediate feedback loops (XP, streaks, unlocks, avatar reactions, badges) that increase return motivation. These mechanics transform repetitive task completion into progressive achievement without removing core utility features.

## 6) Why Points and XP Are Separated

Points are transactional and spendable, enabling a barter system with tactical choices. XP is persistent and non-spendable, preserving long-term identity and progression integrity. Separation prevents short-term purchases from damaging progression fairness.

## 7) How Responsiveness Was Prioritized

The interface was designed mobile-first with collapsible dashboard behavior, touch-friendly controls, and a floating add action. Larger layouts progressively reveal richer side panels and statistics on tablet/desktop.

## 8) Why JSON Storage Was Used Instead of MongoDB

For a university lab environment, JSON file persistence reduces setup complexity, avoids environment-specific database issues, and enables reliable offline demonstration. It remains academically valid for architectural proof-of-concept APIs.

## 9) Performance Choices for Fast Loading

Performance was supported through lightweight local persistence, scoped animations, conditional particle rendering in Play Mode only, and minimal request overhead via focused REST endpoints. Build output was validated for production compilation.

## 10) User Experience Decisions for Focus Sessions

Focus Sessions use the browser Visibility API to enforce anti-distraction rules with immediate fail conditions on tab switch. Success and failure pathways include audiovisual feedback, streak effects, and profile-state consequences, creating clear behavioral reinforcement.
