import * as data from './data.js';
import * as dom from './dom.js';
// No 'ui' import needed anymore for switching views

// --- STATE ---
let completedEvents = JSON.parse(localStorage.getItem('completedEvents')) || [];

/**
 * Toggles the completion status of a notebook event and saves to localStorage.
 * @param {string} eventId - The unique ID of the event.
 */
function toggleEventCompletion(eventId) {
    const eventIndex = completedEvents.indexOf(eventId);
    if (eventIndex > -1) {
        completedEvents.splice(eventIndex, 1);
    } else {
        completedEvents.push(eventId);
    }
    localStorage.setItem('completedEvents', JSON.stringify(completedEvents));
    populateBombersNotebook(); // Repopulate to update styles
}

/**
 * Updates the details pane at the bottom of the notebook.
 * @param {string} charId - The ID of the character.
 * @param {string|null} eventId - The ID of the specific event (optional).
 */
function updateNotebookDetails(charId, eventId = null) {
    const char = data.bombersNotebookData.find(c => c.id === charId);
    if (!char) return;

    if (eventId) {
        const event = char.events.find(e => e.id === eventId);
        if (event) {
            dom.detailsCharImg.src = char.img;
            dom.detailsCharName.textContent = `[Day ${event.day} - ${event.time}] ${char.name}`;
            dom.detailsCharDesc.textContent = `${event.description} (Click to mark as ${completedEvents.includes(eventId) ? 'incomplete' : 'complete'})`;
        }
    } else {
        dom.detailsCharImg.src = char.img;
        dom.detailsCharName.textContent = char.name;
        dom.detailsCharDesc.textContent = char.description;
    }
}

/**
 * Renders the entire Bomber's Notebook content.
 * This is now just populating the elements, not controlling view visibility.
 */
export function populateBombersNotebook() {
    if (!dom.notebookCharacters || !dom.notebookTimeline) return;
    
    dom.notebookCharacters.innerHTML = '';
    // Clear previous timeline rows before adding new ones
    dom.notebookTimeline.querySelectorAll('.timeline-row').forEach(row => row.remove());
    
    // Always ensure the day columns exist
    if (dom.notebookTimeline.querySelectorAll('.day-column').length === 0) {
        dom.notebookTimeline.innerHTML = `
            <div class="day-column bg-blue-900/30"></div>
            <div class="day-column bg-red-900/40"></div>
            <div class="day-column bg-purple-900/30"></div>
        `;
    }

    data.bombersNotebookData.forEach((char) => {
        // Create character portrait
        const charItem = document.createElement('div');
        charItem.className = 'character-item';
        charItem.dataset.charId = char.id;
        charItem.innerHTML = `<img src="${char.img}" alt="${char.name}" loading="lazy">`;
        charItem.addEventListener('click', () => {
            updateNotebookDetails(char.id);
            document.querySelectorAll('.character-item').forEach(item => item.classList.remove('active'));
            charItem.classList.add('active');
        });
        dom.notebookCharacters.appendChild(charItem);

        // Create timeline row for this character's events
        const timelineRow = document.createElement('div');
        timelineRow.className = 'timeline-row';

        char.events.forEach(event => {
            const dayIndex = event.day - 1;
            const [hours, minutes] = event.time.split(':').map(Number);
            const totalMinutesInDay = 12 * 60; // Assuming 6am to 6pm schedule
            const eventMinutes = (hours - 6) * 60 + minutes;
            const topPercentage = (eventMinutes / totalMinutesInDay) * 100;

            const eventMarker = document.createElement('div');
            eventMarker.className = 'event-marker';
            if (completedEvents.includes(event.id)) {
                eventMarker.classList.add('completed');
            }
            // Position the event marker within the correct day column
            eventMarker.style.top = `${Math.max(0, Math.min(100, topPercentage))}%`;
            eventMarker.style.left = `${(100 / 3) * dayIndex + (100 / 6)}%`;
            eventMarker.innerHTML = data.eventIcons[event.icon] || data.eventIcons.event;

            eventMarker.addEventListener('click', (e) => {
                e.stopPropagation();
                updateNotebookDetails(char.id, event.id);
                toggleEventCompletion(event.id);
            });
            timelineRow.appendChild(eventMarker);
        });
        dom.notebookTimeline.appendChild(timelineRow);
    });

    const savedCode = localStorage.getItem('bomberCode');
    if (savedCode) {
        dom.bomberCodeInput.value = savedCode;
    }
}

/**
 * Saves the 5-digit code from the input field to localStorage.
 */
export function saveBomberCode() {
    localStorage.setItem('bomberCode', dom.bomberCodeInput.value);
    dom.bomberCodeSavedMessage.style.opacity = '1';
    setTimeout(() => {
        dom.bomberCodeSavedMessage.style.opacity = '0';
    }, 2000);
}
