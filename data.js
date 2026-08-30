/* =====================================================
   MOCK DATA + SEED
   Static data for football / study. Gym is no longer
   a static mock — its data is owned by GymManager and
   built from the seed workouts below.
===================================================== */

import { Workout } from "./Workout.js";

export const activities = {

    football: {
        name: "Football",

        dates: [3, 8, 11, 16, 19, 22, 25],

        entries: {
            25: {
                title: "Football / Match",
                duration: "01:30",
                details: [
                    "Position · Right Back",
                    "Goals · 0",
                    "Assists · 1"
                ]
            },

            22: {
                title: "Football / Training",
                duration: "01:15",
                details: [
                    "Passing drills",
                    "Defensive positioning",
                    "Small-sided game"
                ]
            }
        },

        stats: {
            "Sessions": "7",
            "Time Played": "9h 20m",
            "Average Rating": "7.1"
        }
    },


    study: {
        name: "Study",

        dates: [
            1, 3, 5, 8, 10, 12,
            15, 17, 18, 20, 21, 23, 25
        ],

        entries: {
            25: {
                title: "Study / GraphRAG",
                duration: "02:10",
                details: [
                    "Subject · Backend",
                    "Topic · GraphRAG",
                    "Focus · Knowledge graphs"
                ]
            },

            23: {
                title: "Study / FastAPI",
                duration: "01:40",
                details: [
                    "Subject · Backend",
                    "Topic · REST APIs",
                    "Focus · Routing"
                ]
            }
        },

        stats: {
            "Total Time": "23h 20m",
            "Backend": "9h",
            "Machine Learning": "6h"
        }
    }
};


export const dailyData = {

    25: {
        highlight: "New bench press PR.",

        journal:
            "Gym felt strong today. " +
            "Made good progress with GraphRAG. " +
            "Football wasn't great. " +
            "Need to work on positioning."
    },

    24: {
        highlight: "Completed a full pull workout.",

        journal:
            "Good session today. " +
            "Deadlift felt better than expected. " +
            "Spent some time reviewing backend concepts."
    },

    23: {
        highlight: "Finished another section of the project.",

        journal:
            "Mostly a study day. " +
            "Worked through FastAPI routing and dependencies."
    }
};


export const chartData = {

    football: {
        title: "Weekly Time Played",
        unit: "h",
        weeks: [
            { label: "W1", value: 1.5 },
            { label: "W2", value: 2.0 },
            { label: "W3", value: 1.5 },
            { label: "W4", value: 2.5 },
            { label: "W5", value: 1.0 },
            { label: "W6", value: 1.5 }
        ],
        breakdown: [
            { label: "Matches",   value: 4.5 },
            { label: "Training",  value: 3.5 },
            { label: "Drills",    value: 1.5 }
        ]
    },

    study: {
        title: "Weekly Hours",
        unit: "h",
        weeks: [
            { label: "W1", value: 3.5 },
            { label: "W2", value: 4.0 },
            { label: "W3", value: 5.5 },
            { label: "W4", value: 4.5 },
            { label: "W5", value: 6.5 },
            { label: "W6", value: 5.0 }
        ],
        breakdown: [
            { label: "Backend",     value: 9.0 },
            { label: "ML",          value: 6.0 },
            { label: "Math",        value: 4.5 },
            { label: "Systems",     value: 3.5 }
        ]
    }
};


export const recentLogs = [
    { activity: "Gym",      title: "Gym / Push",     meta: "25 AUG" },
    { activity: "Study",    title: "Study / GraphRAG", meta: "25 AUG · 02h 10m" },
    { activity: "Football", title: "Football / Match", meta: "25 AUG · 01h 30m" },
    { activity: "Gym",      title: "Gym / Pull",     meta: "24 AUG" },
    { activity: "Study",    title: "Study / FastAPI",  meta: "23 AUG · 01h 40m" }
];


/* =====================================================
   GYM SEED

   Builds the initial GymManager data using real
   domain classes so the same code path that logs a
   new workout is the one that loads the seed.
===================================================== */

function makeId(date, type) {

    return `seed-${date}-${type}`;
}


export function buildSeedWorkouts() {

    const push18 = new Workout(
        makeId("2026-08-18", "push"),
        new Date(2026, 7, 18),
        "Push"
    );

    push18.addExercise("Bench Press")
        .addSet(55, 10);
    push18.exercises[0].addSet(65, 8);
    push18.exercises[0].addSet(70, 6);

    push18.addExercise("Incline DB Press")
        .addSet(22, 10);
    push18.exercises[1].addSet(24, 8);

    push18.addExercise("Shoulder Press")
        .addSet(16, 10);
    push18.exercises[2].addSet(18, 8);


    const legs22 = new Workout(
        makeId("2026-08-22", "legs"),
        new Date(2026, 7, 22),
        "Legs"
    );

    legs22.addExercise("Squat")
        .addSet(80, 8);
    legs22.exercises[0].addSet(85, 6);
    legs22.exercises[0].addSet(90, 6);

    legs22.addExercise("Leg Press")
        .addSet(150, 10);
    legs22.exercises[1].addSet(160, 10);

    legs22.addExercise("Leg Curl")
        .addSet(40, 10);
    legs22.exercises[2].addSet(45, 10);


    const push25 = new Workout(
        makeId("2026-08-25", "push"),
        new Date(2026, 7, 25),
        "Push"
    );

    push25.addExercise("Bench Press")
        .addSet(60, 10);
    push25.exercises[0].addSet(70, 8);
    push25.exercises[0].addSet(75, 6);

    push25.addExercise("Incline DB Press")
        .addSet(22, 10);
    push25.exercises[1].addSet(24, 8);

    push25.addExercise("Shoulder Press")
        .addSet(18, 10);


    return [push18, legs22, push25];
}
