export default class StudyActivityView {

    constructor(container, onSave) {
        this.container = container;
        this.onSave = onSave;
    }


    render() {

        this.container.innerHTML = "";


        const section =
            document.createElement("section");

        section.classList.add("activity-form");


        // ----------------------------------------------------
        // Title
        // ----------------------------------------------------

        const title =
            document.createElement("h2");

        title.textContent = "Study";


        // ----------------------------------------------------
        // Subject
        // ----------------------------------------------------

        const subjectInput =
            document.createElement("input");

        subjectInput.type = "text";
        subjectInput.placeholder =
            "What did you study?";

        subjectInput.maxLength = 100;


        // ----------------------------------------------------
        // Duration
        // ----------------------------------------------------

        const durationInput =
            document.createElement("input");

        durationInput.type = "number";
        durationInput.placeholder =
            "Duration (minutes)";

        durationInput.min = "1";


        // ----------------------------------------------------
        // Add button
        // ----------------------------------------------------

        const addButton =
            document.createElement("button");

        addButton.type = "button";
        addButton.textContent = "Add";


        addButton.addEventListener(
            "click",
            () => {

                const subject =
                    subjectInput.value.trim();

                const duration =
                    Number(durationInput.value);


                if (!subject) {
                    subjectInput.focus();
                    return;
                }


                if (
                    !duration ||
                    duration <= 0
                ) {
                    durationInput.focus();
                    return;
                }


                this.onSave(
                    subject,
                    duration
                );


                // Clear form
                subjectInput.value = "";
                durationInput.value = "";

                subjectInput.focus();
            }
        );


        // ----------------------------------------------------
        // Enter key
        // ----------------------------------------------------

        durationInput.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    addButton.click();
                }
            }
        );


        // ----------------------------------------------------
        // Build
        // ----------------------------------------------------

        section.appendChild(title);

        section.appendChild(
            subjectInput
        );

        section.appendChild(
            durationInput
        );

        section.appendChild(
            addButton
        );


        this.container.appendChild(
            section
        );
    }
}