/* =====================================================
   EXERCISE
   An ordered list of sets performed for a single
   exercise (e.g. "Bench Press"). Owns the rules for
   adding, removing, and editing its sets.
===================================================== */

import { Set } from "./Set.js";

export class Exercise {

    constructor(name, sets = []) {

        this.name = String(name).trim();

        this.sets = sets.map(
            s => s instanceof Set
                ? s
                : new Set(s.weight, s.reps)
        );
    }


    addSet(weight, reps) {

        const set = new Set(weight, reps);

        this.sets.push(set);

        return set;
    }


    removeSet(index) {

        if (
            index < 0 ||
            index >= this.sets.length
        ) {
            return;
        }

        this.sets.splice(index, 1);
    }


    updateSet(index, weight, reps) {

        if (
            index < 0 ||
            index >= this.sets.length
        ) {
            return;
        }

        this.sets[index] = new Set(weight, reps);
    }


    /*
        Derived metrics — never stored so the
        data cannot become inconsistent.
    */

    get maxWeight() {

        if (this.sets.length === 0) {
            return 0;
        }

        return Math.max(
            ...this.sets.map(s => s.weight)
        );
    }


    get totalVolume() {

        return this.sets.reduce(
            (sum, s) => sum + s.volume,
            0
        );
    }


    bestAtReps(reps) {

        const matching = this.sets.filter(
            s => s.reps === reps
        );

        if (matching.length === 0) {
            return 0;
        }

        return Math.max(
            ...matching.map(s => s.weight)
        );
    }


    hasSets() {

        return this.sets.length > 0;
    }
}
