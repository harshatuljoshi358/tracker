import LogService from "./services/LogService.js";
import ActivityService from "./services/ActivityService.js";
import TaskService from "./services/TaskService.js";
import StatsService from "./services/StatsService.js";

import CalendarView from "./views/CalendarView.js";
import DailyLogView from "./views/DailyLogView.js";
import JournalSearchView from "./views/JournalSearchView.js";
import StatsView from "./views/StatsView.js";

import StudyActivity from "./models/StudyActivity.js";
import FootballActivity from "./models/FootballActivity.js";
import GymWorkout from "./models/GymWorkout.js";


export function initApp() {

// ============================================================
// SERVICES
// ============================================================

const logService =
    new LogService();


const activityService =
    new ActivityService(
        logService
    );

const taskService =
    new TaskService(
        logService
    );

const statsService =
    new StatsService(
        logService
    );


// ============================================================
// DOM
// ============================================================

const calendarContainer =
    document.getElementById(
        "calendar"
    );

const dailyPanel =
    document.querySelector(
        ".daily-panel"
    );

const statsContainer =
    document.getElementById(
        "stats"
    );

const statsSection =
    document.querySelector(
        ".stats-section"
    );

const searchButton =
    document.getElementById(
        "journal-search-btn"
    );


// ============================================================
// STATE
// ============================================================

let selectedDate = null;


// ============================================================
// DAILY LOG VIEW
// ============================================================

const dailyLogView =
    new DailyLogView(

        dailyPanel,

        highlight => {
            updateHighlight(
                highlight
            );
        },

        journal => {
            updateJournal(
                journal
            );
        },

        description => {
            addTask(
                description
            );
        },

        index => {
            toggleTask(
                index
            );
        },

        (index, description) => {
            editTask(
                index,
                description
            );
        },

        index => {
            deleteTask(
                index
            );
        },

        data => {
            handleActivityAdd(
                data
            );
        },

        index => {
            handleActivityDelete(
                index
            );
        },

        (index, data) => {
            handleActivityEdit(
                index,
                data
            );
        }
    );


// ============================================================
// CALENDAR
// ============================================================

const calendarView =
    new CalendarView(

        calendarContainer,

        date => {
            showDate(
                date
            );
        },

        filterKey => {
            showStats(
                filterKey
            );
        }
    );


// ============================================================
// STATS VIEW
// ============================================================

const statsView =
    new StatsView(
        statsContainer,
        statsService
    );


// ============================================================
// JOURNAL SEARCH
// ============================================================

const journalSearchView =
    new JournalSearchView(
        dailyPanel,
        logService.getAllLogs(),
        date => {
            showDate(date);
        },
        () => {
            refreshDailyLog();
        }
    );


searchButton.addEventListener(
    "click",
    () => {

        journalSearchView.toggle(
            logService.getAllLogs()
        );
    }
);


// ============================================================
// STATS
// ============================================================

function showStats(filterKey) {

    if (filterKey === "all") {
        statsSection.classList.remove("visible");
        return;
    }

    statsView.render(filterKey);
    statsSection.classList.add("visible");
}


function refreshStatsIfVisible() {

    if (
        statsSection.classList.contains(
            "visible"
        )
    ) {
        statsView.render(
            statsView.activeFilter
        );
    }
}


// ============================================================
// SHOW DATE
// ============================================================

function showDate(date) {

    selectedDate =
        date;


    dailyLogView.setDate(
        date
    );


    let log =
        logService.getLog(
            date
        );


    if (!log) {

        log =
            logService.createLog(
                date
            );
    }


    dailyLogView.render(
        log
    );
}


// ============================================================
// HIGHLIGHT
// ============================================================

function updateHighlight(
    highlight
) {

    const log =
        logService.getLog(
            selectedDate
        );


    if (!log) {
        return;
    }


    log.setHighlight(
        highlight
    );


    logService.saveLogs();
}


// ============================================================
// JOURNAL
// ============================================================

function updateJournal(
    journal
) {

    const log =
        logService.getLog(
            selectedDate
        );


    if (!log) {
        return;
    }


    log.setJournal(
        journal
    );


    logService.saveLogs();
}


// ============================================================
// TASKS
// ============================================================

function addTask(
    description
) {

    if (!selectedDate) {
        return;
    }


    taskService.addTask(
        selectedDate,
        description
    );


    refreshDailyLog();
    updateMonthStats();
}


function toggleTask(
    index
) {

    if (!selectedDate) {
        return;
    }


    taskService.toggleTask(
        selectedDate,
        index
    );


    refreshDailyLog();
    updateMonthStats();
}


function editTask(
    index,
    description
) {

    if (!selectedDate) {
        return;
    }


    taskService.updateTask(
        selectedDate,
        index,
        description
    );


    refreshDailyLog();
    updateMonthStats();
}


function deleteTask(
    index
) {

    if (!selectedDate) {
        return;
    }


    taskService.removeTask(
        selectedDate,
        index
    );


    refreshDailyLog();
    updateMonthStats();
}


// ============================================================
// ACTIVITIES
// ============================================================

function handleActivityAdd(
    data
) {

    if (!selectedDate) {
        return;
    }


    // --------------------------------------------------------
    // The first click on + sends no activity data.
    // That means the view is opening its picker.
    // --------------------------------------------------------

    if (!data) {
        const picker =
            dailyPanel.querySelector(
                ".activity-picker"
            );


        if (picker) {

            picker.style.display =
                picker.style.display === "none"
                    ? "flex"
                    : "none";
        }

        return;
    }


    // --------------------------------------------------------
    // STUDY
    // --------------------------------------------------------

    if (
        data.type === "study"
    ) {

        const activity =
            new StudyActivity(
                selectedDate,
                data.subject,
                Number(data.duration)
            );


        activityService.addActivity(
            selectedDate,
            activity
        );
    }


    // --------------------------------------------------------
    // FOOTBALL
    // --------------------------------------------------------

    else if (
        data.type === "football"
    ) {

        const activity =
            new FootballActivity(
                selectedDate,
                Number(data.duration)
            );


        activityService.addActivity(
            selectedDate,
            activity
        );
    }


    // --------------------------------------------------------
    // GYM
    // --------------------------------------------------------

    else if (
        data.type === "gym"
    ) {

        const workout =
            new GymWorkout(
                selectedDate,
                data.name
            );

        if (
            Array.isArray(data.exercises)
        ) {

            for (
                const exerciseData
                of data.exercises
            ) {

                if (
                    !exerciseData ||
                    !exerciseData.name ||
                    !Array.isArray(
                        exerciseData.sets
                    ) ||
                    exerciseData.sets.length === 0
                ) {
                    continue;
                }

                const exercise =
                    workout.addExercise(
                        exerciseData.name
                    );

                for (
                    const setData
                    of exerciseData.sets
                ) {

                    exercise.addSet(
                        setData.weight,
                        setData.reps
                    );
                }
            }
        }


        activityService.addActivity(
            selectedDate,
            workout
        );
    }


    refreshDailyLog();

    updateCalendarActivities();
    updateMonthStats();
    refreshStatsIfVisible();
}


// ============================================================
// DELETE ACTIVITY
// ============================================================

function handleActivityDelete(index) {

    if (!selectedDate) {
        return;
    }

    activityService.removeActivity(
        selectedDate,
        index
    );

    refreshDailyLog();

    updateCalendarActivities();
    updateMonthStats();
    refreshStatsIfVisible();
}


// ============================================================
// EDIT ACTIVITY
// ============================================================

function handleActivityEdit(index, data) {

    if (!selectedDate) {
        return;
    }

    if (!data) {
        return;
    }

    let activity = null;

    if (data.type === "study") {

        activity =
            new StudyActivity(
                selectedDate,
                data.subject,
                Number(data.duration)
            );

    } else if (data.type === "football") {

        activity =
            new FootballActivity(
                selectedDate,
                Number(data.duration)
            );

    } else if (data.type === "gym") {

        const workout =
            new GymWorkout(
                selectedDate,
                data.name
            );

        if (
            Array.isArray(data.exercises)
        ) {

            for (
                const exerciseData
                of data.exercises
            ) {

                if (
                    !exerciseData ||
                    !exerciseData.name ||
                    !Array.isArray(
                        exerciseData.sets
                    ) ||
                    exerciseData.sets.length === 0
                ) {
                    continue;
                }

                const exercise =
                    workout.addExercise(
                        exerciseData.name
                    );

                for (
                    const setData
                    of exerciseData.sets
                ) {

                    exercise.addSet(
                        setData.weight,
                        setData.reps
                    );
                }
            }
        }

        activity = workout;
    }

    if (!activity) {
        return;
    }

    activityService.editActivity(
        selectedDate,
        index,
        activity
    );

    refreshDailyLog();

    updateCalendarActivities();
    updateMonthStats();
    refreshStatsIfVisible();
}


// ============================================================
// REFRESH DAILY LOG
// ============================================================

function refreshDailyLog() {

    const log =
        logService.getLog(
            selectedDate
        );


    if (log) {

        dailyLogView.setDate(
            selectedDate
        );

        dailyLogView.render(
            log
        );
    }
}


// ============================================================
// CALENDAR ACTIVITY MARKERS
// ============================================================

function updateCalendarActivities() {

    const typeDates = {};

    const logs =
        logService.getAllLogs();


    for (
        const log
        of logs
    ) {

        if (
            !Array.isArray(log.activities)
        ) {
            continue;
        }

        const seen = new Set();

        for (
            const activity
            of log.activities
        ) {

            if (
                !activity ||
                !activity.type ||
                seen.has(activity.type)
            ) {
                continue;
            }

            seen.add(activity.type);

            if (!typeDates[activity.type]) {
                typeDates[activity.type] = [];
            }

            typeDates[activity.type].push(
                log.date
            );
        }
    }


    calendarView.setActivityTypeDates(
        typeDates
    );


    const journalDates = [];

    for (
        const log
        of logs
    ) {

        const hasText =
            (
                log.journal &&
                log.journal.trim().length > 0
            ) ||
            (
                log.highlight &&
                log.highlight.trim().length > 0
            );

        if (hasText) {

            journalDates.push(
                log.date
            );
        }
    }


    calendarView.setJournalDates(
        journalDates
    );


    calendarView.render();
}


// ============================================================
// MONTH STATS
// ============================================================

function updateMonthStats() {
    const logs = logService.getAllLogs();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let entriesCount = 0;
    let totalMinutes = 0;

    for (const log of logs) {
        const logDate = new Date(`${log.date}T00:00:00`);
        if (
            logDate.getMonth() === currentMonth &&
            logDate.getFullYear() === currentYear
        ) {
            const hasTasks = log.tasks && log.tasks.length > 0;
            const hasActivities = log.activities && log.activities.length > 0;
            const hasJournal = log.journal && log.journal.trim().length > 0;
            const hasHighlight = log.highlight && log.highlight.trim().length > 0;

            if (hasTasks || hasActivities || hasJournal || hasHighlight) {
                entriesCount++;
            }

            if (hasActivities) {
                for (const activity of log.activities) {
                    if (activity.duration) {
                        totalMinutes += Number(activity.duration);
                    }
                }
            }
        }
    }

    const hours = totalMinutes / 60;
    const formattedHours = hours % 1 === 0 ? hours : hours.toFixed(1);

    const stats = document.querySelectorAll(".month-stat strong");
    if (stats.length >= 4) {
        stats[0].textContent = now.getMonth() + 1;
        stats[1].textContent = entriesCount;
        stats[2].textContent = formattedHours;
        stats[3].textContent = currentStreak();
    }

    updateStreakTooltip();
}


function updateStreakTooltip() {

    const tooltip =
        document.getElementById(
            "streak-tooltip"
        );

    if (!tooltip) {
        return;
    }

    const loggedDates =
        logService.getAllLogs()
            .filter(log => logHasContent(log))
            .map(log => log.date)
            .filter(Boolean)
            .sort();

    if (loggedDates.length === 0) {

        tooltip.textContent =
            "No entries yet.";

        return;
    }

    const latest =
        loggedDates[loggedDates.length - 1];

    const dateObj =
        new Date(
            `${latest}T00:00:00`
        );

    const formatted =
        dateObj.toLocaleDateString(
            "default",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    tooltip.textContent =
        `Most recent entry: ${formatted}`;
}


function logHasContent(log) {

    if (!log) {
        return false;
    }

    return (
        (log.tasks && log.tasks.length > 0) ||
        (log.activities && log.activities.length > 0) ||
        (log.journal && log.journal.trim().length > 0) ||
        (log.highlight && log.highlight.trim().length > 0)
    );
}


function currentStreak() {

    const byDate =
        new Set(
            logService.getAllLogs()
                .filter(log => logHasContent(log))
                .map(log => log.date)
        );

    let streak = 0;

    const today = new Date();

    for (let i = 0; i < 365; i++) {

        const day =
            new Date(today);

        day.setDate(
            today.getDate() - i
        );

        const dateString =
            formatDateKey(day);

        if (byDate.has(dateString)) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}


function formatDateKey(date) {

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${date.getFullYear()}-${month}-${day}`;
}

async function initialise() {

    selectedDate =
        calendarView.selectedDate;


    await logService.initRemote();


    updateCalendarActivities();
    updateMonthStats();


    showDate(
        selectedDate
    );
}


initialise();

}