/* =====================================================
   DASHBOARD
   Composes the views and wires them together.
   Owns the GymManager and routes activity / day
   selection to the right panel.
===================================================== */

import { Calendar } from "./Calendar.js";
import { ActivityManager } from "./ActivityManager.js";
import { DailyView } from "./DailyView.js";
import { ActivityInsight } from "./ActivityInsight.js";
import { RecentLogs } from "./RecentLogs.js";
import { TaskManager } from "./TaskManager.js";
import { GymView } from "./GymView.js";
import { GymManager } from "./GymManager.js";
import { buildSeedWorkouts, activities } from "./data.js";

export class Dashboard {

    constructor() {

        this.gymManager = new GymManager(
            buildSeedWorkouts()
        );


        this.dailyView = new DailyView(
            this.gymManager,
            (name) => this.handleExerciseSelected(name)
        );


        this.insight = new ActivityInsight(
            document.getElementById("activityInsight")
        );


        this.recentLogs = new RecentLogs(
            document.getElementById("recentLogs")
        );


        this.gymView = new GymView(
            document.getElementById("workoutEditor"),
            document.getElementById("exerciseHistory"),
            this.gymManager
        );


        this.initializeCalendar();

        this.initializeTasks();

        this.initializeAddTask();

        this.initializeNewWorkout();

        this.subscribeGymManager();

        this.currentActivity = "all";

        this.showInitialState();
    }


    initializeCalendar() {

        const calendarElement =
            document.getElementById("calendarDays");


        const calendarMonth =
            document.getElementById("calendarMonth");


        this.calendar = new Calendar(
            calendarElement,
            calendarMonth,
            (day, activity) => {

                this.handleDaySelected(
                    day,
                    activity
                );
            },
            {

                getLoggedDays: (activity) => {

                    if (activity === "gym") {
                        return this.gymManager.getLoggedDates(
                            this.calendar.year,
                            this.calendar.month
                        );
                    }

                    return new Set(
                        activities[activity]?.dates ?? []
                    );
                }
            }
        );


        const buttons =
            document.querySelectorAll(
                ".activity-button"
            );


        this.activityManager = new ActivityManager(
            buttons,
            document.getElementById(
                "selectedActivityName"
            ),
            document.getElementById(
                "activitySummary"
            ),
            this.calendar,
            (activity) =>
                this.handleActivityChanged(activity)
        );
    }


    initializeTasks() {

        this.taskManager = new TaskManager(
            document.getElementById("taskList"),
            document.getElementById("taskCount")
        );
    }


    initializeAddTask() {

        document
            .getElementById("addTaskButton")
            .addEventListener(
                "click",
                () => {

                    const task =
                        prompt(
                            "What do you want to do?"
                        );

                    if (task) {
                        this.taskManager.addTask(task);
                    }
                }
            );
    }


    initializeNewWorkout() {

        document
            .getElementById("newWorkoutButton")
            .addEventListener(
                "click",
                () => {

                    if (
                        this.gymView.isEditorVisible()
                    ) {
                        this.gymView.hideEditor();
                    } else {
                        this.gymView.showEditor();
                    }
                }
            );
    }


    subscribeGymManager() {

        this.gymManager.subscribe(() => {

            this.calendar.refresh();


            const day = this.dailyView.currentDay;

            if (day !== null) {
                this.dailyView.showDay(
                    day,
                    this.currentActivity
                );
            }
        });
    }


    handleActivityChanged(activity) {

        this.currentActivity = activity;

        this.gymView.hideEditor();


        const newWorkoutButton =
            document.getElementById(
                "newWorkoutButton"
            );


        if (activity === "gym") {

            newWorkoutButton.classList.remove(
                "is-hidden"
            );


            this.recentLogs.hide();

            this.insight.hide();

            this.gymView.refresh();


            const day = this.dailyView.currentDay;

            if (day !== null) {
                this.dailyView.showDay(day, "gym");
            }


        } else if (activity === "all") {

            newWorkoutButton.classList.add(
                "is-hidden"
            );


            this.gymView.hideExerciseHistory();

            this.insight.hide();

            this.recentLogs.show();


            const day = this.dailyView.currentDay;

            if (day !== null) {
                this.dailyView.showDay(day, "all");
            }


        } else {

            newWorkoutButton.classList.add(
                "is-hidden"
            );


            this.gymView.hideExerciseHistory();

            this.recentLogs.hide();

            this.insight.show(activity);
        }
    }


    handleDaySelected(day, activity) {

        this.currentActivity = activity;

        this.dailyView.showDay(day, activity);


        /*
            In gym mode, opening a day with a
            workout also refreshes the history
            view so it stays in sync if the user
            navigates between days.
        */

        if (activity === "gym") {
            this.gymView.refresh();
        }
    }


    handleExerciseSelected(name) {

        if (this.currentActivity !== "gym") {
            this.activityManager.selectActivity("gym");
        }

        this.gymView.showExerciseHistory(name);
    }


    showInitialState() {

        const today = new Date();

        this.dailyView.showDay(
            today.getDate(),
            "all"
        );

        this.recentLogs.show();
    }
}
