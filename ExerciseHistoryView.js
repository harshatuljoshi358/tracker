/* =====================================================
   EXERCISE HISTORY VIEW
   Shows the personal record, the per-workout history
   list, and a simple inline SVG progression chart
   (max weight per workout) for a single exercise.
   Everything is derived from the stored sets.
===================================================== */

export class ExerciseHistoryView {

    constructor(container) {

        this.container = container;
        this.gymManager = null;
        this.exerciseName = null;
    }


    setGymManager(gymManager) {

        this.gymManager = gymManager;
    }


    show(name) {

        this.exerciseName = name;

        this.render();
    }


    hide() {

        this.exerciseName = null;

        this.container.classList.add(
            "is-hidden"
        );

        this.container.innerHTML = "";
    }


    refresh() {

        if (this.exerciseName) {
            this.render();
        }
    }


    render() {

        if (
            !this.gymManager ||
            !this.exerciseName
        ) {

            this.showEmptyState();

            return;
        }


        const history =
            this.gymManager.getExerciseHistory(
                this.exerciseName
            );

        const pr = this.gymManager.getPersonalRecord(
            this.exerciseName
        );


        this.container.classList.remove(
            "is-hidden"
        );


        if (history.length === 0) {

            this.container.innerHTML = `

                <div class="history-meta">
                    <span class="label">EXERCISE</span>
                    <h2>${this.escape(this.exerciseName)}</h2>
                </div>

                <p class="history-empty">
                    First time logging this exercise.
                    Keep going.
                </p>

            `;

            return;
        }


        this.container.innerHTML = `

            <div class="history-meta">
                <span class="label">EXERCISE</span>
                <h2>${this.escape(this.exerciseName)}</h2>
            </div>


            ${pr ? this.renderPR(pr) : ""}


            <div class="history-section">
                <span class="label">PROGRESSION</span>
                ${this.renderChart(history)}
            </div>


            <div class="history-section">
                <span class="label">HISTORY</span>
                ${this.renderHistoryList(history)}
            </div>

        `;
    }


    renderPR(pr) {

        const dateLabel = pr.date
            .toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });

        return `

            <div class="pr-list">

                <div class="pr-item">
                    <span class="label">PERSONAL RECORD</span>
                    <div class="pr-value">
                        <strong>${pr.weight} kg</strong>
                        <span class="set-x">×</span>
                        <strong>${pr.reps}</strong>
                    </div>
                    <span class="pr-date">
                        ${this.escape(dateLabel)}
                        · ${this.escape(pr.workoutType)}
                    </span>
                </div>

            </div>

        `;
    }


    renderChart(history) {

        if (history.length === 0) return "";


        const width = 720;
        const height = 220;
        const padding = {
            top: 20,
            right: 20,
            bottom: 50,
            left: 50
        };

        const innerWidth =
            width - padding.left - padding.right;

        const innerHeight =
            height - padding.top - padding.bottom;


        const maxWeight = Math.max(
            ...history.map(
                r => r.exercise.maxWeight
            )
        );

        const yMax = Math.max(
            Math.ceil(maxWeight * 1.1),
            10
        );


        const barSlot = innerWidth / history.length;
        const barWidth = Math.max(
            barSlot * 0.55,
            6
        );


        let bars = "";
        let xLabels = "";


        history.forEach((record, index) => {

            const max = record.exercise.maxWeight;

            const barHeight =
                (max / yMax) * innerHeight;

            const x =
                padding.left +
                index * barSlot +
                (barSlot - barWidth) / 2;

            const y =
                padding.top +
                (innerHeight - barHeight);


            const dateLabel = record.date
                .toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short"
                });


            bars += `
                <rect
                    class="chart-bar"
                    x="${x}"
                    y="${y}"
                    width="${barWidth}"
                    height="${barHeight}"
                ></rect>
                <text
                    class="chart-bar-value"
                    x="${x + barWidth / 2}"
                    y="${y - 6}"
                    text-anchor="middle"
                >${max}</text>
            `;


            xLabels += `
                <text
                    class="chart-axis-label"
                    x="${x + barWidth / 2}"
                    y="${height - padding.bottom + 18}"
                    text-anchor="middle"
                >${this.escape(dateLabel)}</text>
            `;
        });


        const gridLines = this.renderGridLines(
            padding,
            innerHeight,
            yMax
        );


        return `
            <svg
                class="progression-chart"
                viewBox="0 0 ${width} ${height}"
                preserveAspectRatio="xMidYMid meet"
            >
                ${gridLines}
                ${bars}
                ${xLabels}
            </svg>
        `;
    }


    renderGridLines(padding, innerHeight, yMax) {

        const steps = 4;

        let lines = "";


        for (let i = 0; i <= steps; i++) {

            const value = Math.round(
                (yMax / steps) * i
            );

            const y =
                padding.top +
                innerHeight -
                (value / yMax) * innerHeight;


            lines += `
                <line
                    class="chart-grid"
                    x1="${padding.left}"
                    y1="${y}"
                    x2="${720 - padding.right}"
                    y2="${y}"
                ></line>
                <text
                    class="chart-axis-label"
                    x="${padding.left - 8}"
                    y="${y + 4}"
                    text-anchor="end"
                >${value}</text>
            `;
        }


        return lines;
    }


    renderHistoryList(history) {

        return `
            <div class="history-list">
                ${history.map(record => {

                    const dateLabel = record.date
                        .toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        });

                    const sets = record.exercise.sets
                        .map(
                            s =>
                                `${s.weight}×${s.reps}`
                        )
                        .join(", ");

                    return `
                        <div class="history-row">
                            <span class="history-date">
                                ${this.escape(dateLabel)}
                            </span>
                            <span class="history-type">
                                ${this.escape(record.workoutType)}
                            </span>
                            <span class="history-sets">
                                ${this.escape(sets)}
                            </span>
                        </div>
                    `;
                }).join("")}
            </div>
        `;
    }


    showEmptyState() {

        this.container.classList.remove(
            "is-hidden"
        );

        this.container.innerHTML = `
            <div class="history-meta">
                <span class="label">EXERCISE</span>
                <h2>Select an exercise</h2>
            </div>
            <p class="history-empty">
                Click any exercise in a logged workout
                to see its history and progression.
            </p>
        `;
    }


    escape(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
