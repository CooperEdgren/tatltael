document.addEventListener('DOMContentLoaded', () => {
    // --- DATA STORE ---
    const songs = {
        'time': { name: "Song of Time", url: "https://www.youtube.com/watch?v=ei6GYtQYaFE", n64: ['CR', 'A', 'CD', 'CR', 'A', 'CD'] },
        'healing': { name: "Song of Healing", url: "https://www.youtube.com/watch?v=xPwxDfPs_RE", n64: ['CL', 'CR', 'CD', 'CL', 'CR', 'CD'] },
        'sonata': { name: "Sonata of Awakening", url: "https://www.youtube.com/watch?v=3oNXd581V7g", n64: ['CU', 'CL', 'CU', 'CL', 'A', 'CR', 'A'] },
        'soaring': { name: "Song of Soaring", url: "https://www.youtube.com/watch?v=1W3YW5iJ2ug", n64: ['CD', 'CL', 'CU', 'CD', 'CL', 'CU'] },
        'oath': { name: "Oath to Order", url: "https://www.youtube.com/watch?v=phs8Q-usflg", n64: ['CR', 'CD', 'A', 'CD', 'CR', 'CU'] },
        'goron': { name: "Goron Lullaby", url: "https://www.youtube.com/watch?v=dG27MVQ29HM", n64: ['A', 'CR', 'CL', 'A', 'CR', 'CL', 'CR', 'A'] },
        'epona': { name: "Epona's Song", url: "https://www.youtube.com/watch?v=N30xku_IUj8", n64: ['CU', 'CL', 'CR', 'CU', 'CL', 'CR'] },
        'elegy': { name: "Elegy of Emptiness", url: "https://www.youtube.com/watch?v=FBlFg0BvMDg", n64: ['CR', 'CL', 'CR', 'CD', 'CR', 'CU', 'CL'] },
        'bossa-nova': { name: "New Wave Bossa Nova", url: "https://www.youtube.com/watch?v=XQHeKbsR_Fo", n64: ['CL', 'CU', 'CL', 'CR', 'CD', 'CL', 'CR'] },
        'double-time': { name: "Song of Double Time", url: "https://www.youtube.com/watch?v=j4F7_rIa7kg", n64: ['CR', 'CR', 'A', 'A', 'CD', 'CD'] },
        'inverted-time': { name: "Inverted Song of Time", url: "https://www.youtube.com/watch?v=3Wxa9SQt5_U", n64: ['CD', 'A', 'CR', 'CD', 'A', 'CR'] },
        'storms': { name: "Song of Storms", url: "https://www.youtube.com/watch?v=YjGICZcOFBs", n64: ['A', 'CD', 'CU', 'A', 'CD', 'CU'] },
    };

    // --- MAPS DATA ---
    const maps = [
        { name: "Ancient Castle of Ikana", src: "maps/Ancient_Castle_of_Ikana.png" },
        { name: "Beneath the Well", src: "maps/Beneath-the-Well-350x300.png" },
        { name: "Clock Town", src: "maps/Clocktown-326x300.png" },
        { name: "Clock Town With Bomber Locations", src: "maps/Clocktown-With-Bomber-Locations-290x300.png" },
        { name: "Goron Shrine", src: "maps/Goron_Shrine.jpg" },
        { name: "Goron Village", src: "maps/Goron_Village.jpg" },
        { name: "Great Bay Coast", src: "maps/Great-Bay-Coast-347x300.png" },
        { name: "Great Bay Temple", src: "maps/Great-Bay-Temple-322x300.png" },
        { name: "Ikana Canyon", src: "maps/Ikana_Canyon.jpg" },
        { name: "Ikana Graveyard", src: "maps/Ikana_Graveyard.jpg" },
        { name: "Lulu's Room", src: "maps/Lulu's_Room.jpg" },
        { name: "Mayor's Residence", src: "maps/Mayor's_Residence.jpg" },
        { name: "Milk Bar", src: "maps/Milk_Bar.jpg" },
        { name: "Mountain Village", src: "maps/Mountain_Village.jpg" },
        { name: "Ocean Spider House", src: "maps/Ocean_Spider_House.jpg" },
        { name: "Pirates' Fortress", src: "maps/Pirates'_Fortress.jpg" },
        { name: "Romani Ranch", src: "maps/Romani_Ranch.jpg" },
        { name: "Sakon's Hideout", src: "maps/Sakon's_Hideout.jpg" },
        { name: "Snowhead", src: "maps/Snowhead.jpg" },
        { name: "Snowhead Temple", src: "maps/Snowhead_Temple.jpg" },
        { name: "Southern Swamp", src: "maps/Southern_Swamp.jpg" },
        { name: "Stock Pot Inn", src: "maps/Stock_Pot_Inn.jpg" },
        { name: "Stone Tower", src: "maps/Stone_Tower.jpg" },
        { name: "Stone Tower Temple", src: "maps/Stone_Tower_Temple.jpg" },
        { name: "Swamp Spider House", src: "maps/Swamp_Spider_House.jpg" },
        { name: "Termina Field", src: "maps/Termina_Field.jpg" },
        { name: "The Moon", src: "maps/The_Moon.jpg" },
        { name: "Woodfall", src: "maps/Woodfall.jpg" },
        { name: "Woodfall Temple", src: "maps/Woodfall_Temple.jpg" },
        { name: "Zora Hall", src: "maps/Zora_Hall.jpg" }
    ];
    
    // --- INSTRUMENT IMAGES ---
    const instrumentImages = [
        'linkOcarina.webp',
        'goronDrums.png',
        'zoraGuitar.png',
        'pipesOfAwakening.png'
    ];
    let currentImageIndex = 0;


    // --- ICON & NOTE MAPPINGS ---
    const ps5_icons = { triangle: '<svg class="ps5-svg" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"></path></svg>', circle: '<svg class="ps5-svg" viewBox="0 0 24 24"><path d="M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10s10-4.47,10-10S17.53,2,12,2z"></path></svg>', x: '<svg class="ps5-svg" fill="none" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>', square: '<svg class="ps5-svg" viewBox="0 0 24 24"><path d="M3,3V21H21V3H3z M19,19H5V5H19V19z"></path></svg>', };
    const n64_icons = { up: '<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" /></svg>', down: '<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>', left: '<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>', right: '<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>', };
    const noteMappings = { 'n64': { 'CU': { html: n64_icons.up, class: 'n64-c' }, 'CD': { html: n64_icons.down, class: 'n64-c' }, 'CL': { html: n64_icons.left, class: 'n64-c' }, 'CR': { html: n64_icons.right, class: 'n64-c' }, 'A': { html: 'A', class: 'n64-a' }, 'B': { html: 'B', class: 'n64-b' }, }, 'ds': { 'CU': { html: 'Y', class: 'ds-y' }, 'CD': { html: 'A', class: 'ds-a' }, 'CL': { html: 'L', class: 'ds-l' }, 'CR': { html: 'R', class: 'ds-r' }, 'A': { html: 'X', class: 'ds-x' }, 'B': { html: 'B', class: 'ds-b' }, }, 'ps5': { 'CU': { html: 'R3', class: 'ps5-r3' }, 'CD': { html: 'R1', class: 'ps5-r1' }, 'CL': { html: ps5_icons.triangle, class: 'ps5-triangle' }, 'CR': { html: ps5_icons.circle, class: 'ps5-circle' }, 'A': { html: ps5_icons.x, class: 'ps5-x' }, 'B': { html: ps5_icons.square, class: 'ps5-square' }, } };

    // --- DOM Elements ---
    const songSelectionView = document.getElementById('song-selection');
    const songDetailView = document.getElementById('song-detail-view');
    const mapsView = document.getElementById('maps-view');
    
    const songGrid = document.getElementById('song-grid');
    const songTitleEl = document.getElementById('song-title');
    const youtubePlayer = document.getElementById('youtube-player');
    const notesContainer = document.getElementById('notes-container');
    const backButton = document.getElementById('back-button');
    const instrumentImage = document.getElementById('instrument-image');

    const tingleContainer = document.getElementById('tingle-container');
    const mapGrid = document.getElementById('map-grid');
    const mapsBackButton = document.getElementById('maps-back-button');
    // Map Modal elements
    const mapModal = document.getElementById('map-modal');
    const mapModalImage = document.getElementById('map-modal-image');
    const mapModalClose = document.getElementById('map-modal-close');
    const backgroundAudio = document.getElementById('background-audio');

    const toggleUiButton = document.getElementById('toggle-ui-button');
    const iconEyeOpen = document.getElementById('icon-eye-open');
    const iconEyeClosed = document.getElementById('icon-eye-closed');

    // --- STATE ---
    let lastClickedButtonRect = null;
    let audioFadeInterval;
    let hideUiTimeout;

    // --- AUDIO CONTROL ---
    function fadeAudio(targetVolume) {
        if (!backgroundAudio) return;

        clearInterval(audioFadeInterval);
        const startVolume = backgroundAudio.volume;
        const difference = targetVolume - startVolume;
        const duration = 1000; // 1 second fade duration
        const stepTime = 50;
        const steps = duration / stepTime;
        const volumeStep = difference / steps;

        if (difference === 0) return;

        audioFadeInterval = setInterval(() => {
            const currentVolume = backgroundAudio.volume;
            let newVolume = currentVolume + volumeStep;

            // Ensure we don't go past the target volume
            if ((volumeStep > 0 && newVolume >= targetVolume) || (volumeStep < 0 && newVolume <= targetVolume)) {
                newVolume = targetVolume;
                clearInterval(audioFadeInterval);
            }
            
            backgroundAudio.volume = newVolume;

        }, stepTime);
    }

    // Function to start background audio on the first user interaction
    function startBackgroundMusic() {
        if (backgroundAudio.paused) {
            backgroundAudio.volume = 0.5; // Start at 50% volume
            backgroundAudio.play().catch(e => console.error("Audio autoplay was prevented. Needs user interaction.", e));
        }
        // This listener only needs to run once.
        document.body.removeEventListener('click', startBackgroundMusic);
        document.body.removeEventListener('keydown', startBackgroundMusic);
    }
    // Listen for the first click or keydown anywhere on the page to start music.
    document.body.addEventListener('click', startBackgroundMusic, { once: true });
    document.body.addEventListener('keydown', startBackgroundMusic, { once: true });


    // --- VIEW SWITCHING LOGIC ---
    function switchView(viewToShow) {
        document.querySelectorAll('.view-container').forEach(v => v.classList.remove('is-active'));
        if (viewToShow) {
            viewToShow.classList.add('is-active');
        }
        const isSongSelection = viewToShow === songSelectionView;
        tingleContainer.style.display = isSongSelection ? 'block' : 'none';
        toggleUiButton.style.display = isSongSelection ? 'flex' : 'none';
        if (isSongSelection) {
            resetHideUiTimeout();
        } else {
            clearTimeout(hideUiTimeout);
        }
    }

    // --- Utility Functions ---
    const getYouTubeID = (url) => { try { return new URL(url).searchParams.get('v'); } catch (e) { console.error('Invalid YouTube URL:', url); return null; } };
    const createNoteHTML = (note, platform) => { const mapping = noteMappings[platform]?.[note]; return mapping ? `<div class="note-icon ${mapping.class}">${mapping.html}</div>` : ''; };
    const generateNotesSection = (title, platform, songNotes) => { const notesHTML = songNotes.map(note => createNoteHTML(note, platform)).join(''); return `<div><h3 class="text-2xl font-bold mb-3 text-purple-200 tracking-wide font-zelda">${title}</h3><div class="flex flex-wrap items-center bg-black/40 p-3 rounded-lg min-h-[72px] shadow-inner">${notesHTML}</div></div>`; };
    const getAnimationTransforms = (elementRect) => { const viewportWidth = window.innerWidth; const viewportHeight = window.innerHeight; const scaleX = elementRect.width / viewportWidth; const scaleY = elementRect.height / viewportHeight; const translateX = elementRect.left + elementRect.width / 2 - viewportWidth / 2; const translateY = elementRect.top + elementRect.height / 2 - viewportHeight / 2; return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`; }

    // --- SONG VIEW LOGIC ---
    const showSongDetails = (songKey) => {
        const song = songs[songKey];
        if (!song || !lastClickedButtonRect) return;

        // Fade out background audio
        fadeAudio(0);

        songTitleEl.textContent = song.name;
        const videoId = getYouTubeID(song.url);
        youtubePlayer.src = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=${videoId}` : '';
        
        notesContainer.innerHTML = `${generateNotesSection('PlayStation', 'ps5', song.n64)}${generateNotesSection('Nintendo 64', 'n64', song.n64)}${generateNotesSection('Nintendo 3DS', 'ds', song.n64)}`;
        currentImageIndex = 0;
        instrumentImage.src = instrumentImages[currentImageIndex];

        const startTransform = getAnimationTransforms(lastClickedButtonRect);
        songDetailView.style.transform = startTransform;
        songDetailView.style.transformOrigin = 'center';
        
        switchView(songDetailView);

        requestAnimationFrame(() => {
            songDetailView.style.transform = 'translate(0, 0) scale(1)';
        });
    };

    const showSongSelection = () => {
        if (!lastClickedButtonRect) return;

        // Fade in background audio
        fadeAudio(0.5);

        youtubePlayer.src = 'about:blank';
        
        const endTransform = getAnimationTransforms(lastClickedButtonRect);
        songDetailView.style.transform = endTransform;
        switchView(songSelectionView);
    };

    const populateSongGrid = () => {
        songGrid.innerHTML = '';
        Object.keys(songs).forEach((key, index) => {
            const song = songs[key];
            const button = document.createElement('button');
            button.className = 'btn-song text-xl p-6 font-zelda';
            button.textContent = song.name;
            button.style.animationDelay = `${index * 60}ms`;
            button.addEventListener('click', (event) => {
                lastClickedButtonRect = event.currentTarget.getBoundingClientRect();
                showSongDetails(key);
            });
            songGrid.appendChild(button);
        });
    };

    const handleInstrumentClick = () => { currentImageIndex = (currentImageIndex + 1) % instrumentImages.length; instrumentImage.src = instrumentImages[currentImageIndex]; };

    // --- MAPS LOGIC ---
    const openMapModal = (src) => { mapModalImage.src = src; mapModal.classList.add('is-visible'); };
    const closeMapModal = () => { mapModal.classList.remove('is-visible'); };
    const populateMapsGrid = () => {
        mapGrid.innerHTML = '';
        maps.forEach(map => {
            const mapItem = document.createElement('div');
            mapItem.className = 'map-item';
            // **FIX**: Added 'https://' to the placeholder URL to make it absolute.
            mapItem.innerHTML = `<img src="${map.src}" alt="${map.name}" loading="lazy" onerror="this.src='https://placehold.co/400x300/0d0818/a78bfa?text=Map+Not+Found'"><h3>${map.name}</h3>`;
            mapItem.addEventListener('click', () => openMapModal(map.src));
            mapGrid.appendChild(mapItem);
        });
    };
    const showMapsView = () => { switchView(mapsView); };
    const showSongSelectionFromMaps = () => { switchView(songSelectionView); };


    // --- UI Toggle Logic ---
    const resetHideUiTimeout = () => {
        clearTimeout(hideUiTimeout);
        toggleUiButton.classList.remove('fade-out');
        hideUiTimeout = setTimeout(() => {
            toggleUiButton.classList.add('fade-out');
        }, 15000); // 15 seconds
    };

    const toggleControlsVisibility = () => {
        songSelectionView.classList.toggle('controls-hidden');
        const isHidden = songSelectionView.classList.contains('controls-hidden');
        iconEyeOpen.classList.toggle('hidden', isHidden);
        iconEyeClosed.classList.toggle('hidden', !isHidden);
        resetHideUiTimeout();
    };
    // --- EVENT LISTENERS ---
    populateSongGrid();
    populateMapsGrid();
    backButton.addEventListener('click', showSongSelection);
    instrumentImage.addEventListener('click', handleInstrumentClick);
    tingleContainer.addEventListener('click', showMapsView);
    mapsBackButton.addEventListener('click', showSongSelectionFromMaps);
    mapModalClose.addEventListener('click', closeMapModal);
    mapModal.addEventListener('click', (e) => { if (e.target === mapModal) { closeMapModal(); } });
    toggleUiButton.addEventListener('click', toggleControlsVisibility);

    // Inactivity Listeners
    document.addEventListener('mousemove', resetHideUiTimeout);
    document.addEventListener('keydown', resetHideUiTimeout);
    document.addEventListener('click', resetHideUiTimeout);
    
    switchView(songSelectionView);
});
