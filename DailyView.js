/* =====================================================
   DAILY VIEW
   Renders the highlight + journal for a given day,
   and (when the gym activity is active) the workout
   the user logged for that day. The workout block
   reads from GymManager so it always reflects the
   current stored data.
===================================================== */

import { dailyData } from "./data.js";

export class DailyView {

    constructor(
        gymManager,
        onExerciseSelected = null
    ) {

        this.gymManager = gymManager;
        this.onExerciseSelected =
            onExerciseSelected;

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

        this.workoutContainer =
            document.getElementById(
                "dailyWorkout"
            );

        this.currentDay = null;
        this.currentActivity = "all";
    }


    showDay(day, activity = "all") {

        this.currentDay = day;
        this.currentActivity = activity;

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

        } else {

            this.highlight.textContent =
                data.highlight;

            this.journal.textContent =
                data.journal;
        }


        this.renderWorkout();
    }


    renderWorkout() {

        if (!this.workoutContainer) {
            return;
        }


        /*
            The workout block only appears in
            GYM mode — keeps the other activity
            views clean.
        */

        if (
            this.currentActivity !== "gym" ||
            this.currentDay === null
        ) {

            this.workoutContainer.innerHTML = "";
            this.workoutContainer.classList.add(
                "is-hidden"
            );

            return;
        }


        const date = new Date(
            2026,
            7,
            this.currentDay
        );

        const workout =
            this.gymManager.getWorkoutByDate(date);


        if (!workout) {

            this.workoutContainer.innerHTML = `
                <div class="label">WORKOUT</div>
                <p class="no-workout">
                    No workout logged for this day.
                </p>
            `;

            this.workoutContainer.classList.remove(
                "is-hidden"
            );

            return;
        }


        this.workoutContainer.classList.remove(
            "is-hidden"
            );


        this.workoutContainer.innerHTML = `

            <div class="workout-meta">
                <span class="label">WORKOUT</span>
                <h3>${this.escape(workout.workoutType)}</h3>
            </div>


            <div class="exercise-list">
                ${workout.exercises.map(
                    (exercise, exIndex) => `

                    <div
                        class="exercise-block"
                        data-exercise-index="${exIndex}"
                    >

                        <button
                            type="button"
                            class="exercise-name"
                            data-exercise-name="${this.escape(exercise.name)}"
                        >
                            ${this.escape(exercise.name)}
                        </button>

                        <div class="set-list">
                            ${exercise.sets.map(
                                (set, setIndex) => `

                                <div class="set-row">
                                    <span class="set-weight">
                                        ${set.weight}
                                    </span>
                                    <span class="set-x">
                                        ×
                                    </span>
                                    <span class="set-reps">
                                        ${set.reps}
                                    </span>
                                </div>

                            `).join("")}
                        </div>

                    </div>

                `).join("")}
            </div>

        `;


        /*
            Wire up exercise-name clicks to the
            history view. The Dashboard supplies
            the callback when constructing this.
        */

        if (this.onExerciseSelected) {

            this.workoutContainer
                .querySelectorAll(
                    ".exercise-name"
                )
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        () => {

                            this.onExerciseSelected(
                                button.dataset
                                    .exerciseName
                            );

                        }
                    );
                });
        }
    }


    escape(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
