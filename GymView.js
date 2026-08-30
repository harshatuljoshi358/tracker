/* =====================================================
   GYM VIEW
   Thin composer that owns the workout editor, the
   exercise history view, and the currently selected
   exercise. Wired to GymManager so the history
   re-renders automatically when a workout is saved.
===================================================== */

import { WorkoutEditor } from "./WorkoutEditor.js";
import { ExerciseHistoryView } from "./ExerciseHistoryView.js";

export class GymView {

    constructor(
        editorContainer,
        historyContainer,
        gymManager
    ) {

        this.gymManager = gymManager;


        this.editor = new WorkoutEditor(
            editorContainer,
            gymManager,
            (workout) => {

                this.handleWorkoutSaved(workout);
            }
        );


        this.history =
            new ExerciseHistoryView(
                historyContainer
            );

        this.history.setGymManager(gymManager);


        /*
            The history view refreshes whenever
            the manager's data changes — covers
            edits, deletes, and new workouts.
        */

        this.unsubscribe = gymManager.subscribe(
            () => this.history.refresh()
        );


        this.history.showEmptyState();
    }


    showEditor() {

        this.editor.show();
    }


    hideEditor() {

        this.editor.hide();
    }


    isEditorVisible() {

        return this.editor.isVisible();
    }


    showExerciseHistory(name) {

        this.history.show(name);
    }


    hideExerciseHistory() {

        this.history.hide();

        this.history.showEmptyState();
    }


    refresh() {

        this.history.refresh();
    }


    handleWorkoutSaved() {

        /*
            GymManager has already been notified;
            the subscription above re-renders the
            history view. Nothing else to do here.
        */
    }
}
