// --- PLATFORM CONFIGURATIONS ---
// This object holds the display name, logo, and controller image for each platform.
export const platforms = {
    'n64': {
        name: 'Nintendo 64',
        logo: 'logos/n64/Nintendo_64_wordmark.svg.png',
        controller: 'logos/n64/controller.png'
    },
    'gamecube': {
        name: 'GameCube (Wii VC)',
        logo: 'logos/gamecube/Nintendo_GameCube_Official_Logo.svg.png',
        controller: 'logos/gamecube/Control Screen Colored 4k.png'
    },
    'n3ds': {
        name: 'Nintendo 3DS',
        logo: 'logos/3ds/nintendo-3ds-logo-svg-vector.svg',
        controller: 'logos/nintendo-3ds/controller.png'
    },
    'ps': {
        name: 'PlayStation',
        logo: 'logos/ps5/PlayStation_Wordmark.svg.png',
        controller: 'logos/ps5/Control Solid Inv 4k.png'
    },
    'xbox': {
        name: 'Xbox',
        logo: 'logos/xbox/Xbox_wordmark.svg.png',
        controller: 'logos/xbox/Control Solid Alt Inv 4k.png'
    }
};

// --- NOTE MAPPINGS ---
// Maps the base N64 notes to the corresponding button icon and CSS class for each platform.
export const noteMappings = {
    'n64': {
        'CU': { icon: 'buttons/N64/ButtonIcon-N64-C-Up.svg', class: 'n64-c' },
        'CD': { icon: 'buttons/N64/ButtonIcon-N64-C-Down.svg', class: 'n64-c' },
        'CL': { icon: 'buttons/N64/ButtonIcon-N64-C-Left.svg', class: 'n64-c' },
        'CR': { icon: 'buttons/N64/ButtonIcon-N64-C-Right.svg', class: 'n64-c' },
        'A': { icon: 'buttons/N64/ButtonIcon-N64-A.svg', class: 'n64-a' },
        'B': { icon: 'buttons/N64/ButtonIcon-N64-B.svg', class: 'n64-b' },
    },
    'gamecube': { // Mapped from N64 for Wii Virtual Console
        'CU': { icon: 'buttons/GAMECUBE/C Stick Up.svg', class: 'gc-c' },
        'CD': { icon: 'buttons/GAMECUBE/C Stick Down.svg', class: 'gc-c' },
        'CL': { icon: 'buttons/GAMECUBE/C Stick Left.svg', class: 'gc-c' },
        'CR': { icon: 'buttons/GAMECUBE/C Stick Right.svg', class: 'gc-c' },
        'A': { icon: 'buttons/GAMECUBE/A.svg', class: 'gc-a' },
        'B': { icon: 'buttons/GAMECUBE/B.svg', class: 'gc-b' },
    },
    'n3ds': { // 3DS Remake controls
        'CU': { icon: 'buttons/3DS/Y.svg', class: 'n3ds-y' },
        'CD': { icon: 'buttons/3DS/A.svg', class: 'n3ds-a' },
        'CL': { icon: 'buttons/3DS/L.svg', class: 'n3ds-l' },
        'CR': { icon: 'buttons/3DS/R.svg', class: 'n3ds-r' },
        'A': { icon: 'buttons/3DS/X.svg', class: 'n3ds-x' },
        'B': { icon: 'buttons/3DS/B.svg', class: 'n3ds-b' },
    },
    'ps': { // A modern PlayStation mapping
        'CU': { icon: 'buttons/PS5/Right Stick Click.svg', class: 'ps-r3' },
        'CD': { icon: 'buttons/PS5/R1.svg', class: 'ps-r1' },
        'CL': { icon: 'buttons/PS5/Triangle.svg', class: 'ps-triangle' },
        'CR': { icon: 'buttons/PS5/Circle.svg', class: 'ps-circle' },
        'A': { icon: 'buttons/PS5/Cross.svg', class: 'ps-x' },
        'B': { icon: 'buttons/PS5/Square.svg', class: 'ps-square' },
    },
    'xbox': { // Mapped from PlayStation controls
        'CU': { icon: 'buttons/XBOX/Right Stick Click.svg', class: 'xbox-rs' },
        'CD': { icon: 'buttons/XBOX/Right Bumper.svg', class: 'xbox-rb' },
        'CL': { icon: 'buttons/XBOX/Y.svg', class: 'xbox-y' },
        'CR': { icon: 'buttons/XBOX/B.svg', class: 'xbox-b' },
        'A': { icon: 'buttons/XBOX/A.svg', class: 'xbox-a' },
        'B': { icon: 'buttons/XBOX/X.svg', class: 'xbox-x' },
    }
};


// --- SONG DATA ---
// The base notes for all songs are the N64 version. They are converted for other platforms.
export const songs = {
    'time': { name: "Song of Time", hylian_name: "temple of time", url: "https://www.youtube.com/watch?v=ei6GYtQYaFE", n64: ['CR', 'A', 'CD', 'CR', 'A', 'CD'] },
    'healing': { name: "Song of Healing", hylian_name: "song of healing", url: "https://www.youtube.com/watch?v=xPwxDfPs_RE", n64: ['CL', 'CR', 'CD', 'CL', 'CR', 'CD'] },
    'sonata': { name: "Sonata of Awakening", hylian_name: "sonata of awakening", url: "https://www.youtube.com/watch?v=3oNXd581V7g", n64: ['CU', 'CL', 'CU', 'CL', 'A', 'CR', 'A'] },
    'soaring': { name: "Song of Soaring", hylian_name: "song of soaring", url: "https://www.youtube.com/watch?v=1W3YW5iJ2ug", n64: ['CD', 'CL', 'CU', 'CD', 'CL', 'CU'] },
    'oath': { name: "Oath to Order", hylian_name: "oath to order", url: "https://www.youtube.com/watch?v=phs8Q-usflg", n64: ['CR', 'CD', 'A', 'CD', 'CR', 'CU'] },
    'goron': { name: "Goron Lullaby", hylian_name: "goron lullaby", url: "https://www.youtube.com/watch?v=dG27MVQ29HM", n64: ['A', 'CR', 'CL', 'A', 'CR', 'CL', 'CR', 'A'] },
    'epona': { name: "Epona's Song", hylian_name: "epona's song", url: "https://www.youtube.com/watch?v=N30xku_IUj8", n64: ['CU', 'CL', 'CR', 'CU', 'CL', 'CR'] },
    'elegy': { name: "Elegy of Emptiness", hylian_name: "elegy of emptiness", url: "https://www.youtube.com/watch?v=FBlFg0BvMDg", n64: ['CR', 'CL', 'CR', 'CD', 'CR', 'CU', 'CL'] },
    'bossa-nova': { name: "New Wave Bossa Nova", hylian_name: "new wave bossa nova", url: "https://www.youtube.com/watch?v=XQHeKbsR_Fo", n64: ['CL', 'CU', 'CL', 'CR', 'CD', 'CL', 'CR'] },
    'double-time': { name: "Song of Double Time", hylian_name: "song of double time", url: "https://www.youtube.com/watch?v=j4F7_rIa7kg", n64: ['CR', 'CR', 'A', 'A', 'CD', 'CD'] },
    'inverted-time': { name: "Inverted Song of Time", hylian_name: "inverted song of time", url: "https://www.youtube.com/watch?v=3Wxa9SQt5_U", n64: ['CD', 'A', 'CR', 'CD', 'A', 'CR'] },
    'storms': { name: "Song of Storms", hylian_name: "song of storms", url: "https://www.youtube.com/watch?v=YjGICZcOFBs", n64: ['A', 'CD', 'CU', 'A', 'CD', 'CU'] },
};

// --- MAPS DATA ---
export const maps = [
    { name: "Ancient Castle of Ikana", src: "maps/Ancient-Castle-of-Ikana.png" },
    { name: "Beneath the Well", src: "maps/Beneath-the-Well.png" },
    { name: "Clock Town", src: "maps/ClocktownHDVmap.png" },
    { name: "Clock Town With Bomber Locations", src: "maps/Clocktown-With-Bomber-Locations.png" },
    { name: "Great Bay Coast", src: "maps/Great-Bay-Coast.png" },
    { name: "Great Bay Temple", src: "maps/Great-Bay-Temple.png" },
    { name: "Great Bay Temple Fairy Finder", src: "maps/Great-Bay-Temple-Fairy-Finder.png" },
    { name: "Ikana Canyon", src: "maps/Ikana-Canyon.png" },
    { name: "Ikana Graveyard", src: "maps/Ikana-Graveyard.png" },
    { name: "Milk Road and Gorman Track", src: "maps/Milk-Road-and-Gorman-Track.png" },
    { name: "Mountain Village", src: "maps/Mountain-Village.png" },
    { name: "Mountain Village 2", src: "maps/Mountain-Village-2.png" },
    { name: "Oceanside Spider House", src: "maps/Oceanside-Spider-House.png" },
    { name: "Pirates' Fortress", src: "maps/Pirate-Fortress.png" },
    { name: "Pirates' Fortress 2", src: "maps/Pirate-Fortress-2.png" },
    { name: "Romani Ranch", src: "maps/Romani-Ranch.png" },
    { name: "Snowhead Temple", src: "maps/Snowhead-Temple.png" },
    { name: "Snowhead Temple Fairy Finder", src: "maps/Snowhead-Temple-Fairy-Finder.png"},
    { name: "Southern Swamp", src: "maps/Southern-Swamp-Map.png" },
    { name: "Stone Tower", src: "maps/Stone-Tower.png" },
    { name: "Stone Tower Temple", src: "maps/Stone-Tower-Temple.png" },
    { name: "Stone Tower Temple Fairy Finder", src: "maps/Stone-Tower-Temple-Fairy-Finder.png"},
    { name: "Swamp Spider House", src: "maps/Swamp-Spider-House.png" },
    { name: "Termina Field", src: "maps/Termina-Field.png" },
    { name: "Woodfall", src: "maps/Woodfall.png" },
    { name: "Woodfall Temple Exit", src: "maps/Wood-Fall-Temple-Exit.png" },
    { name: "Woodfall Temple Fairy Finder", src: "maps/WoodFall-Temple-Floors-1-2-2.png"},
    { name: "Woodfall Temple Floors 1 & 2", src: "maps/WoodFall-Temple-Floors-1-2.png"},
    { name: "Woods of Mystery", src: "maps/Woods-of-Mystery-Map.png"},
    { name: "Zora Hall", src: "maps/Zora-Hall.png" }
];


// --- INSTRUMENT & EVENT ICONS ---
export const instrumentImages = [
    'images/linkOcarina.webp',
    'images/goronDrums.png',
    'images/zoraGuitar.png',
    'images/pipesOfAwakening.png'
];

export const eventIcons = {
    event: `<svg class="event-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-5h2v2h-2zm0-8h2v6h-2z"></path></svg>`,
    reward: `<svg class="event-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-4h-8v-2h8v2zm0-4h-8v-2h8v2z"></path></svg>`,
};
