/* =====================================================
   WORKOUT EDITOR
   Inline form for creating a workout. Holds an
   in-progress Workout object the user mutates, then
   commits it to GymManager on save. Cancel discards.
===================================================== */

import { Workout } from "./Workout.js";
import { Exercise } from "./Exercise.js";

export class WorkoutEditor {

    constructor(
        container,
        gymManager,
        onSaved = null,
        onCancelled = null
    ) {

        this.container = container;
        this.gymManager = gymManager;
        this.onSaved = onSaved;
        this.onCancelled = onCancelled;

        this.draft = null;
    }


    show() {

        const today = new Date();

        this.draft = new Workout(
            this.makeId(),
            today,
            "Push",
            []
        );

        /*
            Start with one empty exercise so the
            user has something concrete to edit.
        */

        this.draft.addExercise("Bench Press");

        this.render();
    }


    hide() {

        this.draft = null;

        this.container.innerHTML = "";

        this.container.classList.add(
            "is-hidden"
        );
    }


    isVisible() {

        return !this.container
            .classList.contains("is-hidden");
    }


    makeId() {

        return `w-${Date.now()}-${Math.floor(
            Math.random() * 1000
        )}`;
    }


    render() {

        this.container.classList.remove(
            "is-hidden"
        );


        const dateValue = this.formatDate(
            this.draft.date
        );


        this.container.innerHTML = `

            <div class="editor-meta">
                <span class="label">NEW WORKOUT</span>
                <h2>Log a session</h2>
            </div>


            <div class="editor-row editor-header">

                <label class="editor-field">
                    <span class="label">DATE</span>
                    <input
                        type="date"
                        id="editorDate"
                        value="${dateValue}"
                    >
                </label>


                <label class="editor-field">
                    <span class="label">TYPE</span>
                    <input
                        type="text"
                        id="editorType"
                        value="${this.escape(this.draft.workoutType)}"
                        placeholder="Push, Pull, Legs, ..."
                    >
                </label>

            </div>


            <div id="editorExercises">
                ${this.renderExercises()}
            </div>


            <div class="editor-actions">

                <button
                    type="button"
                    class="text-button"
                    id="addExerciseButton"
                >
                    + ADD EXERCISE
                </button>

            </div>


            <div class="editor-footer">

                <button
                    type="button"
                    class="text-button"
                    id="cancelEditorButton"
                >
                    CANCEL
                </button>


                <button
                    type="button"
                    class="primary-button"
                    id="saveEditorButton"
                >
                    SAVE WORKOUT
                </button>

            </div>

        `;


        this.wireEvents();
    }


    renderExercises() {

        return this.draft.exercises.map(
            (exercise, exIndex) => `

            <div
                class="exercise-edit-block"
                data-ex-index="${exIndex}"
            >

                <div class="exercise-edit-header">

                    <input
                        type="text"
                        class="exercise-name-input"
                        data-ex-index="${exIndex}"
                        value="${this.escape(exercise.name)}"
                        placeholder="Exercise name"
                    >

                    <button
                        type="button"
                        class="text-button remove-exercise"
                        data-ex-index="${exIndex}"
                    >
                        REMOVE
                    </button>

                </div>


                <div
                    class="set-edit-list"
                    data-ex-index="${exIndex}"
                >
                    ${exercise.sets.map(
                        (set, setIndex) => `

                        <div
                            class="set-edit-row"
                            data-ex-index="${exIndex}"
                            data-set-index="${setIndex}"
                        >

                            <input
                                type="number"
                                min="0"
                                step="0.5"
                                class="set-input set-weight-input"
                                data-ex-index="${exIndex}"
                                data-set-index="${setIndex}"
                                value="${set.weight}"
                                placeholder="kg"
                            >

                            <span class="set-x">×</span>

                            <input
                                type="number"
                                min="0"
                                step="1"
                                class="set-input set-reps-input"
                                data-ex-index="${exIndex}"
                                data-set-index="${setIndex}"
                                value="${set.reps}"
                                placeholder="reps"
                            >

                            <button
                                type="button"
                                class="text-button remove-set"
                                data-ex-index="${exIndex}"
                                data-set-index="${setIndex}"
                            >
                                REMOVE
                            </button>

                        </div>

                    `).join("")}
                </div>


                <button
                    type="button"
                    class="text-button add-set"
                    data-ex-index="${exIndex}"
                >
                    + ADD SET
                </button>

            </div>

        `).join("");
    }


    wireEvents() {

        this.container
            .querySelector("#editorDate")
            .addEventListener(
                "change",
                (e) => {

                    const next = new Date(
                        e.target.value
                    );

                    if (!isNaN(next.getTime())) {
                        this.draft.date = next;
                    }
                }
            );


        this.container
            .querySelector("#editorType")
            .addEventListener(
                "input",
                (e) => {

                    this.draft.workoutType =
                        e.target.value;
                }
            );


        this.container
            .querySelectorAll(".exercise-name-input")
            .forEach(input => {

                input.addEventListener(
                    "input",
                    (e) => {

                        const i = Number(
                            e.target.dataset.exIndex
                        );

                        this.draft.exercises[i].name =
                            e.target.value;
                    }
                );
            });


        this.container
            .querySelectorAll(".set-weight-input")
            .forEach(input => {

                input.addEventListener(
                    "input",
                    (e) => {

                        const exIndex = Number(
                            e.target.dataset.exIndex
                        );

                        const setIndex = Number(
                            e.target.dataset.setIndex
                        );

                        const exercise =
                            this.draft
                                .exercises[exIndex];

                        const current =
                            exercise
                                .sets[setIndex];

                        const w = Number(
                            e.target.value
                        );

                        if (
                            Number.isFinite(w) &&
                            w >= 0 &&
                            current
                        ) {
                            current.weight = w;
                        }
                    }
                );
            });


        this.container
            .querySelectorAll(".set-reps-input")
            .forEach(input => {

                input.addEventListener(
                    "input",
                    (e) => {

                        const exIndex = Number(
                            e.target.dataset.exIndex
                        );

                        const setIndex = Number(
                            e.target.dataset.setIndex
                        );

                        const exercise =
                            this.draft
                                .exercises[exIndex];

                        const current =
                            exercise
                                .sets[setIndex];

                        const r = Number(
                            e.target.value
                        );

                        if (
                            Number.isInteger(r) &&
                            r >= 0 &&
                            current
                        ) {
                            current.reps = r;
                        }
                    }
                );
            });


        this.container
            .querySelectorAll(".add-set")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const exIndex = Number(
                            button.dataset.exIndex
                        );

                        this.draft.exercises[
                            exIndex
                        ].addSet(0, 0);

                        this.renderExercisesOnly();
                    }
                );
            });


        this.container
            .querySelectorAll(".remove-set")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const exIndex = Number(
                            button.dataset.exIndex
                        );

                        const setIndex = Number(
                            button.dataset.setIndex
                        );

                        this.draft.exercises[
                            exIndex
                        ].removeSet(setIndex);

                        this.renderExercisesOnly();
                    }
                );
            });


        this.container
            .querySelectorAll(".remove-exercise")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const exIndex = Number(
                            button.dataset.exIndex
                        );

                        this.draft.removeExercise(
                            exIndex
                        );

                        this.renderExercisesOnly();
                    }
                );
            });


        this.container
            .querySelector("#addExerciseButton")
            .addEventListener(
                "click",
                () => {

                    this.draft.addExercise(
                        "New Exercise"
                    );

                    this.renderExercisesOnly();
                }
            );


        this.container
            .querySelector("#cancelEditorButton")
            .addEventListener(
                "click",
                () => {

                    this.hide();

                    if (this.onCancelled) {
                        this.onCancelled();
                    }
                }
            );


        this.container
            .querySelector("#saveEditorButton")
            .addEventListener(
                "click",
                () => {

                    this.save();
                }
            );
    }


    /*
        Re-render only the exercises sub-tree
        so that the date / type inputs don't
        lose focus while the user is editing.
    */

    renderExercisesOnly() {

        const target = this.container.querySelector(
            "#editorExercises"
        );

        if (!target) return;

        target.innerHTML =
            this.renderExercises();

        this.wireExerciseEvents();
    }


    wireExerciseEvents() {

        this.container
            .querySelectorAll(".exercise-name-input")
            .forEach(input => {

                input.addEventListener(
                    "input",
                    (e) => {

                        const i = Number(
                            e.target.dataset.exIndex
                        );

                        this.draft.exercises[i].name =
                            e.target.value;
                    }
                );
            });


        this.container
            .querySelectorAll(".set-weight-input")
            .forEach(input => {

                input.addEventListener(
                    "input",
                    (e) => {

                        const exIndex = Number(
                            e.target.dataset.exIndex
                        );

                        const setIndex = Number(
                            e.target.dataset.setIndex
                        );

                        const exercise =
                            this.draft
                                .exercises[exIndex];

                        const current =
                            exercise
                                .sets[setIndex];

                        const w = Number(
                            e.target.value
                        );

                        if (
                            Number.isFinite(w) &&
                            w >= 0 &&
                            current
                        ) {
                            current.weight = w;
                        }
                    }
                );
            });


        this.container
            .querySelectorAll(".set-reps-input")
            .forEach(input => {

                input.addEventListener(
                    "input",
                    (e) => {

                        const exIndex = Number(
                            e.target.dataset.exIndex
                        );

                        const setIndex = Number(
                            e.target.dataset.setIndex
                        );

                        const exercise =
                            this.draft
                                .exercises[exIndex];

                        const current =
                            exercise
                                .sets[setIndex];

                        const r = Number(
                            e.target.value
                        );

                        if (
                            Number.isInteger(r) &&
                            r >= 0 &&
                            current
                        ) {
                            current.reps = r;
                        }
                    }
                );
            });


        this.container
            .querySelectorAll(".add-set")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const exIndex = Number(
                            button.dataset.exIndex
                        );

                        this.draft.exercises[
                            exIndex
                        ].addSet(0, 0);

                        this.renderExercisesOnly();
                    }
                );
            });


        this.container
            .querySelectorAll(".remove-set")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const exIndex = Number(
                            button.dataset.exIndex
                        );

                        const setIndex = Number(
                            button.dataset.setIndex
                        );

                        this.draft.exercises[
                            exIndex
                        ].removeSet(setIndex);

                        this.renderExercisesOnly();
                    }
                );
            });


        this.container
            .querySelectorAll(".remove-exercise")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const exIndex = Number(
                            button.dataset.exIndex
                        );

                        this.draft.removeExercise(
                            exIndex
                        );

                        this.renderExercisesOnly();
                    }
                );
            });
    }


    save() {

        if (!this.draft) return;


        /*
            Drop empty exercises and zero/zero
            sets so saving a half-finished
            template doesn't pollute history.
        */

        const cleanedExercises = [];

        for (const exercise of this.draft.exercises) {

            const sets = exercise.sets.filter(
                s => s.weight > 0 || s.reps > 0
            );

            if (sets.length === 0) continue;

            const cleaned = new Exercise(
                exercise.name,
                sets
            );

            cleanedExercises.push(cleaned);
        }


        if (cleanedExercises.length === 0) {

            alert(
                "Add at least one exercise with one set before saving."
            );

            return;
        }


        const workout = new Workout(
            this.draft.id,
            this.draft.date,
            this.draft.workoutType,
            cleanedExercises
        );


        this.gymManager.addWorkout(workout);


        this.hide();


        if (this.onSaved) {
            this.onSaved(workout);
        }
    }


    formatDate(date) {

        const y = date.getFullYear();
        const m = String(
            date.getMonth() + 1
        ).padStart(2, "0");
        const d = String(
            date.getDate()
        ).padStart(2, "0");

        return `${y}-${m}-${d}`;
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
