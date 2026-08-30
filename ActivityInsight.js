/* =====================================================
   ACTIVITY INSIGHT — chart + breakdown
   Renders the weekly bars and category breakdown
   for the currently-selected activity.
===================================================== */

import { activities, chartData } from "./data.js";

export class ActivityInsight {

    constructor(container) {

        this.container = container;
    }


    show(activity) {

        const data = chartData[activity];

        const meta =
            activities[activity]?.name
                ?? activity;


        if (!data) {

            this.container.classList.add(
                "is-hidden"
            );

            return;
        }


        this.container.classList.remove(
            "is-hidden"
        );

        this.container.innerHTML = `

            <div class="insight-meta">

                <span class="label">
                    INSIGHT
                </span>

                <h2>
                    ${meta}
                </h2>

                <span class="insight-period">
                    AUGUST 2026
                </span>

            </div>


            <div class="weekly-chart">
                ${this.renderBars(data)}
            </div>


            <div class="breakdown">
                ${this.renderBreakdown(data)}
            </div>

        `;


        // Animate bars after a tick so
        // transitions fire on first paint.

        requestAnimationFrame(() => {

            this.container
                .querySelectorAll(".bar")
                .forEach(bar => {

                    bar.style.height =
                        bar.dataset.height;
                });
        });
    }


    renderBars(data) {

        const max = Math.max(
            ...data.weeks.map(w => w.value)
        );


        return data.weeks.map(week => `

            <div class="bar-column">

                <div
                    class="bar"
                    data-value="${this.formatValue(
                        week.value,
                        data.unit
                    )}"
                    data-height="${
                        (week.value / max) * 100
                    }%"
                    style="height: 0;"
                ></div>

                <span class="bar-label">
                    ${week.label}
                </span>

            </div>

        `).join("");
    }


    renderBreakdown(data) {

        const max = Math.max(
            ...data.breakdown.map(b => b.value)
        );


        return data.breakdown.map(item => `

            <div class="breakdown-row">

                <span class="breakdown-label">
                    ${item.label}
                </span>

                <div class="breakdown-track">

                    <div
                        class="breakdown-fill"
                        style="width: ${
                            (item.value / max) * 100
                        }%"
                    ></div>

                </div>

                <span class="breakdown-value">
                    ${this.formatValue(
                        item.value,
                        data.unit
                    )}
                </span>

            </div>

        `).join("");
    }


    formatValue(value, unit) {

        if (unit === "h") {

            return `${value}h`;
        }


        if (unit === "kg") {

            return value.toLocaleString();
        }


        return `${value}${unit}`;
    }


    hide() {

        this.container.classList.add(
            "is-hidden"
        );
    }
}
