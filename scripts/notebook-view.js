import * as dom from './dom.js';
import { showItemDetailView } from './items-view.js';
import { showSongDetails } from './song-view.js';
import * as ui from './ui.js';
import { setHeartItemFound, render as renderHearts, loadHeartData as loadHeartDataFromHearts } from './hearts-view.js';

let notebookData = {};
let characterScheduleData = {};
let items = {};
let songs = {};

// Maps quest IDs to heart piece/container IDs
const questHeartMap = {
    'main-quest-2': 'n64-hc-1', // Odolwa's Remains
    'main-quest-3': 'n64-hc-2', // Goht's Remains
    'main-quest-4': 'n64-hc-3', // Gyorg's Remains
    'main-quest-5': 'n64-hc-4', // Twinmold's Remains
    'deku-playground': 'n64-p-3',
    'shooting-gallery': 'n64-p-5',
    'honey-darling': 'n64-p-6',
    'treasure-chest-shop': 'n64-p-11', // Assuming this is the swordsman's school
    'postmans-timing-game': 'n64-p-12',
    'hand-in-toilet': 'n64-p-10',
    'keaton-quiz': 'n64-p-4',
    'swordsmans-school': 'n64-p-11',
    'rosa-sisters': 'n64-p-13',
    'bank-reward': 'n64-p-14',
    'mailbox-reward': 'n64-p-15',
    'peahat-grotto': 'n64-p-16',
    'dodongo-grotto': 'n64-p-20',
    'gossip-stones-grotto': 'n64-p-18',
    'swamp-shooting-gallery': 'n64-p-22',
    'swamp-photo-contest': 'n64-p-23',
    'deku-palace-maze': 'n64-p-24',
    'frog-choir': 'n64-p-29',
    'dog-races': 'n64-p-32',
    'pinnacle-rock': 'n64-p-34',
    'zora-band': 'n64-p-35',
    'beaver-races': 'n64-p-39',
    'ikana-castle': 'n64-p-42',
    'ikana-graveyard': 'n64-p-47',
    'secret-shrine': 'n64-p-45',
    'ghost-hut': 'n64-p-45', // This is the same as secret shrine
};


async function loadNotebookData() {
    try {
        const [notebookRes, itemsRes, gameDataRes, _] = await Promise.all([
            fetch('../data/notebook.json'),
            fetch('../data/items.json'),
            fetch('../data/game-data.json'),
            loadHeartDataFromHearts()
        ]);

        if (!notebookRes.ok) throw new Error(`HTTP error! status: ${notebookRes.status}`);
        const notebookJson = await notebookRes.json();
        notebookData = notebookJson.notebookData;
        characterScheduleData = notebookJson.characterScheduleData;

        if (!itemsRes.ok) throw new Error(`HTTP error! status: ${itemsRes.status}`);
        items = await itemsRes.json();
        // Populate the "All" category after fetching
        if (items.All) {
            items.All = [];
            for (const category in items) {
                if (category !== "All") {
                    items.All.push(...items[category]);
                }
            }
        }

        if (!gameDataRes.ok) throw new Error(`HTTP error! status: ${gameDataRes.status}`);
        const gameData = await gameDataRes.json();
        songs = gameData.songs;

    } catch (error) {
        console.error("Could not load notebook data:", error);
    }
}

let questData = {};
let activeQuestId = null;
let activeTab = 'scheduled'; // 'scheduled', 'completed', or 'characters'
let activeCharacter = null;
let questVersion = 'n64'; // 'n64' or '3ds'

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
    for (const categoryKey in questData) {
        const category = questData[categoryKey];
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
                renderQuestItems(subCategory.quests, questList, true); // Pass true for indented
                container.appendChild(questList);

                subCategoryTitle.addEventListener('click', () => {
                    questList.classList.toggle('open');
                    subCategoryTitle.querySelector('.toggle-arrow').classList.toggle('rotate-90');
                });
            }
        }

        if (category.quests) {
            renderQuestItems(category.quests, container, false); // Not indented
        }
    }
}

function renderQuestItems(quests, container, isIndented) {
    const questsToShow = quests.filter(q => 
        activeTab === 'completed' ? q.completed : !q.completed
    );

    questsToShow.forEach(quest => {
        const questItem = document.createElement('div');
        questItem.className = 'quest-list-item';
        if (isIndented) {
            questItem.style.marginLeft = '1rem';
        }
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

    const hasVersionDifferences = quest.rewards_3ds || quest.steps_3ds;

    dom.notebookPlaceholderView.classList.add('hidden');
    dom.questDetailView.classList.remove('hidden');

    const titleContainer = dom.questTitle.parentElement;
    let versionToggle = titleContainer.querySelector('.version-toggle-quest');
    if (hasVersionDifferences) {
        if (!versionToggle) {
            versionToggle = document.createElement('div');
            versionToggle.className = 'version-toggle-quest';
            versionToggle.innerHTML = `
                <button class="btn-back text-sm" data-version="n64">N64</button>
                <button class="btn-back text-sm" data-version="3ds">3DS</button>
            `;
            titleContainer.appendChild(versionToggle);

            versionToggle.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    questVersion = e.target.dataset.version;
                    renderQuestDetail();
                }
            });
        }
        versionToggle.style.display = 'flex';
        versionToggle.querySelectorAll('button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.version === questVersion);
        });
    } else if (versionToggle) {
        versionToggle.style.display = 'none';
    }


    dom.questTitle.textContent = quest.name;
    dom.questRegion.textContent = quest.region;

    const steps = questVersion === '3ds' && quest.steps_3ds ? quest.steps_3ds : quest.steps;
    const rewards = questVersion === '3ds' && quest.rewards_3ds ? quest.rewards_3ds : quest.rewards;


    const stepsContainer = document.getElementById('quest-steps-container');
    stepsContainer.innerHTML = '';
    steps.forEach((step, index) => {
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
                if (quest.completed) {
                    const heartId = questHeartMap[quest.id];
                    if (heartId) {
                        setHeartItemFound(heartId);
                        renderHearts(); // Re-render the hearts view
                    }
                }
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
    const charactersContainer = dom.questCharactersList;
    charactersContainer.innerHTML = '';

    if (rewards) {
        rewards.forEach(rewardText => {
            const rewardEl = document.createElement('div');
            rewardEl.className = 'reward-item';
            
            let item = items.All.find(i => i.id === rewardText);
            if (!item) {
                item = items.All.find(i => i.name === rewardText);
            }
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

    if (quest.characters) {
        const charactersTitle = document.createElement('h4');
        charactersTitle.className = 'font-zelda text-yellow-600 text-xl';
        charactersTitle.textContent = 'Characters';
        charactersContainer.appendChild(charactersTitle);

        quest.characters.forEach(characterName => {
            const charData = characterScheduleData[characterName];
            if (charData) {
                const charEl = document.createElement('div');
                charEl.className = 'reward-item';
                charEl.innerHTML = `<img src="${charData.icon}" alt="${characterName}"><span>${characterName}</span>`;
                charEl.addEventListener('click', () => {
                    ui.triggerHapticFeedback();
                    showCharacterDetailView(characterName);
                });
                charactersContainer.appendChild(charEl);
            }
        });
    }
    // Append charactersContainer after rewardsContainer if it has content
    if (rewardsContainer.children.length > 0 && charactersContainer.children.length > 0) {
        rewardsContainer.after(charactersContainer);
    } else if (charactersContainer.children.length > 0) {
        // If rewardsContainer is empty but charactersContainer has content, append it after the rewards title
        const rewardsTitle = rewardsContainer.previousElementSibling; // Assuming rewards title is the element before rewardsContainer
        if (rewardsTitle && rewardsTitle.tagName === 'H4') { // Check if it's actually the rewards title
            rewardsTitle.after(charactersContainer);
        } else {
            // Fallback if rewardsTitle is not found or not an H4
            rewardsContainer.after(charactersContainer);
        }
    } else {
        // If charactersContainer is empty, ensure it's not displayed
        charactersContainer.remove();
    }
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
export async function populateBombersNotebook() {
    await loadNotebookData();
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

