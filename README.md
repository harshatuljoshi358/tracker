# Personal Log

A personal activity tracker dashboard for logging and reviewing gym, football, and study sessions. Built as a static, dependency-free single-page web app.

![Status](https://img.shields.io/badge/status-basic_version-blue)
![Stack](https://img.shields.io/badge/stack-vanilla_JS-yellow)
![Modules](https://img.shields.io/badge/architecture-ES_modules-green)

---

## Overview

Personal Log is a self-hosted dashboard that lets you:

- Track daily tasks with completion counts
- Browse a monthly calendar with logged-day highlights
- Switch between activities (Gym / Football / Study) and view weekly trends + category breakdowns
- Read a daily highlight + journal entry

The current build runs entirely on the client with mock data baked into `data.js`. There is no backend, no build step, and no external dependencies.

---

## Tech Stack

| Layer        | Choice                                              |
| ------------ | --------------------------------------------------- |
| Markup       | HTML5                                               |
| Styling      | Plain CSS (`style.css`)                             |
| Logic        | Vanilla JavaScript (ES2020+)                        |
| Module system| Native ES Modules (`<script type="module">`)        |
| Data         | In-memory mock data (no backend)                    |

No frameworks, no bundlers, no npm. Just open `index.html`.

---

## Getting Started

### Run Locally

Because the app uses ES modules, you must serve it over HTTP — opening `index.html` via `file://` will fail with a CORS error.

```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node
npx serve .

# Option 3: Any other static server
```

Then visit [http://localhost:8000](http://localhost:8000).

---

## Project Structure

```
tracker/
├── index.html              # Page shell — single entry point
├── style.css               # All styling
├── app.js                  # Entry point — boots Dashboard on DOMContentLoaded
│
├── data.js                 # Mock data (activities, dailyData, chartData, recentLogs)
│
├── Task.js                 # Task entity (id, text, completed)
├── TaskManager.js          # Owns + renders the task list, tracks completion count
│
├── Calendar.js             # Monthly grid, highlights logged days
├── ActivityManager.js      # Activity button group, syncs label + calendar + callback
│
├── DailyView.js            # Renders highlight + journal for a given day
├── ActivityInsight.js      # Weekly bars + category breakdown chart
├── RecentLogs.js           # "Last 5 entries" list (default for TODAY view)
│
└── Dashboard.js            # Composes all views and wires their callbacks
```

---

## Architecture

### Module Map

```
                     ┌─────────────┐
                     │  index.html │
                     └──────┬──────┘
                            │
                            ▼
                       ┌────────┐
                       │ app.js │   (entry point)
                       └────┬───┘
                            │
                            ▼
                     ┌────────────┐
                     │ Dashboard  │   (composes + wires)
                     └─┬───┬───┬──┘
            ┌──────────┘   │   └──────────┐
            ▼              ▼              ▼
       ┌─────────┐   ┌──────────┐   ┌─────────────┐
       │Calendar │   │Activity  │   │  DailyView  │
       │         │   │Manager   │   │             │
       └─────────┘   └──────────┘   └─────────────┘
            │              │              │
            └──────────────┼──────────────┘
                           ▼
                       ┌───────┐
                       │ data  │
                       └───────┘

       ┌──────────────────┐    ┌──────────────┐
       │ ActivityInsight  │    │ RecentLogs   │
       └──────────────────┘    └──────────────┘
```

### Object-Oriented Principles

The codebase applies a small set of OOP principles deliberately — no abstractions that aren't earning their keep.

#### Single Responsibility

Each class has exactly one job and owns its own rendering. A class never reaches into another class's DOM.

| Class             | Responsibility                                             |
| ----------------- | ---------------------------------------------------------- |
| `Task`            | Domain entity — knows how to toggle its own `completed`    |
| `TaskManager`     | Owns the task list, renders it, updates the counter         |
| `Calendar`        | Renders a month grid; computes which days have entries     |
| `ActivityManager` | Manages the activity button group + selected label         |
| `DailyView`       | Renders a single day's highlight + journal                  |
| `ActivityInsight` | Renders the chart + breakdown for an activity              |
| `RecentLogs`      | Renders the "last 5 entries" list                          |
| `Dashboard`       | The only class that knows about *every* view               |

#### Encapsulation

State and DOM live together inside the class that owns them. Examples:

- `Task.completed` is private to the task and only mutated through `toggle()`.
- `Calendar.selectedDay` / `Calendar.selectedActivity` are not poked at from outside — consumers call `setActivity()` and `selectDay()`.

#### Composition over Inheritance

`Dashboard` *has-a* `DailyView`, `ActivityInsight`, `RecentLogs`, `TaskManager`, `Calendar`, and `ActivityManager`. There is no inheritance chain — every view is a standalone, drop-in component.

#### Dependency Injection

DOM nodes and callback functions are passed into constructors, never read from globals:

```js
new Calendar(container, monthLabel, (day, activity) => {
    // consumer decides what to do with the selection
});

new ActivityManager(buttons, nameElement, summaryElement, calendar, onActivityChanged);
```

This makes each module independently testable and lets `Dashboard` be the single place where everything is wired together.

#### Decoupling

- Views don't import each other. `Calendar` has no idea `DailyView` exists.
- The flow of events is unidirectional:
  ```
  Calendar/ActivityManager → Dashboard callback → View mutation
  ```
- `data.js` is the only file with shared state. Every view imports from it directly — there is no global registry.

### Data Flow

```
   ┌──────────────────────────────────────────┐
   │               data.js                    │
   │  (activities, dailyData, chartData,      │
   │            recentLogs)                   │
   └────────────┬─────────────────────────────┘
                │ imports
   ┌────────────┴─────────────────────────────┐
   │   views read data, render to their own   │
   │   DOM nodes (passed in by Dashboard)     │
   └────────────┬─────────────────────────────┘
                │ user clicks / events
   ┌────────────┴─────────────────────────────┐
   │   callbacks fire, Dashboard decides      │
   │   which sibling view to update           │
   └──────────────────────────────────────────┘
```

---

## UI Guide

### Layout

The page is divided into four regions:

1. **Top bar** — brand + current date
2. **Month header** — month name + stats (day number, total entries, hours logged)
3. **Dashboard grid** — left panel (today's tasks + reflection) and right panel (activity selector + calendar)
4. **Bottom panel** — switches between *Activity Insight* (when an activity is selected) and *Recent Logs* (on the default TODAY view)

### Interactions

| Action                       | Result                                                       |
| ---------------------------- | ------------------------------------------------------------ |
| Click a task                 | Toggles completion; counter updates                          |
| Click **+ ADD TASK**         | Prompts for task text; appends to the list                   |
| Click an activity button     | Updates the label, refreshes the calendar, swaps the bottom panel |
| Click a calendar day         | Highlights the day and loads that day's highlight + journal |
| Click **← / →**              | (Placeholder — month navigation is wired up structurally but not yet implemented) |

---

## Data Model

All data lives in `data.js` and is exported as named constants.

### `activities`

Indexed by activity key (`gym` | `football` | `study`).

```js
{
  gym: {
    name: "Gym",
    dates: [2, 4, 7, ...],          // days with logged entries
    entries: {                       // keyed by day-of-month
      25: { title, duration, details }
    },
    stats: { ... }
  },
  ...
}
```

### `dailyData`

Keyed by day-of-month. Holds the human-written reflection shown on the left panel.

```js
{
  25: { highlight, journal }
}
```

### `chartData`

Indexed by activity key. Holds weekly trend + sub-category breakdown used by `ActivityInsight`.

```js
{
  gym: {
    title, unit,
    weeks:     [{ label, value }, ...],
    breakdown: [{ label, value }, ...]
  }
}
```

### `recentLogs`

Flat array of the most recent entries, used by the default TODAY view.

```js
[{ activity, title, meta }, ...]
```

---

## Extending the App

### Add a new activity

1. Add an entry to `activities`, `chartData` in `data.js`.
2. Add a `<button class="activity-button" data-activity="mykey">` to `index.html`.
3. That's it — `ActivityManager` will pick it up via `data-activity`.

### Add a new view module

1. Create `MyView.js` with a class that takes a container in its constructor.
2. Import it from `Dashboard.js` and instantiate it.
3. Wire its events through a callback, the same way other views are wired.

### Replace mock data with a real API

`data.js` is the only file that imports mock constants. Swap its contents for `fetch()` calls and a small in-memory cache — none of the view modules need to change.

---

## Browser Support

Modern evergreen browsers (Chrome / Firefox / Safari / Edge) released after 2020. The app uses:

- ES Modules (`<script type="module">`)
- `requestAnimationFrame`
- `Set`, `Array.prototype.flatMap`, optional chaining, nullish coalescing

---

## License

Personal project — use freely.
