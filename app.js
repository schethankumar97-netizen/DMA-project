const dropdowns = [];

const colors = ["amber", "teal", "rose", "violet", "sky"];

function handleCreate(event) {
    event.preventDefault();

    const nameInput = document.getElementById("ddName");
    const optionsInput = document.getElementById("initOpts");

    const name = nameInput.value.trim();

    if (!name) {
        showToast("Dropdown label is required", "error");
        return;
    }

    const options = optionsInput.value
        .split("\n")
        .map(opt => opt.trim())
        .filter(opt => opt !== "");

    dropdowns.push({
        id: Date.now(),
        name,
        options,
        color: colors[dropdowns.length % colors.length]
    });

    nameInput.value = "";
    optionsInput.value = "";

    renderDropdowns();
    updateStats();

    showToast("Dropdown created successfully", "success");
}

function renderDropdowns() {
    const container = document.getElementById("ddList");
    const emptyState = document.getElementById("emptyState");

    container.innerHTML = "";

    if (dropdowns.length === 0) {
        emptyState.style.display = "block";
        return;
    }

    emptyState.style.display = "none";

    dropdowns.forEach(dropdown => {
        const card = document.createElement("div");
        card.className = "dd-card";
        card.setAttribute("data-color", dropdown.color);

        card.innerHTML = `
            <div class="dd-card-banner">
                <div class="banner-left">
                    <div class="banner-count">${dropdown.options.length}</div>
                    <div class="banner-name">${dropdown.name}</div>
                </div>

                <button class="btn btn-rose btn-xs" onclick="deleteDropdown(${dropdown.id})">
                    Delete
                </button>
            </div>

            <div class="dd-card-body">

                <div class="preview-banner">
                    <div class="preview-tag">Live Preview</div>

                    <select class="form-select">
                        <option>Select Option</option>

                        ${dropdown.options.map(option => `
                            <option>${option}</option>
                        `).join("")}
                    </select>
                </div>

                <div class="chips-wrap">
                    ${
                        dropdown.options.length > 0
                        ? dropdown.options.map((option, index) => `
                            <div class="chip">
                                ${option}
                                <span class="chip-remove"
                                      onclick="removeOption(${dropdown.id}, ${index})">
                                      ×
                                </span>
                            </div>
                        `).join("")
                        : `<div class="no-options">No options available</div>`
                    }
                </div>

                <div class="add-row">
                    <input
                        type="text"
                        class="form-input"
                        placeholder="Add option"
                        id="add-${dropdown.id}"
                    >

                    <button
                        class="btn btn-accent btn-sm"
                        onclick="addOption(${dropdown.id})"
                    >
                        Add
                    </button>
                </div>

                <div class="bulk-section">
                    <label class="form-label">Bulk Add</label>

                    <div class="bulk-row">
                        <textarea
                            class="form-textarea"
                            placeholder="One option per line"
                            id="bulk-${dropdown.id}"
                        ></textarea>

                        <button
                            class="btn btn-ghost btn-sm"
                            onclick="bulkAdd(${dropdown.id})"
                        >
                            Add
                        </button>
                    </div>
                </div>

            </div>
        `;

        container.appendChild(card);
    });
}

function addOption(id) {
    const dropdown = dropdowns.find(d => d.id === id);

    if (!dropdown) return;

    const input = document.getElementById(`add-${id}`);
    const value = input.value.trim();

    if (!value) {
        showToast("Enter an option", "error");
        return;
    }

    dropdown.options.push(value);

    input.value = "";

    renderDropdowns();
    updateStats();

    showToast("Option added", "success");
}

function removeOption(id, index) {
    const dropdown = dropdowns.find(d => d.id === id);

    if (!dropdown) return;

    dropdown.options.splice(index, 1);

    renderDropdowns();
    updateStats();

    showToast("Option removed", "neutral");
}

function bulkAdd(id) {
    const dropdown = dropdowns.find(d => d.id === id);

    if (!dropdown) return;

    const textarea = document.getElementById(`bulk-${id}`);

    const items = textarea.value
        .split("\n")
        .map(item => item.trim())
        .filter(item => item !== "");

    if (items.length === 0) {
        showToast("No options found", "error");
        return;
    }

    dropdown.options.push(...items);

    textarea.value = "";

    renderDropdowns();
    updateStats();

    showToast(`${items.length} options added`, "success");
}

function bulkAddToAll() {
    const textarea = document.getElementById("bulkGlobal");

    const items = textarea.value
        .split("\n")
        .map(item => item.trim())
        .filter(item => item !== "");

    if (items.length === 0) {
        showToast("No global items found", "error");
        return;
    }

    if (dropdowns.length === 0) {
        showToast("No dropdowns available", "error");
        return;
    }

    dropdowns.forEach(dropdown => {
        dropdown.options.push(...items);
    });

    textarea.value = "";

    renderDropdowns();
    updateStats();

    showToast("Items added to all dropdowns", "success");
}

function deleteDropdown(id) {
    const index = dropdowns.findIndex(d => d.id === id);

    if (index === -1) return;

    dropdowns.splice(index, 1);

    renderDropdowns();
    updateStats();

    showToast("Dropdown deleted", "neutral");
}

function clearAll() {
    if (dropdowns.length === 0) {
        showToast("Nothing to clear", "error");
        return;
    }

    dropdowns.length = 0;

    renderDropdowns();
    updateStats();

    showToast("All dropdowns cleared", "neutral");
}

function updateStats() {
    const statBanner = document.getElementById("statBanner");

    const totalDropdowns = dropdowns.length;

    const totalOptions = dropdowns.reduce((sum, dropdown) => {
        return sum + dropdown.options.length;
    }, 0);

    statBanner.innerHTML = `
        <strong>${totalDropdowns}</strong> dropdowns ·
        <strong>${totalOptions}</strong> total options
    `;
}

function exportAllHTML() {
    if (dropdowns.length === 0) {
        showToast("No dropdowns to export", "error");
        return;
    }

    let html = "";

    dropdowns.forEach(dropdown => {
        html += `
<label>${dropdown.name}</label>

<select>
    <option>Select Option</option>

    ${dropdown.options.map(option => `
    <option>${option}</option>
    `).join("")}

</select>

<br><br>
`;
    });

    document.getElementById("exportCode").textContent = html.trim();

    toggleModal(true);

    showToast("HTML exported", "success");
}

function toggleModal(show) {
    const modal = document.getElementById("exportModal");

    if (show) {
        modal.classList.add("active");
    } else {
        modal.classList.remove("active");
    }
}

function closeModalBg(event) {
    if (event.target.id === "exportModal") {
        toggleModal(false);
    }
}

function copyCode() {
    const code = document.getElementById("exportCode").textContent;

    navigator.clipboard.writeText(code)
        .then(() => {
            showToast("Copied to clipboard", "success");
        })
        .catch(() => {
            showToast("Copy failed", "error");
        });
}

function showToast(message, type = "neutral") {
    const stack = document.getElementById("toastStack");

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <span>${message}</span>
    `;

    stack.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "toastOut 0.3s forwards";

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 2500);
}

renderDropdowns();
updateStats();