import { GYM_WORKOUT_TYPES } from "../data/gymExercises.js";
import GymEntryView from "../components/GymEntryView.js";


export default class DailyLogView {

    constructor(
        container,
        onHighlightChanged,
        onJournalChanged,
        onTaskAdded,
        onTaskToggled,
        onTaskEdited,
        onTaskDeleted,
        onActivityAdd,
        onActivityDelete,
        onActivityEdit
    ) {
        this.container = container;

        this.onHighlightChanged = onHighlightChanged;
        this.onJournalChanged = onJournalChanged;
        this.onTaskAdded = onTaskAdded;
        this.onTaskToggled = onTaskToggled;
        this.onTaskEdited = onTaskEdited;
        this.onTaskDeleted = onTaskDeleted;
        this.onActivityAdd = onActivityAdd;
        this.onActivityDelete = onActivityDelete;
        this.onActivityEdit = onActivityEdit;

        this.selectedDate = null;
    }


    setDate(date) {
        this.selectedDate = date;
    }


    // A task can only be ADDED for today or one day ahead.
    // All previous days remain editable (toggle/edit/delete).
    canAddTask() {

        if (!this.selectedDate) {
            return false;
        }

        const now = new Date();
        const midnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        const todayString =
            this.formatKey(midnight);

        const tomorrow =
            new Date(midnight);

        tomorrow.setDate(
            midnight.getDate() + 1
        );

        const tomorrowString =
            this.formatKey(tomorrow);

        return (
            this.selectedDate === todayString ||
            this.selectedDate === tomorrowString
        );
    }


    formatKey(date) {

        const month =
            String(date.getMonth() + 1).padStart(2, "0");

        const day =
            String(date.getDate()).padStart(2, "0");

        return `${date.getFullYear()}-${month}-${day}`;
    }


    // Replace a task's label with an inline edit form.
    startTaskEdit(
        section,
        taskList,
        index,
        currentDescription
    ) {

        const tasks =
            taskList.querySelectorAll(
                ".task"
            );

        const taskElement =
            tasks[index];

        if (!taskElement) {
            return;
        }

        const label =
            taskElement.querySelector(
                ".task span"
            );

        if (!label) {
            return;
        }

        const form =
            document.createElement("div");

        form.classList.add(
            "inline-task-form"
        );

        const input =
            document.createElement("input");

        input.type = "text";
        input.value = currentDescription;
        input.maxLength = 200;

        const saveButton =
            document.createElement("button");

        saveButton.type = "button";
        saveButton.textContent = "Save";

        const cancelButton =
            document.createElement("button");

        cancelButton.type = "button";
        cancelButton.textContent = "Cancel";

        const submit = () => {

            const trimmed =
                input.value.trim();

            if (trimmed) {
                this.onTaskEdited(index, trimmed);
            }

            form.remove();
        };

        saveButton.addEventListener(
            "click",
            submit
        );

        cancelButton.addEventListener(
            "click",
            () => {
                form.remove();
            }
        );

        input.addEventListener(
            "keydown",
            event => {
                if (event.key === "Enter") {
                    submit();
                }
                if (event.key === "Escape") {
                    form.remove();
                }
            }
        );

        form.appendChild(input);
        form.appendChild(saveButton);
        form.appendChild(cancelButton);

        taskElement.replaceChild(
            form,
            label
        );

        input.focus();
        input.select();
    }


    render(log) {

        this.container.innerHTML = "";

        if (!log) {
            this.renderEmptyState();
            return;
        }

        this.renderDate(log.date);
        this.renderTasks(log);
        this.renderHighlight(log);
        this.renderJournal(log);
        this.renderActivities(log);
    }


    // ========================================================
    // DATE
    // ========================================================

    renderDate(date) {

        const heading =
            document.createElement("h1");

        const dateObject =
            new Date(`${date}T00:00:00`);

        heading.textContent =
            dateObject.toLocaleDateString(
                "default",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

        heading.classList.add("daily-date");

        this.container.appendChild(heading);
    }


    // ========================================================
    // TASKS
    // ========================================================

    renderTasks(log) {

        const section =
            document.createElement("section");

        section.classList.add(
            "daily-section"
        );


        const header =
            document.createElement("div");

        header.classList.add(
            "section-header"
        );


        const title =
            document.createElement("h2");

        title.textContent = "Tasks";


        const addButton =
            document.createElement("button");

        addButton.type = "button";
        addButton.textContent = "+";

        addButton.classList.add(
            "add-task-button"
        );


        const canAdd =
            this.canAddTask();

        if (!canAdd) {
            addButton.classList.add(
                "add-task-button--disabled"
            );
        }


        addButton.addEventListener(
            "click",
            () => {

                if (!this.canAddTask()) {
                    return;
                }

                const existing =
                    section.querySelector(
                        ".inline-task-form"
                    );

                if (existing) {
                    existing.remove();
                    return;
                }

                const form =
                    document.createElement("div");

                form.classList.add(
                    "inline-task-form"
                );

                const input =
                    document.createElement("input");

                input.type = "text";

                input.placeholder =
                    "Enter task...";

                input.maxLength = 200;

                const submitButton =
                    document.createElement("button");

                submitButton.type = "button";

                submitButton.textContent =
                    "Add";

                const submit = () => {

                    const trimmed =
                        input.value.trim();

                    if (!trimmed) {
                        return;
                    }

                    this.onTaskAdded(trimmed);

                    form.remove();
                };

                submitButton.addEventListener(
                    "click",
                    submit
                );

                input.addEventListener(
                    "keydown",
                    event => {
                        if (event.key === "Enter") {
                            submit();
                        }

                        if (event.key === "Escape") {
                            form.remove();
                        }
                    }
                );

                form.appendChild(input);
                form.appendChild(submitButton);

                section.insertBefore(
                    form,
                    taskList
                );

                input.focus();
            }
        );


        header.appendChild(title);
        header.appendChild(addButton);


        const taskList =
            document.createElement("div");

        taskList.classList.add(
            "task-list"
        );


        const tasks =
            Array.isArray(log.tasks)
                ? log.tasks
                : [];


        for (
            let index = 0;
            index < tasks.length;
            index++
        ) {

            const task =
                tasks[index];


            const taskElement =
                document.createElement("div");

            taskElement.classList.add(
                "task"
            );


            const checkbox =
                document.createElement("input");

            checkbox.type =
                "checkbox";

            checkbox.checked =
                task.completed;


            checkbox.addEventListener(
                "change",
                () => {
                    this.onTaskToggled(index);
                }
            );


            const label =
                document.createElement("span");

            label.textContent =
                task.description;


            if (task.completed) {
                label.classList.add(
                    "completed"
                );
            }


            taskElement.appendChild(
                checkbox
            );

            taskElement.appendChild(
                label
            );


            const actions =
                document.createElement("div");

            actions.classList.add(
                "task-actions"
            );


            const editButton =
                document.createElement("button");

            editButton.type = "button";
            editButton.textContent = "Edit";

            editButton.classList.add(
                "task-btn"
            );

            editButton.addEventListener(
                "click",
                () => {
                    this.startTaskEdit(
                        section,
                        taskList,
                        index,
                        task.description
                    );
                }
            );


            const deleteButton =
                document.createElement("button");

            deleteButton.type = "button";
            deleteButton.textContent = "Delete";

            deleteButton.classList.add(
                "task-btn",
                "task-btn--danger"
            );

            deleteButton.addEventListener(
                "click",
                () => {
                    this.onTaskDeleted(index);
                }
            );


            actions.appendChild(editButton);
            actions.appendChild(deleteButton);

            taskElement.appendChild(actions);


            taskList.appendChild(
                taskElement
            );
        }


        section.appendChild(header);
        section.appendChild(taskList);

        this.container.appendChild(section);
    }


    // ========================================================
    // HIGHLIGHT
    // ========================================================

    renderHighlight(log) {

        const section =
            document.createElement("section");

        section.classList.add(
            "daily-section"
        );


        const title =
            document.createElement("h2");

        title.textContent =
            "Highlight";


        const input =
            document.createElement("input");

        input.type = "text";

        input.value =
            log.highlight || "";

        input.maxLength = 120;

        input.placeholder =
            "What was the highlight of today?";


        input.addEventListener(
            "input",
            () => {
                this.onHighlightChanged(
                    input.value
                );
            }
        );


        section.appendChild(title);
        section.appendChild(input);

        this.container.appendChild(section);
    }


    // ========================================================
    // JOURNAL
    // ========================================================

    renderJournal(log) {

        const section =
            document.createElement("section");

        section.classList.add(
            "daily-section"
        );


        const title =
            document.createElement("h2");

        title.textContent =
            "Journal";


        const textarea =
            document.createElement("textarea");

        textarea.value =
            log.journal || "";

        textarea.maxLength = 1000;

        textarea.placeholder =
            "Write about your day...";


        textarea.addEventListener(
            "input",
            () => {
                this.onJournalChanged(
                    textarea.value
                );
            }
        );


        section.appendChild(title);
        section.appendChild(textarea);

        this.container.appendChild(section);
    }


    // ========================================================
    // ACTIVITIES
    // ========================================================

    renderActivities(log) {

        const section =
            document.createElement("section");

        section.classList.add(
            "daily-section",
            "activities-section"
        );


        // ----------------------------------------------------
        // HEADER
        // ----------------------------------------------------

        const header =
            document.createElement("div");

        header.classList.add(
            "section-header",
            "activities-header"
        );


        const title =
            document.createElement("h2");

        title.textContent =
            "Activities";


        const addButton =
            document.createElement("button");

        addButton.type = "button";

        addButton.textContent = "+";

        addButton.classList.add(
            "add-activity-button"
        );


        addButton.addEventListener(
            "click",
            () => {

                this.toggleAddingMode(
                    section
                );
            }
        );


        header.appendChild(title);
        header.appendChild(addButton);


        // ----------------------------------------------------
        // ACTIVITY PICKER
        // ----------------------------------------------------

        const picker =
            document.createElement("div");

        picker.classList.add(
            "activity-picker"
        );

        picker.style.display =
            "none";


        const studyButton =
            this.createActivityChoice(
                "Study"
            );


        const gymButton =
            this.createActivityChoice(
                "Gym"
            );


        const footballButton =
            this.createActivityChoice(
                "Football"
            );


        studyButton.addEventListener(
            "click",
            () => {

                this.showInlineForm(
                    section,
                    "study"
                );
            }
        );


        gymButton.addEventListener(
            "click",
            () => {

                this.showInlineForm(
                    section,
                    "gym"
                );
            }
        );


        footballButton.addEventListener(
            "click",
            () => {

                this.showInlineForm(
                    section,
                    "football"
                );
            }
        );


        picker.appendChild(
            studyButton
        );

        picker.appendChild(
            gymButton
        );

        picker.appendChild(
            footballButton
        );


        // ----------------------------------------------------
        // ACTIVITY LIST
        // ----------------------------------------------------

        const activityList =
            document.createElement("div");

        activityList.classList.add(
            "activity-list"
        );


        const activities =
            Array.isArray(log.activities)
                ? log.activities
                : [];


        if (activities.length === 0) {

            const empty =
                document.createElement("div");

            empty.classList.add(
                "no-activities"
            );

            empty.textContent =
                "No activities logged yet.";

            activityList.appendChild(
                empty
            );
        }


        for (
            let i = 0;
            i < activities.length;
            i++
        ) {

            this.renderActivityItem(
                activityList,
                activities[i],
                i
            );
        }


        section.appendChild(header);
        section.appendChild(picker);
        section.appendChild(activityList);

        this.container.appendChild(section);
    }


    // ========================================================
    // ACTIVITY CHOICE BUTTON
    // ========================================================

    createActivityChoice(type) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.textContent = type;

        button.classList.add(
            "activity-choice"
        );

        return button;
    }


    // ========================================================
    // INLINE FORM
    // ========================================================

    toggleAddingMode(section) {

        const picker =
            section.querySelector(
                ".activity-picker"
            );

        const list =
            section.querySelector(
                ".activity-list"
            );

        const form =
            section.querySelector(
                ".inline-activity-form"
            );


        const isOpen =
            picker.style.display !== "none";


        if (form) {
            form.remove();
        }

        picker.style.display =
            isOpen
                ? "none"
                : "flex";

        if (list) {
            list.style.display =
                isOpen
                    ? "flex"
                    : "none";
        }
    }


    // Open the inline add/edit form for an existing activity.
    startActivityEdit(
        section,
        activity,
        index
    ) {

        if (
            !section ||
            !activity
        ) {
            return;
        }

        this.showInlineForm(
            section,
            activity.type,
            {
                index,
                activity
            }
        );
    }


    showInlineForm(
        section,
        type,
        editContext
    ) {
        const picker =
            section.querySelector(
                ".activity-picker"
            );

        picker.style.display =
            "none";


        const list =
            section.querySelector(
                ".activity-list"
            );

        if (list) {
            list.style.display =
                "none";
        }


        const oldForm =
            section.querySelector(
                ".inline-activity-form"
            );

        if (oldForm) {
            oldForm.remove();
        }


        const form =
            document.createElement("div");

        form.classList.add(
            "inline-activity-form"
        );


        const submitActivity = data => {

            if (editContext) {

                this.onActivityEdit(
                    editContext.index,
                    data
                );

            } else {

                this.onActivityAdd(
                    data
                );
            }
        };


        // ====================================================
        // STUDY
        // ====================================================

        if (type === "study") {
            const subject =
                document.createElement("input");

            subject.type = "text";

            subject.placeholder =
                "What did you study?";

            const duration =
                document.createElement("input");

            duration.type = "number";

            duration.min = "1";

            duration.placeholder =
                "Duration (minutes)";

            const add =
                document.createElement("button");

            add.type = "button";

            add.textContent =
                editContext ? "Save" : "Add";

            if (editContext) {
                subject.value =
                    editContext.activity.subject || "";
                duration.value =
                    editContext.activity.duration || "";
            }

            const submit = () => {
                const subjectValue =
                    subject.value.trim();

                const durationValue =
                    Number(
                        duration.value
                    );

                if (
                    !subjectValue ||
                    !durationValue ||
                    durationValue <= 0
                ) {
                    return;
                }

                submitActivity(
                    {
                        type: "study",
                        subject: subjectValue,
                        duration: durationValue
                    }
                );
            };

            add.addEventListener(
                "click",
                submit
            );

            duration.addEventListener(
                "keydown",
                event => {
                    if (event.key === "Enter") {
                        submit();
                    }
                }
            );

            form.appendChild(subject);
            form.appendChild(duration);
            form.appendChild(add);

            section.appendChild(form);

            subject.focus();

            return;
        }

        // ====================================================
        // FOOTBALL
        // ====================================================

        if (type === "football") {
            const duration =
                document.createElement("input");

            duration.type = "number";

            duration.min = "1";

            duration.placeholder =
                "Duration (minutes)";

            const add =
                document.createElement("button");

            add.type = "button";

            add.textContent =
                editContext ? "Save" : "Add";

            if (editContext) {
                duration.value =
                    editContext.activity.duration || "";
            }

            const submit = () => {
                const durationValue =
                    Number(
                        duration.value
                    );

                if (
                    !durationValue ||
                    durationValue <= 0
                ) {
                    return;
                }

                submitActivity(
                    {
                        type: "football",
                        duration: durationValue
                    }
                );
            };

            add.addEventListener(
                "click",
                submit
            );

            duration.addEventListener(
                "keydown",
                event => {
                    if (event.key === "Enter") {
                        submit();
                    }
                }
            );

            form.appendChild(duration);
            form.appendChild(add);

            section.appendChild(form);

            duration.focus();

            return;
        }

        // ====================================================
        // GYM
        // ====================================================

        if (type === "gym") {
            const stepContainer =
                document.createElement("div");

            stepContainer.classList.add(
                "gym-step"
            );


            const pillContainer =
                document.createElement("div");

            pillContainer.classList.add(
                "gym-pill-container"
            );


            const renderPills = () => {

                pillContainer.innerHTML = "";

                const initialExercises =
                    editContext
                        ? editContext.activity.exercises
                        : null;

                for (
                    const key
                    of Object.keys(
                        GYM_WORKOUT_TYPES
                    )
                ) {

                    const workoutType =
                        GYM_WORKOUT_TYPES[key];

                    const pill =
                        document.createElement("button");

                    pill.type = "button";

                    pill.textContent =
                        workoutType.name;

                    pill.classList.add(
                        "gym-pill"
                    );

                    const submittableData = {
                        type: "gym",
                        name: key,
                        exercises: null
                    };

                    pill.addEventListener(
                        "click",
                        () => {

                            const pills =
                                pillContainer.querySelectorAll(
                                    ".gym-pill"
                                );

                            for (
                                const other
                                of pills
                            ) {
                                other.classList.remove(
                                    "active"
                                );
                            }

                            pill.classList.add(
                                "active"
                            );

                            const oldEntry =
                                stepContainer.querySelector(
                                    ".gym-entry"
                                );

                            if (oldEntry) {
                                oldEntry.remove();
                            }

                            const entryView =
                                new GymEntryView();

                            entryView.onSave = data => {

                                submittableData.exercises =
                                    data.exercises;

                                submitActivity(
                                    submittableData
                                );
                            };

                            stepContainer.appendChild(
                                entryView.render(
                                    workoutType,
                                    initialExercises
                                )
                            );
                        }
                    );

                    pillContainer.appendChild(
                        pill
                    );

                    if (
                        editContext &&
                        key === editContext.activity.name
                    ) {
                        pill.click();
                    }
                }
            };


            renderPills();

            stepContainer.appendChild(
                pillContainer
            );

            form.appendChild(
                stepContainer
            );

            section.appendChild(form);

            return;
        }
    }


    // ========================================================
    // ACTIVITY ITEM
    // ========================================================

    renderActivityItem(
        container,
        activity,
        index
    ) {

        const item =
            document.createElement("div");

        item.classList.add(
            "activity-item"
        );


        const left =
            document.createElement("div");

        left.classList.add(
            "activity-left"
        );


        const name =
            document.createElement("span");

        name.classList.add(
            "activity-name"
        );


        const typeLabel =
            document.createElement("span");

        typeLabel.classList.add(
            "activity-type"
        );


        const meta =
            document.createElement("span");

        meta.classList.add(
            "activity-meta"
        );


        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";

        deleteButton.textContent = "×";

        deleteButton.classList.add(
            "delete-activity-button"
        );

        deleteButton.addEventListener(
            "click",
            () => {
                this.onActivityDelete(index);
            }
        );


        const editButton =
            document.createElement("button");

        editButton.type = "button";

        editButton.textContent = "Edit";

        editButton.classList.add(
            "edit-activity-button"
        );

        editButton.addEventListener(
            "click",
            () => {

                const section =
                    this.container.querySelector(
                        ".activities-section"
                    );

                this.startActivityEdit(
                    section,
                    activity,
                    index
                );
            }
        );


        if (
            activity.type === "study"
        ) {

            typeLabel.textContent =
                "Study";

            name.textContent =
                activity.subject || "Study";

            meta.textContent =
                `${activity.duration} min`;

        }

        else if (
            activity.type === "football"
        ) {

            typeLabel.textContent =
                "Football";

            name.textContent =
                "Football";

            meta.textContent =
                `${activity.duration} min`;

        }

        else if (
            activity.type === "gym"
        ) {

            typeLabel.textContent =
                "Gym";

            name.textContent =
                activity.name || "Gym";

            meta.textContent =
                "Workout";
        }

        else {

            typeLabel.textContent =
                activity.type || "";

            name.textContent =
                activity.type || "Activity";
        }


        left.appendChild(typeLabel);
        left.appendChild(name);

        item.appendChild(left);
        item.appendChild(meta);
        item.appendChild(editButton);
        item.appendChild(deleteButton);

        container.appendChild(item);
    }


    // ========================================================
    // EMPTY
    // ========================================================

    renderEmptyState() {

        const message =
            document.createElement("p");

        message.textContent =
            "No log for this day.";

        this.container.appendChild(message);
    }
}