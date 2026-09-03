import GymWorkout from "../models/GymWorkout.js";

export default class WorkoutService {
    constructor(logService) {
        this.logService = logService;
    }

    addWorkout(workout) {
        if (!(workout instanceof GymWorkout)) {
            throw new Error("Expected a GymWorkout");
        }

        const log = this.logService.createLog(workout.date);

        log.addActivity(workout);

        this.logService.saveLogs();

        return workout;
    }

    getWorkoutsForDate(date) {
        const log = this.logService.getLog(date);

        if (!log) {
            return [];
        }

        return log.activities.filter(
            activity => activity.type === "gym"
        );
    }

    getAllWorkouts() {
        const workouts = [];

        const logs = this.logService.getAllLogs();

        for (const log of logs) {
            for (const activity of log.activities) {
                if (activity.type === "gym") {
                    workouts.push(activity);
                }
            }
        }

        return workouts;
    }

    getExerciseHistory(exerciseName) {
        const history = [];

        const workouts = this.getAllWorkouts();

        for (const workout of workouts) {
            for (const exercise of workout.exercises) {
                if (exercise.name === exerciseName) {
                    history.push({
                        date: workout.date,
                        workoutName: workout.name,
                        sets: exercise.sets
                    });
                }
            }
        }

        return history;
    }
}