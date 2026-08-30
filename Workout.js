/* =====================================================
   WORKOUT
   One gym session. Holds an ordered collection of
   exercises, each with its own ordered sets.
   Date is a real Date instance so future months and
   years are first-class.
===================================================== */

import { Exercise } from "./Exercise.js";

export class Workout {

    constructor(
        id,
        date,
        workoutType,
        exercises = []
    ) {

        this.id = String(id);

        this.date = date instanceof Date
            ? date
            : new Date(date);

        this.workoutType =
            String(workoutType).trim();

        this.exercises = exercises.map(
            e => e instanceof Exercise
                ? e
                : new Exercise(
                    e.name,
                    e.sets
                )
        );
    }


    addExercise(name) {

        const exercise = new Exercise(name);

        this.exercises.push(exercise);

        return exercise;
    }


    removeExercise(index) {

        if (
            index < 0 ||
            index >= this.exercises.length
        ) {
            return;
        }

        this.exercises.splice(index, 1);
    }


    getExercise(name) {

        const target =
            String(name).trim().toLowerCase();

        return this.exercises.find(
            e => e.name.toLowerCase() === target
        );
    }


    getExerciseNames() {

        return this.exercises.map(
            e => e.name
        );
    }


    /*
        Helpers used by the manager for
        equality / lookup — date is the
        natural identity for a session.
    */

    sameDateAs(otherDate) {

        const a = this.date;
        const b = otherDate instanceof Date
            ? otherDate
            : new Date(otherDate);

        return (
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
        );
    }
}
