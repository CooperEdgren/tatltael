import { notebookData } from './data-notebook.js';
import * as dom from './dom.js';
import { items } from './data-items.js'; // Import items data
import { songs } from './data.js';
import { showItemDetailView } from './items-view.js'; // Import item detail view function
import { showSongDetails } from './song-view.js';
import * as ui from './ui.js';

let questData = {};
let activeQuestId = null;
let activeTab = 'scheduled'; // 'scheduled' or 'completed'

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
        questData[category].quests.forEach(quest => {
            if (quest.completed === undefined) {
                quest.completed = quest.steps.every(s => s.completed);
            }
        });
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
        const questsToShow = category.quests.filter(q => 
            activeTab === 'completed' ? q.completed : !q.completed
        );

        if (questsToShow.length > 0) {
            const categoryTitle = document.createElement('h3');
            categoryTitle.className = 'quest-category-title';
            categoryTitle.textContent = category.title;
            container.appendChild(categoryTitle);

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
    }
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

    const quest = Object.values(questData).flatMap(c => c.quests).find(q => q.id === activeQuestId);
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

/**
 * Main render function for the notebook.
 */
function renderApp() {
    renderQuestList();
    renderQuestDetail();
}

/**
 * Initializes the Bomber's Notebook view and its event listeners.
 */
export function populateBombersNotebook() {
    loadProgress();
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
