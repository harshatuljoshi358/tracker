/* =====================================================
   RECENT LOGS (TODAY view)
   Renders the last 5 entries when "all" is active.
===================================================== */

import { recentLogs } from "./data.js";

export class RecentLogs {

    constructor(container) {

        this.container = container;
    }


    show() {

        this.container.classList.remove(
            "is-hidden"
        );


        this.container.innerHTML = `

            <div class="recent-logs-meta">

                <span class="label">
                    ACTIVITY LOG
                </span>

                <h2>
                    Recent entries
                </h2>

                <span>
                    LAST 5
                </span>

            </div>


            ${recentLogs.map(log => `

                <div class="recent-log">

                    <span class="recent-log-activity">
                        ${log.activity}
                    </span>

                    <span class="recent-log-title">
                        ${log.title}
                    </span>

                    <span class="recent-log-meta">
                        ${log.meta}
                    </span>

                </div>

            `).join("")}

        `;
    }


    hide() {

        this.container.classList.add(
            "is-hidden"
        );
    }
}
