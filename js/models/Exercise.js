import Set from "./Set.js";

export default class Exercise {
    constructor(name) {
        this.name = name;
        this.sets = [];
    }

    addSet(weight, reps) {
        const set = new Set(weight, reps);

        this.sets.push(set);

        return set;
    }

    removeSet(index) {
        if (index >= 0 && index < this.sets.length) {
            this.sets.splice(index, 1);
        }
    }
}