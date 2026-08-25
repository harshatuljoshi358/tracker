/* =====================================================
   MOCK DATA
===================================================== */

const activities = {

    gym: {
        name: "Gym",

        dates: [2, 4, 7, 10, 12, 15, 18, 20, 22, 24, 25],

        entries: {
            25: {
                title: "Gym / Push",
                duration: "01:14",
                details: [
                    "Bench Press · 75 kg × 6",
                    "Incline DB Press · 24 kg × 8",
                    "Shoulder Press · 18 kg × 10"
                ]
            },

            24: {
                title: "Gym / Pull",
                duration: "01:05",
                details: [
                    "Deadlift · 100 kg × 5",
                    "Lat Pulldown · 60 kg × 10",
                    "DB Row · 26 kg × 8"
                ]
            },

            22: {
                title: "Gym / Legs",
                duration: "01:10",
                details: [
                    "Squat · 90 kg × 6",
                    "Leg Press · 160 kg × 10",
                    "Leg Curl · 45 kg × 10"
                ]
            }
        },

        stats: {
            "Sessions": "11",
            "Volume": "42,850 kg",
            "Personal Records": "3"
        }
    },


    football: {
        name: "Football",

        dates: [3, 8, 11, 16, 19, 22, 25],

        entries: {
            25: {
                title: "Football / Match",
                duration: "01:30",
                details: [
                    "Position · Right Back",
                    "Goals · 0",
                    "Assists · 1"
                ]
            },

            22: {
                title: "Football / Training",
                duration: "01:15",
                details: [
                    "Passing drills",
                    "Defensive positioning",
                    "Small-sided game"
                ]
            }
        },

        stats: {
            "Sessions": "7",
            "Time Played": "9h 20m",
            "Average Rating": "7.1"
        }
    },


    study: {
        name: "Study",

        dates: [
            1, 3, 5, 8, 10, 12,
            15, 17, 18, 20, 21, 23, 25
        ],

        entries: {
            25: {
                title: "Study / GraphRAG",
                duration: "02:10",
                details: [
                    "Subject · Backend",
                    "Topic · GraphRAG",
                    "Focus · Knowledge graphs"
                ]
            },

            23: {
                title: "Study / FastAPI",
                duration: "01:40",
                details: [
                    "Subject · Backend",
                    "Topic · REST APIs",
                    "Focus · Routing"
                ]
            }
        },

        stats: {
            "Total Time": "23h 20m",
            "Backend": "9h",
            "Machine Learning": "6h"
        }
    }
};


/* =====================================================
   DAILY DATA
===================================================== */

const dailyData = {

    25: {
        highlight: "New bench press PR.",

        journal:
            "Gym felt strong today. " +
            "Made good progress with GraphRAG. " +
            "Football wasn't great. " +
            "Need to work on positioning."
    },

    24: {
        highlight: "Completed a full pull workout.",

        journal:
            "Good session today. " +
            "Deadlift felt better than expected. " +
            "Spent some time reviewing backend concepts."
    },

    23: {
        highlight: "Finished another section of the project.",

        journal:
            "Mostly a study day. " +
            "Worked through FastAPI routing and dependencies."
    }
};


/* =====================================================
   TASK CLASS
===================================================== */

class Task {

    constructor(id, text, completed = false) {

        this.id = id;
        this.text = text;
        this.completed = completed;
    }


    toggle() {

        this.completed = !this.completed;
    }
}


/* =====================================================
   TASK MANAGER
===================================================== */

class TaskManager {

    constructor(container, counter) {

        this.container = container;
        this.counter = counter;

        this.tasks = [
            new Task(1, "Gym / Push", true),
            new Task(2, "Study / GraphRAG", true),
            new Task(3, "Football / 19:00", false),
            new Task(4, "Read / 20 pages", false)
        ];

        this.render();
    }


    toggleTask(id) {

        const task = this.tasks.find(
            task => task.id === id
        );

        if (!task) {
            return;
        }

        task.toggle();

        this.render();
    }


    addTask(text) {

        if (!text.trim()) {
            return;
        }

        const task = new Task(
            Date.now(),
            text,
            false
        );

        this.tasks.push(task);

        this.render();
    }


    render() {

        this.container.innerHTML = "";

        this.tasks.forEach(task => {

            const element =
                document.createElement("div");

            element.classList.add("task");

            if (task.completed) {
                element.classList.add("completed");
            }

            element.innerHTML = `
                <div class="task-checkbox"></div>

                <span class="task-text">
                    ${task.text}
                </span>
            `;

            element.addEventListener(
                "click",
                () => this.toggleTask(task.id)
            );

            this.container.appendChild(element);
        });

        this.updateCounter();
    }


    updateCounter() {

        const completed =
            this.tasks.filter(
                task => task.completed
            ).length;

        this.counter.textContent =
            `${completed} / ${this.tasks.length}`;
    }
}


/* =====================================================
   CALENDAR
===================================================== */

class Calendar {

    constructor(
        container,
        monthLabel,
        onDaySelected
    ) {

        this.container = container;
        this.monthLabel = monthLabel;

        this.year = 2026;
        this.month = 7; // August

        this.selectedActivity = "all";
        this.selectedDay = 25;

        this.onDaySelected = onDaySelected;

        this.render();
    }


    setActivity(activity) {

        this.selectedActivity = activity;

        this.selectedDay = null;

        this.render();
    }


    getLoggedDays() {

        if (this.selectedActivity === "all") {

            const days = new Set();

            Object.values(activities).forEach(
                activity => {

                    activity.dates.forEach(
                        day => days.add(day)
                    );
                }
            );

            return days;
        }


        return new Set(
            activities[
                this.selectedActivity
            ].dates
        );
    }


    getDaysInMonth() {

        return new Date(
            this.year,
            this.month + 1,
            0
        ).getDate();
    }


    getFirstDay() {

        const date = new Date(
            this.year,
            this.month,
            1
        );

        return (
            date.getDay() + 6
        ) % 7;
    }


    selectDay(day) {

        this.selectedDay = day;

        this.render();

        this.onDaySelected(
            day,
            this.selectedActivity
        );
    }


    render() {

        this.container.innerHTML = "";

        const loggedDays =
            this.getLoggedDays();

        const daysInMonth =
            this.getDaysInMonth();

        const firstDay =
            this.getFirstDay();


        const monthName =
            new Date(
                this.year,
                this.month
            ).toLocaleString(
                "en-US",
                {
                    month: "long"
                }
            );


        this.monthLabel.textContent =
            `${monthName.toUpperCase()} ${this.year}`;


        /*
            Empty cells
        */

        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            const empty =
                document.createElement("span");

            empty.classList.add(
                "calendar-day",
                "empty"
            );

            this.container.appendChild(empty);
        }


        /*
            Calendar days
        */

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const element =
                document.createElement("button");

            element.type = "button";

            element.classList.add(
                "calendar-day"
            );


            /*
                Logged activity
            */

            if (loggedDays.has(day)) {

                element.classList.add(
                    "logged"
                );
            }


            /*
                Today
            */

            if (
                this.year === 2026 &&
                this.month === 7 &&
                day === 25
            ) {

                element.classList.add(
                    "today"
                );
            }


            /*
                Selected day
            */

            if (
                this.selectedDay === day
            ) {

                element.classList.add(
                    "selected"
                );
            }


            element.textContent = day;


            element.addEventListener(
                "click",
                () => this.selectDay(day)
            );


            this.container.appendChild(element);
        }
    }
}


/* =====================================================
   ACTIVITY MANAGER
===================================================== */

class ActivityManager {

    constructor(
        buttons,
        nameElement,
        summaryElement,
        calendar
    ) {

        this.buttons = buttons;
        this.nameElement = nameElement;
        this.summaryElement = summaryElement;
        this.calendar = calendar;

        this.currentActivity = "all";

        this.initialize();
    }


    initialize() {

        this.buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    this.selectActivity(
                        button.dataset.activity
                    );
                }
            );
        });

        this.render();
    }


    selectActivity(activity) {

        this.currentActivity = activity;


        this.buttons.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.activity === activity
            );
        });


        this.calendar.setActivity(
            activity
        );


        if (activity === "all") {

            this.nameElement.textContent =
                "All Activity";

        } else {

            this.nameElement.textContent =
                activities[activity].name;
        }


        this.render();
    }


    render() {

        this.summaryElement.innerHTML = "";


        if (
            this.currentActivity === "all"
        ) {

            this.addSummaryRow(
                "ACTIVE DAYS",
                "18"
            );

            return;
        }


        const data =
            activities[
                this.currentActivity
            ];


        Object.entries(
            data.stats
        ).forEach(
            ([label, value]) => {

                this.addSummaryRow(
                    label,
                    value
                );
            }
        );
    }


    addSummaryRow(label, value) {

        const row =
            document.createElement("div");

        row.classList.add(
            "summary-row"
        );

        row.innerHTML = `
            <span class="summary-label">
                ${label}
            </span>

            <span class="summary-value">
                ${value}
            </span>
        `;

        this.summaryElement.appendChild(
            row
        );
    }
}


/* =====================================================
   DAILY VIEW
===================================================== */

class DailyView {

    constructor() {

        this.heading =
            document.getElementById(
                "todayHeading"
            );

        this.highlight =
            document.getElementById(
                "highlightText"
            );

        this.journal =
            document.getElementById(
                "journalText"
            );
    }


    showDay(day) {

        const date =
            new Date(
                2026,
                7,
                day
            );


        const month =
            date.toLocaleString(
                "en-US",
                {
                    month: "long"
                }
            );


        this.heading.textContent =
            `${day} ${month}`;


        const data =
            dailyData[day];


        if (!data) {

            this.highlight.textContent =
                "No highlight recorded.";

            this.journal.textContent =
                "No journal entry recorded for this day.";

            return;
        }


        this.highlight.textContent =
            data.highlight;

        this.journal.textContent =
            data.journal;
    }
}


/* =====================================================
   DAY DETAIL VIEW
===================================================== */

class DayDetailView {

    constructor(container) {

        this.container = container;
    }


    show(day, activity) {

        this.container.innerHTML = "";


        if (
            activity === "all"
        ) {

            this.showAllActivities(day);

            return;
        }


        const selected =
            activities[activity];


        const entry =
            selected.entries?.[day];


        if (!entry) {

            this.container.innerHTML = `
                <div class="no-entry">
                    <span class="label">
                        ${selected.name.toUpperCase()}
                    </span>

                    <p>
                        No ${selected.name.toLowerCase()}
                        entry was recorded on this day.
                    </p>
                </div>
            `;

            return;
        }


        this.container.innerHTML = `

            <div class="day-entry">

                <div class="day-entry-header">

                    <div>

                        <span class="label">
                            ${selected.name.toUpperCase()}
                        </span>

                        <h3>
                            ${entry.title}
                        </h3>

                    </div>

                    <span class="duration">
                        ${entry.duration}
                    </span>

                </div>


                <div class="entry-details">

                    ${entry.details
                        .map(detail => `
                            <div>
                                ${detail}
                            </div>
                        `)
                        .join("")
                    }

                </div>

            </div>
        `;
    }


    showAllActivities(day) {

        const entries = [];


        Object.entries(
            activities
        ).forEach(
            ([key, activity]) => {

                const entry =
                    activity.entries?.[day];


                if (entry) {

                    entries.push({
                        activity: activity.name,
                        entry: entry
                    });
                }
            }
        );


        if (entries.length === 0) {

            this.container.innerHTML = `
                <div class="no-entry">

                    <span class="label">
                        ${day} AUGUST
                    </span>

                    <p>
                        No activity was recorded
                        on this day.
                    </p>

                </div>
            `;

            return;
        }


        entries.forEach(item => {

            const element =
                document.createElement("div");

            element.classList.add(
                "day-entry",
                "compact"
            );


            element.innerHTML = `

                <div class="day-entry-header">

                    <div>

                        <span class="label">
                            ${item.activity.toUpperCase()}
                        </span>

                        <h3>
                            ${item.entry.title}
                        </h3>

                    </div>

                    <span class="duration">
                        ${item.entry.duration}
                    </span>

                </div>

            `;


            this.container.appendChild(
                element
            );
        });
    }
}


/* =====================================================
   DASHBOARD
===================================================== */

class Dashboard {

    constructor() {

        this.dailyView =
            new DailyView();


        this.dayDetail =
            new DayDetailView(
                document.getElementById(
                    "activitySummary"
                )
            );


        this.initializeCalendar();

        this.initializeTasks();

        this.initializeAddTask();

        this.showInitialState();
    }


    initializeCalendar() {

        const calendarElement =
            document.getElementById(
                "calendarDays"
            );


        const calendarMonth =
            document.getElementById(
                "calendarMonth"
            );


        this.calendar =
            new Calendar(
                calendarElement,
                calendarMonth,
                (day, activity) => {

                    this.handleDaySelected(
                        day,
                        activity
                    );
                }
            );


        const buttons =
            document.querySelectorAll(
                ".activity-button"
            );


        this.activityManager =
            new ActivityManager(
                buttons,

                document.getElementById(
                    "selectedActivityName"
                ),

                document.getElementById(
                    "activitySummary"
                ),

                this.calendar
            );
    }


    initializeTasks() {

        this.taskManager =
            new TaskManager(

                document.getElementById(
                    "taskList"
                ),

                document.getElementById(
                    "taskCount"
                )
            );
    }


    initializeAddTask() {

        document
            .getElementById(
                "addTaskButton"
            )
            .addEventListener(
                "click",
                () => {

                    const task =
                        prompt(
                            "What do you want to do?"
                        );


                    if (task) {

                        this.taskManager.addTask(
                            task
                        );
                    }
                }
            );
    }


    handleDaySelected(
        day,
        activity
    ) {

        this.dailyView.showDay(day);

        this.dayDetail.show(
            day,
            activity
        );
    }


    showInitialState() {

        this.dailyView.showDay(25);

        this.dayDetail.show(
            25,
            "all"
        );
    }
}


/* =====================================================
   START APPLICATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        new Dashboard();

    }
);