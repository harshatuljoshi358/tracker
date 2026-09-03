import Activity from "./Activity.js";
import Exercise from "./Exercise.js";

export default class GymWorkout extends Activity {
    constructor(date, name) {
        super(date, "gym");

        this.name = name;
        this.exercises = [];
    }

    addExercise(name) {
        const exercise = new Exercise(name);

        this.exercises.push(exercise);

        return exercise;
    }

    removeExercise(index) {
        if (
            index >= 0 &&
            index < this.exercises.length
        ) {
            this.exercises.splice(index, 1);
        }
    }
}