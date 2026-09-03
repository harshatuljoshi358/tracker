export default class GymEntryView {

    constructor() {
        this.root = null;
    }


    render(workoutType, initialExercises) {

        this.root =
            document.createElement("div");

        this.root.classList.add(
            "gym-entry"
        );


        const heading =
            document.createElement("div");

        heading.classList.add(
            "gym-entry-heading"
        );


        const title =
            document.createElement("span");

        title.textContent =
            workoutType.name;

        title.classList.add(
            "gym-entry-title"
        );

        heading.appendChild(title);


        const subtitle =
            document.createElement("span");

        subtitle.textContent =
            workoutType.exercises.length + " exercises";

        subtitle.classList.add(
            "gym-entry-count"
        );

        heading.appendChild(subtitle);

        this.root.appendChild(heading);


        const exercisesGrid =
            document.createElement("div");

        exercisesGrid.classList.add(
            "gym-exercises"
        );

        const prefillMap = {};

        if (
            Array.isArray(initialExercises)
        ) {
            for (
                const exercise
                of initialExercises
            ) {
                if (
                    exercise &&
                    Array.isArray(exercise.sets)
                ) {
                    prefillMap[exercise.name] =
                        exercise.sets;
                }
            }
        }

        for (
            const exerciseName
            of workoutType.exercises
        ) {

            exercisesGrid.appendChild(
                this.renderExerciseRow(
                    exerciseName,
                    prefillMap[exerciseName]
                )
            );
        }

        this.root.appendChild(
            exercisesGrid
        );


        const saveButton =
            document.createElement("button");

        saveButton.type = "button";

        saveButton.textContent =
            "Save Workout";

        saveButton.classList.add(
            "gym-save-button"
        );

        saveButton.addEventListener(
            "click",
            () => {

                const data =
                    this.getData();

                if (
                    data.exercises.some(
                        e => e.sets.length > 0
                    )
                ) {
                    this.onSave(data);
                }
            }
        );

        this.root.appendChild(saveButton);


        return this.root;
    }


    renderExerciseRow(exerciseName, initialSets) {

        const row =
            document.createElement("div");

        row.classList.add(
            "gym-exercise"
        );


        const name =
            document.createElement("span");

        name.textContent =
            exerciseName;

        name.classList.add(
            "gym-exercise-name"
        );


        const setsContainer =
            document.createElement("div");

        setsContainer.classList.add(
            "gym-sets"
        );


        const addSetRow =
            document.createElement("div");

        addSetRow.classList.add(
            "gym-set-input-row"
        );


        const weightInput =
            document.createElement("input");

        weightInput.type = "number";
        weightInput.min = "0";
        weightInput.step = "0.5";
        weightInput.placeholder = "kg";

        weightInput.classList.add(
            "gym-weight-input"
        );


        const repsInput =
            document.createElement("input");

        repsInput.type = "number";
        repsInput.min = "1";
        repsInput.placeholder = "reps";

        repsInput.classList.add(
            "gym-reps-input"
        );


        const addSetButton =
            document.createElement("button");

        addSetButton.type = "button";
        addSetButton.textContent = "+";

        addSetButton.classList.add(
            "gym-add-set-button"
        );


        const appendSet = () => {

            const weight =
                Number(
                    weightInput.value
                );

            const reps =
                Number(
                    repsInput.value
                );

            if (
                !weight ||
                weight <= 0 ||
                !reps ||
                reps <= 0
            ) {
                return;
            }

            addSet(weight, reps);

            weightInput.value = "";
            repsInput.value = "";

            weightInput.focus();
        };

        addSetButton.addEventListener(
            "click",
            appendSet
        );

        repsInput.addEventListener(
            "keydown",
            event => {
                if (event.key === "Enter") {
                    appendSet();
                }
            }
        );


        const addSet = (weight, reps) => {

            const set =
                document.createElement("div");

            set.classList.add(
                "gym-set"
            );

            set.dataset.weight = weight;
            set.dataset.reps = reps;


            const label =
                document.createElement("span");

            label.textContent =
                `${weight} kg × ${reps} reps`;

            set.appendChild(label);


            const remove =
                document.createElement("button");

            remove.type = "button";

            remove.textContent = "×";

            remove.classList.add(
                "gym-set-remove"
            );

            remove.addEventListener(
                "click",
                () => {
                    set.remove();
                }
            );

            set.appendChild(remove);

            setsContainer.appendChild(set);
        };


        addSetRow.appendChild(weightInput);
        addSetRow.appendChild(repsInput);
        addSetRow.appendChild(addSetButton);

        if (
            Array.isArray(initialSets)
        ) {
            for (const set of initialSets) {
                if (
                    set &&
                    set.weight > 0 &&
                    set.reps > 0
                ) {
                    addSet(set.weight, set.reps);
                }
            }
        }

        row.appendChild(name);
        row.appendChild(setsContainer);
        row.appendChild(addSetRow);

        return row;
    }


    getData() {

        const exercises = [];

        const rows =
            this.root.querySelectorAll(
                ".gym-exercise"
            );

        for (const row of rows) {

            const nameEl =
                row.querySelector(
                    ".gym-exercise-name"
                );

            const sets = [];

            const setEls =
                row.querySelectorAll(
                    ".gym-set"
                );

            for (const setEl of setEls) {

                sets.push({
                    weight: Number(setEl.dataset.weight),
                    reps: Number(setEl.dataset.reps)
                });
            }

            if (sets.length === 0) {
                continue;
            }

            exercises.push({
                name: nameEl.textContent,
                sets
            });
        }

        return {
            exercises
        };
    }
}
