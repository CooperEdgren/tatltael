import { notebookData, characterScheduleData } from './data-notebook.js';
import * as dom from './dom.js';
import { items } from './data-items.js'; // Import items data
import { songs } from './data.js';
import { showItemDetailView } from './items-view.js'; // Import item detail view function
import { showSongDetails } from './song-view.js';
import * as ui from './ui.js';

let questData = {};
let activeQuestId = null;
let activeTab = 'scheduled'; // 'scheduled', 'completed', or 'characters'
let activeCharacter = null;

/**
 * Loads quest progress and Bomber's Code from local storage.
 */
function loadProgress() {
    const savedProgress = localStorage.getItem('bombersNotebookProgress_v3');
    if (savedProgress) {
        questData = JSON.parse(savedProgress);
    } else {
        questData = JSON.parse(JSON.stringify(notebookData)); // Deep copy
    }
    // Ensure all quests have a completed property
    for (const category in questData) {
        if (category.quests) {
            category.quests.forEach(quest => {
                if (quest.completed === undefined) {
                    quest.completed = quest.steps.every(s => s.completed);
                }
            });
        }
        if (category.subCategories) {
            for (const subCategoryKey in category.subCategories) {
                const subCategory = category.subCategories[subCategoryKey];
                subCategory.quests.forEach(quest => {
                    if (quest.completed === undefined) {
                        quest.completed = quest.steps.every(s => s.completed);
                    }
                });
            }
        }
    }

    const savedCode = localStorage.getItem('bomberCode');
    if (savedCode) {
        dom.bomberCodeInput.value = savedCode;
    }
}

/**
 * Saves quest progress and Bomber's Code to local storage.
 */
function saveProgress() {
    localStorage.setItem('bombersNotebookProgress_v3', JSON.stringify(questData));
    localStorage.setItem('bomberCode', dom.bomberCodeInput.value);
}

/**
 * Renders the list of quests based on the active tab.
 */
function renderQuestList() {
    const container = dom.questListContainer;
    if (!container) return;
    container.innerHTML = '';

    for (const categoryKey in questData) {
        const category = questData[categoryKey];
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'quest-category-title';
        categoryTitle.textContent = category.title;
        container.appendChild(categoryTitle);

        if (category.subCategories) {
            for (const subCategoryKey in category.subCategories) {
                const subCategory = category.subCategories[subCategoryKey];
                const subCategoryTitle = document.createElement('h4');
                subCategoryTitle.className = 'quest-subcategory-title';
                subCategoryTitle.innerHTML = `<span class="toggle-arrow">▶</span> ${subCategoryKey}`;
                container.appendChild(subCategoryTitle);

                const questList = document.createElement('div');
                questList.className = 'quest-list-collapsible';
                renderQuestItems(subCategory.quests, questList);
                container.appendChild(questList);

                subCategoryTitle.addEventListener('click', () => {
                    questList.classList.toggle('open');
                    subCategoryTitle.querySelector('.toggle-arrow').classList.toggle('rotate-90');
                });
            }
        }

        if (category.quests) {
            renderQuestItems(category.quests, container);
        }
    }
}

function renderQuestItems(quests, container) {
    const questsToShow = quests.filter(q => 
        activeTab === 'completed' ? q.completed : !q.completed
    );

    questsToShow.forEach(quest => {
        const questItem = document.createElement('div');
        questItem.className = 'quest-list-item';
        questItem.innerHTML = `<span class="quest-name">${quest.name}</span>`;
        questItem.dataset.questId = quest.id;

        if (quest.id === activeQuestId) questItem.classList.add('active');
        if (quest.completed) questItem.classList.add('completed');

        questItem.addEventListener('click', () => {
            ui.triggerHapticFeedback();
            activeQuestId = quest.id;
            renderApp();
        });
        container.appendChild(questItem);
    });
}

function renderCharacterSchedule() {
    const container = document.getElementById('character-schedule-container');
    container.innerHTML = '';

    const characterList = document.createElement('div');
    characterList.className = 'character-icon-list';
    
    for (const charName in characterScheduleData) {
        const charData = characterScheduleData[charName];
        const charIcon = document.createElement('img');
        charIcon.src = charData.icon;
        charIcon.className = 'character-icon';
        charIcon.dataset.character = charName;
        if (charName === activeCharacter) {
            charIcon.classList.add('active');
        }
        charIcon.addEventListener('click', () => {
            activeCharacter = charName;
            showCharacterDetailView(charName);
        });
        characterList.appendChild(charIcon);
    }
    container.appendChild(characterList);

    const scheduleGrid = document.createElement('div');
    scheduleGrid.className = 'schedule-grid';
    
    const days = ['Day 1', 'Day 2', 'Final Day'];
    const dayIcons = ['images/CharIcons/FirstDayIcon.png', 'images/CharIcons/DayTwoIcon.png', 'images/CharIcons/FinalDayIcon.png'];

    days.forEach((day, index) => {
        const dayColumn = document.createElement('div');
        dayColumn.className = 'schedule-day-column';
        
        const dayHeader = document.createElement('div');
        dayHeader.className = 'schedule-day-header';
        dayHeader.innerHTML = `<img src="${dayIcons[index]}" alt="${day}">`;
        dayColumn.appendChild(dayHeader);

        if (activeCharacter) {
            const charEvents = characterScheduleData[activeCharacter].events[day];
            if (charEvents) {
                for (const time in charEvents) {
                    const eventSlot = document.createElement('div');
                    eventSlot.className = 'schedule-time-slot';
                    eventSlot.innerHTML = `<strong>${time}:</strong> ${charEvents[time]}`;
                    dayColumn.appendChild(eventSlot);
                }
            }
        }
        scheduleGrid.appendChild(dayColumn);
    });
    container.appendChild(scheduleGrid);
}

/**
 * Renders the detailed view for the currently active quest.
 */
function renderQuestDetail() {
    if (!activeQuestId) {
        dom.notebookPlaceholderView.classList.remove('hidden');
        dom.questDetailView.classList.add('hidden');
        return;
    }

    const quest = findQuestById(activeQuestId);
    if (!quest) return;

    dom.notebookPlaceholderView.classList.add('hidden');
    dom.questDetailView.classList.remove('hidden');

    dom.questTitle.textContent = quest.name;
    dom.questRegion.textContent = quest.region;

    const stepsContainer = document.getElementById('quest-steps-container');
    stepsContainer.innerHTML = '';
    quest.steps.forEach((step, index) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'quest-step';
        if (step.completed) stepEl.classList.add('completed');

        const header = document.createElement('div');
        header.className = 'quest-step-header';
        header.innerHTML = `
            <div class="checkbox"></div>
            <div class="quest-step-details">
                <span class="quest-step-description">${step.description}</span>
                <span class="quest-step-time">Day ${step.day}, ${step.time}</span>
            </div>
            <div class="toggle-arrow">▶</div>
        `;

        const walkthrough = document.createElement('div');
        walkthrough.className = 'quest-step-walkthrough';
        walkthrough.innerHTML = `<p>${step.walkthrough}</p>`;

        stepEl.appendChild(header);
        stepEl.appendChild(walkthrough);
        stepsContainer.appendChild(stepEl);

        header.addEventListener('click', (e) => {
            if (e.target.classList.contains('checkbox')) {
                ui.triggerHapticFeedback();
                step.completed = !step.completed;
                quest.completed = quest.steps.every(s => s.completed);
                saveProgress();
                renderApp();
            } else {
                walkthrough.classList.toggle('open');
                header.querySelector('.toggle-arrow').classList.toggle('rotate-90');
            }
        });
    });

    const rewardsContainer = dom.questRewardsList;
    rewardsContainer.innerHTML = '';
    quest.rewards.forEach(rewardText => {
        const rewardEl = document.createElement('div');
        rewardEl.className = 'reward-item';
        
        const item = items.All.find(i => i.name === rewardText);
        const song = Object.entries(songs).find(([key, value]) => value.name === rewardText);

        let icon = '';
        if (item) {
            icon = item.image;
            rewardEl.addEventListener('click', (e) => {
                ui.triggerHapticFeedback();
                showItemDetailView(item, e.currentTarget.getBoundingClientRect());
            });
        } else if (song) {
            const [songKey, songData] = song;
            icon = 'images/songs_icon.png';
            rewardEl.addEventListener('click', (e) => {
                ui.triggerHapticFeedback();
                showSongDetails(songKey, e.currentTarget.getBoundingClientRect());
            });
        } else if (rewardText.toLowerCase().includes('heart')) {
            icon = 'images/heart_container_icon.png';
        }
        
        rewardEl.innerHTML = icon ? `<img src="${icon}" alt="reward">` : '';
        rewardEl.innerHTML += `<span>${rewardText}</span>`;
        rewardsContainer.appendChild(rewardEl);
    });
}

function showCharacterDetailView(characterName) {
    const charData = characterScheduleData[characterName];
    if (!charData) return;

    dom.characterName.innerHTML = `${characterName}<span class="hylian-name">${charData.hylian_name || ''}</span>`;
    dom.characterIcon.src = charData.icon;
    dom.characterDescription.textContent = charData.description;
    dom.characterFullArt.src = charData.full_art;

    ui.switchView(dom.characterDetailView);
}

function findQuestById(questId) {
    for (const categoryKey in questData) {
        const category = questData[categoryKey];
        if (category.quests) {
            const foundQuest = category.quests.find(q => q.id === questId);
            if (foundQuest) return foundQuest;
        }
        if (category.subCategories) {
            for (const subCategoryKey in category.subCategories) {
                const subCategory = category.subCategories[subCategoryKey];
                const foundQuest = subCategory.quests.find(q => q.id === questId);
                if (foundQuest) return foundQuest;
            }
        }
    }
    return null;
}

/**
 * Main render function for the notebook.
 */
function renderApp() {
    if (activeTab === 'characters') {
        dom.questListContainer.classList.add('hidden');
        document.getElementById('character-schedule-container').classList.remove('hidden');
        dom.notebookDetailContainer.classList.add('hidden');
        renderCharacterSchedule();
    } else {
        dom.questListContainer.classList.remove('hidden');
        document.getElementById('character-schedule-container').classList.add('hidden');
        dom.notebookDetailContainer.classList.remove('hidden');
        renderQuestList();
        renderQuestDetail();
    }
}

/**
 * Initializes the Bomber's Notebook view and its event listeners.
 */
export function populateBombersNotebook() {
    loadProgress();
    activeCharacter = Object.keys(characterScheduleData)[0]; // Select the first character by default
    renderApp();

    dom.bomberCodeInput.addEventListener('input', saveProgress);

    const tabs = document.querySelectorAll('.notebook-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            ui.triggerHapticFeedback();
            activeTab = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeQuestId = null; 
            renderApp();
        });
    });
}

