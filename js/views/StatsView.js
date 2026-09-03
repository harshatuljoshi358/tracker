export default class StatsView {

    constructor(container, statsService) {
        this.container = container;
        this.statsService = statsService;

        this.charts = [];
        this.progressionChart = null;
    }


    // ========================================================
    // RENDER (driven by the active calendar filter)
    // ========================================================

    render(filterKey) {

        this.activeFilter = filterKey || "all";

        this.destroyCharts();

        this.container.innerHTML = "";

        if (
            typeof window.Chart === "undefined"
        ) {
            this.renderUnavailable();
            return;
        }

        switch (this.activeFilter) {

            case "study":
                this.renderStudyChart();
                break;

            case "gym":
                this.renderProgressionChart();
                break;

            case "football":
                this.renderFootballChart();
                break;

            case "all":
            default:
                this.renderAllCharts();
                break;
        }
    }


    renderAllCharts() {

        this.container.classList.add(
            "multi"
        );

        this.renderStudyChart();
        this.renderProgressionChart();
        this.renderFootballChart();
    }


    destroyCharts() {

        this.container.classList.remove(
            "multi"
        );

        if (this.progressionChart) {
            this.progressionChart.destroy();
            this.progressionChart = null;
        }

        for (const chart of this.charts) {

            if (chart && chart.destroy) {
                chart.destroy();
            }
        }

        this.charts = [];
    }


    // ========================================================
    // UNAVAILABLE
    // ========================================================

    renderUnavailable() {

        const note =
            document.createElement("p");

        note.className =
            "stats-note";

        note.textContent =
            "Charts are unavailable (Chart.js failed to load).";

        this.container.appendChild(note);
    }


    // ========================================================
    // CARD WRAPPER
    // ========================================================

    createCard(title) {

        const card =
            document.createElement("div");

        card.classList.add(
            "stats-card"
        );

        const heading =
            document.createElement("h3");

        heading.textContent = title;

        card.appendChild(heading);

        const body =
            document.createElement("div");

        body.classList.add(
            "stats-card-body"
        );

        card.appendChild(body);

        this.container.appendChild(card);

        return body;
    }


    // ========================================================
    // WEEKLY HELPERS
    // ========================================================

    lastSevenDates() {

        const dates = [];

        for (let i = 6; i >= 0; i--) {

            const d = new Date();

            d.setDate(
                d.getDate() - i
            );

            dates.push(
                this.formatDate(d)
            );
        }

        return dates;
    }


    formatDate(date) {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    shortLabel(dateStr) {

        const d =
            new Date(`${dateStr}T00:00:00`);

        return d.toLocaleDateString(
            "default",
            { weekday: "short" }
        );
    }


    baseOptions() {

        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "#171717",
                        font: { size: 11 },
                        boxWidth: 12,
                        boxHeight: 12
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "#ececec"
                    },
                    ticks: {
                        color: "#777",
                        font: { size: 11 }
                    }
                },
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: "#555",
                        font: { size: 12 }
                    }
                }
            }
        };
    }


    // ========================================================
    // STUDY — WEEKLY STACKED BAR BY SUBJECT
    // ========================================================

    renderStudyChart() {

        const body =
            this.createCard(
                "Study — This Week"
            );

        const canvas =
            document.createElement("canvas");

        canvas.className =
            "chart-canvas";

        body.appendChild(canvas);

        const dates =
            this.lastSevenDates();

        const dataMap =
            this.statsService.getStudyBySubjectByDate();

        const subjects =
            this.collectSubjects(dataMap);

        if (subjects.length === 0) {

            this.renderEmpty(
                body,
                "No study logged this week."
            );
            return;
        }

        const palette =
            this.subjectPalette(subjects.length);

        const datasets =
            subjects.map(
                (subject, index) => ({

                    label: subject,
                    data: dates.map(
                        d => {
                            const dayData =
                                dataMap[d] || {};
                            return dayData[subject] || 0;
                        }
                    ),
                    backgroundColor: palette[index],
                    borderRadius: 3,
                    maxBarThickness: 34
                })
            );

        this.charts.push(
            new Chart(
                canvas,
                {
                    type: "bar",
                    data: {
                        labels: dates.map(
                            d => this.shortLabel(d)
                        ),
                        datasets
                    },
                    options: {
                        ...this.baseOptions(),
                        scales: {
                            ...this.baseOptions().scales,
                            x: {
                                ...this.baseOptions().scales.x,
                                stacked: true
                            },
                            y: {
                                ...this.baseOptions().scales.y,
                                stacked: true
                            }
                        }
                    }
                }
            )
        );
    }


    collectSubjects(dataMap) {

        const set = new Set();

        for (const dateKey in dataMap) {

            const dayData =
                dataMap[dateKey];

            for (const subject in dayData) {
                set.add(subject);
            }
        }

        return Array.from(set);
    }


    subjectPalette(count) {

        const palette = [
            "#171717",
            "#8a8a8a",
            "#c7a252",
            "#6b7f8e",
            "#a2674f",
            "#5f7f5f",
            "#7a6b8e",
            "#b06a6a"
        ];

        return palette.slice(0, count);
    }


    // ========================================================
    // FOOTBALL — WEEKLY BAR CHART
    // ========================================================

    renderFootballChart() {

        const body =
            this.createCard(
                "Football — This Week"
            );

        const canvas =
            document.createElement("canvas");

        canvas.className =
            "chart-canvas";

        body.appendChild(canvas);

        const dates =
            this.lastSevenDates();

        const dataMap =
            this.statsService.getFootballByDate();

        const values =
            dates.map(
                d => dataMap[d] || 0
            );

        if (values.every(v => v === 0)) {

            this.renderEmpty(
                body,
                "No football logged this week."
            );
            return;
        }

        const options =
            this.baseOptions();

        options.plugins.legend.display = false;
        options.scales.x.stacked = false;

        this.charts.push(
            new Chart(
                canvas,
                {
                    type: "bar",
                    data: {
                        labels: dates.map(
                            d => this.shortLabel(d)
                        ),
                        datasets: [{
                            label: "Minutes",
                            data: values,
                            backgroundColor: "#666",
                            borderRadius: 3,
                            maxBarThickness: 34
                        }]
                    },
                    options
                }
            )
        );
    }


    renderEmpty(body, message) {

        const note =
            document.createElement("p");

        note.className =
            "stats-note";

        note.textContent = message;

        body.appendChild(note);
    }


    // ========================================================
    // GYM — EXERCISE PROGRESSION
    // ========================================================

    renderProgressionChart() {

        const card =
            document.createElement("div");

        card.classList.add(
            "stats-card"
        );


        const heading =
            document.createElement("h3");

        heading.textContent =
            "Gym — Exercise Progression";

        card.appendChild(heading);


        // ------------------------------------------------
        // CONTROLS
        // ------------------------------------------------

        const controls =
            document.createElement("div");

        controls.classList.add(
            "progression-controls"
        );


        const splitSelect =
            document.createElement("select");

        const splitLabel =
            document.createElement("label");

        splitLabel.classList.add(
            "chart-control"
        );

        splitLabel.textContent =
            "Split";

        splitLabel.appendChild(
            splitSelect
        );


        const exerciseSelect =
            document.createElement("select");

        const exerciseLabel =
            document.createElement("label");

        exerciseLabel.classList.add(
            "chart-control"
        );

        exerciseLabel.textContent =
            "Exercise";

        exerciseLabel.appendChild(
            exerciseSelect
        );


        controls.appendChild(splitLabel);
        controls.appendChild(exerciseLabel);

        card.appendChild(controls);


        const body =
            document.createElement("div");

        body.classList.add(
            "stats-card-body"
        );

        card.appendChild(body);


        let canvas =
            document.createElement("canvas");

        canvas.className =
            "chart-canvas";

        body.appendChild(canvas);


        // ------------------------------------------------
        // POPULATE
        // ------------------------------------------------

        const splits =
            this.statsService.getSplits();

        for (const split of splits) {

            const option =
                document.createElement("option");

            option.value = split;
            option.textContent = split;

            splitSelect.appendChild(option);
        }


        const populateExercises = () => {

            exerciseSelect.innerHTML = "";

            const exercises =
                this.statsService.getExercisesForSplit(
                    splitSelect.value
                );

            for (const name of exercises) {

                const option =
                    document.createElement("option");

                option.value = name;
                option.textContent = name;

                exerciseSelect.appendChild(option);
            }
        };


        const drawChart = () => {

            if (this.progressionChart) {
                this.progressionChart.destroy();
                this.progressionChart = null;
            }

            const fresh =
                document.createElement("canvas");

            fresh.className = "chart-canvas";

            canvas.replaceWith(fresh);

            canvas = fresh;

            const split = splitSelect.value;
            const exercise = exerciseSelect.value;

            if (!split || !exercise) {
                return;
            }

            const entries =
                this.statsService.getExerciseProgression(
                    split,
                    exercise
                );

            const labels =
                entries.map(
                    e => this.shortLabel(e.date)
                );

            const weights =
                entries.map(
                    e => this.bestWeight(e.sets)
                );

            const options =
                this.baseOptions();

            options.plugins.legend.display = false;
            options.scales.x.stacked = false;

            this.progressionChart =
                new Chart(
                    canvas,
                    {
                        type: "line",
                        data: {
                            labels,
                            datasets: [{
                                label: "Best weight (kg)",
                                data: weights,
                                borderColor: "#171717",
                                backgroundColor: "#171717",
                                pointBackgroundColor: "#171717",
                                pointRadius: 3,
                                borderWidth: 2,
                                tension: 0.25
                            }]
                        },
                        options
                    }
                );
        };


        splitSelect.addEventListener(
            "change",
            () => {
                populateExercises();
                drawChart();
            }
        );

        exerciseSelect.addEventListener(
            "change",
            drawChart
        );


        if (splits.length > 0) {

            populateExercises();
            drawChart();

        } else {

            this.renderEmpty(
                body,
                "No gym workouts logged yet."
            );
        }


        this.container.appendChild(card);
    }


    bestWeight(sets) {

        let best = 0;

        for (const set of sets) {

            const weight =
                Number(set.weight) || 0;

            if (weight > best) {
                best = weight;
            }
        }

        return best;
    }
}
