export default class JournalSearchView {

    constructor(
        container,
        logs,
        onDateSelected,
        onClose
    ) {
        this.container = container;
        this.logs = logs;
        this.onDateSelected = onDateSelected;
        this.onClose = onClose || (() => {});

        this.isOpen = false;
        this.panel = null;
    }


    toggle(logs) {

        this.logs = logs;

        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }


    open() {

        this.isOpen = true;

        this.container.innerHTML = "";

        this.panel =
            document.createElement("div");

        this.panel.classList.add(
            "journal-search-panel"
        );


        // HEADER

        const header =
            document.createElement("div");

        header.classList.add(
            "journal-search-header"
        );

        const title =
            document.createElement("h2");

        title.textContent =
            "Search Journal";

        const closeBtn =
            document.createElement("button");

        closeBtn.type = "button";
        closeBtn.textContent = "\u00d7";

        closeBtn.classList.add(
            "journal-search-close"
        );

        closeBtn.addEventListener(
            "click",
            () => {
                this.close();
            }
        );

        header.appendChild(title);
        header.appendChild(closeBtn);


        // INPUT

        const inputWrapper =
            document.createElement("div");

        inputWrapper.classList.add(
            "journal-search-input-wrapper"
        );

        const input =
            document.createElement("input");

        input.type = "text";

        input.placeholder =
            "Search by keyword...";

        input.classList.add(
            "journal-search-input"
        );

        input.addEventListener(
            "input",
            () => {
                this.renderResults(
                    input.value
                );
            }
        );

        input.addEventListener(
            "keydown",
            (e) => {
                if (e.key === "Escape") {
                    this.close();
                }
            }
        );

        inputWrapper.appendChild(input);


        // RESULTS

        const results =
            document.createElement("div");

        results.classList.add(
            "journal-search-results"
        );

        const emptyMsg =
            document.createElement("div");

        emptyMsg.classList.add(
            "journal-search-empty"
        );

        emptyMsg.textContent =
            "Start typing to search your journal entries...";

        results.appendChild(emptyMsg);


        this.panel.appendChild(header);
        this.panel.appendChild(inputWrapper);
        this.panel.appendChild(results);

        this.container.appendChild(
            this.panel
        );

        input.focus();
    }


    close() {

        this.isOpen = false;
        this.container.innerHTML = "";

        this.onClose();
    }


    renderResults(query) {

        const results =
            this.panel.querySelector(
                ".journal-search-results"
            );

        results.innerHTML = "";

        const trimmed =
            query.trim().toLowerCase();

        if (!trimmed) {

            const emptyMsg =
                document.createElement("div");

            emptyMsg.classList.add(
                "journal-search-empty"
            );

            emptyMsg.textContent =
                "Start typing to search your journal entries...";

            results.appendChild(
                emptyMsg
            );

            return;
        }


        const matches = [];

        for (
            const log
            of this.logs
        ) {

            const journal =
                (log.journal || "").toLowerCase();

            const highlight =
                (log.highlight || "").toLowerCase();

            if (
                journal.includes(trimmed) ||
                highlight.includes(trimmed)
            ) {
                matches.push(log);
            }
        }


        if (matches.length === 0) {

            const noMatch =
                document.createElement("div");

            noMatch.classList.add(
                "journal-search-empty"
            );

            noMatch.textContent =
                "No journal entries found.";

            results.appendChild(
                noMatch
            );

            return;
        }


        matches.sort(
            (a, b) =>
                b.date.localeCompare(a.date)
        );

        for (
            const log
            of matches
        ) {

            const item =
                document.createElement("div");

            item.classList.add(
                "journal-search-item"
            );


            const dateEl =
                document.createElement("div");

            dateEl.classList.add(
                "journal-search-date"
            );

            const dateObj =
                new Date(
                    `${log.date}T00:00:00`
                );

            dateEl.textContent =
                dateObj.toLocaleDateString(
                    "default",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                );


            const snippetEl =
                document.createElement("div");

            snippetEl.classList.add(
                "journal-search-snippet"
            );

            const source =
                log.highlight &&
                log.highlight
                    .toLowerCase()
                    .includes(trimmed)
                    ? log.highlight
                    : log.journal;

            snippetEl.textContent =
                this.getSnippet(
                    source,
                    trimmed
                );


            item.appendChild(dateEl);
            item.appendChild(snippetEl);

            item.addEventListener(
                "click",
                () => {

                    this.isOpen = false;

                    this.onDateSelected(
                        log.date
                    );
                }
            );

            results.appendChild(item);
        }
    }


    getSnippet(
        text,
        query
    ) {

        if (!text) {
            return "";
        }

        const lower =
            text.toLowerCase();

        const index =
            lower.indexOf(query);

        if (index === -1) {
            return text.substring(0, 120) +
                (text.length > 120 ? "..." : "");
        }

        const start =
            Math.max(0, index - 40);

        const end =
            Math.min(
                text.length,
                index + query.length + 60
            );

        let snippet =
            text.substring(start, end);

        if (start > 0) {
            snippet = "..." + snippet;
        }

        if (end < text.length) {
            snippet = snippet + "...";
        }

        return snippet;
    }
}
