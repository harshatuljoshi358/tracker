/* =====================================================
   GYM MANAGER
   Owns the collection of workouts. The only place
   that should mutate workout data in the running app.

   All metrics (heaviest, PR, progression) are derived
   from the stored sets on demand — nothing is cached,
   so the data cannot become inconsistent.

   Implements a tiny observer pattern so views can
   re-render after any mutation. The public surface is
   the only contract the rest of the app depends on;
   later the array storage can be swapped for a
   SQLite/FastAPI-backed repository without changing
   the domain.
===================================================== */

import { Workout } from "./Workout.js";

export class GymManager {

    constructor(seedWorkouts = []) {

        this.workouts = [];

        this.listeners = new Set();

        for (const workout of seedWorkouts) {

            this.workouts.push(workout);
        }
    }


    /* =========================================
       Observer
    ========================================== */

    subscribe(fn) {

        this.listeners.add(fn);

        return () => this.listeners.delete(fn);
    }


    notify() {

        for (const fn of this.listeners) {
            fn();
        }
    }


    /* =========================================
       Writes
    ========================================== */

    /*
        Adding a workout for a date that already
        has one replaces the existing entry —
        matches the one-workout-per-date model.
    */

    addWorkout(workout) {

        if (!(workout instanceof Workout)) {
            throw new Error(
                "GymManager.addWorkout expects a Workout instance."
            );
        }

        this.workouts = this.workouts.filter(
            w => !w.sameDateAs(workout.date)
        );

        this.workouts.push(workout);

        this.notify();

        return workout;
    }


    deleteWorkout(id) {

        const before = this.workouts.length;

        this.workouts = this.workouts.filter(
            w => w.id !== String(id)
        );

        if (this.workouts.length !== before) {
            this.notify();
        }
    }


    /* =========================================
       Reads
    ========================================== */

    getWorkoutByDate(date) {

        return this.workouts.find(
            w => w.sameDateAs(date)
        ) ?? null;
    }


    getWorkoutsByExercise(name) {

        const target =
            String(name).trim().toLowerCase();

        return this.workouts.filter(
            w => w.exercises.some(
                e => e.name.toLowerCase() === target
            )
        );
    }


    /*
        Returns the chronological history for a
        single exercise, one record per workout.
    */

    getExerciseHistory(name) {

        const records = [];

        for (const workout of this.workouts) {

            const exercise =
                workout.getExercise(name);

            if (!exercise) continue;

            records.push({
                date: workout.date,
                workoutType: workout.workoutType,
                workoutId: workout.id,
                exercise
            });
        }


        records.sort(
            (a, b) => a.date - b.date
        );

        return records;
    }


    getHeaviestWeight(name) {

        let heaviest = 0;

        for (const workout of this.workouts) {

            const exercise =
                workout.getExercise(name);

            if (!exercise) continue;

            if (
                exercise.maxWeight > heaviest
            ) {
                heaviest = exercise.maxWeight;
            }
        }

        return heaviest;
    }


    /*
        Personal record: the single set with
        the highest weight. Ties broken by more
        reps, then earliest date.
    */

    getPersonalRecord(name) {

        let best = null;

        for (const workout of this.workouts) {

            const exercise =
                workout.getExercise(name);

            if (!exercise) continue;

            for (const set of exercise.sets) {

                if (
                    best === null ||
                    set.weight > best.weight ||
                    (
                        set.weight === best.weight &&
                        set.reps > best.reps
                    )
                ) {
                    best = {
                        weight: set.weight,
                        reps: set.reps,
                        date: workout.date,
                        workoutType: workout.workoutType
                    };
                }
            }
        }

        return best;
    }


    /*
        Calendar-friendly: the set of day numbers
        (1..31) within the requested month that
        contain a workout.
    */

    getLoggedDates(year, month) {

        const days = new Set();

        for (const workout of this.workouts) {

            if (
                workout.date.getFullYear() === year &&
                workout.date.getMonth() === month
            ) {
                days.add(workout.date.getDate());
            }
        }

        return days;
    }


    getAllExerciseNames() {

        const seen = new Set();

        const names = [];

        for (const workout of this.workouts) {
            for (const exercise of workout.exercises) {

                if (!seen.has(exercise.name)) {
                    seen.add(exercise.name);
                    names.push(exercise.name);
                }
            }
        }

        return names;
    }


    getWorkoutCount() {

        return this.workouts.length;
    }
}
