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
        controller: 'logos/gamecube/Control Screen Colored.svg'
    },
    'n3ds': {
        name: 'Nintendo 3DS',
        logo: 'logos/3ds/nintendo-3ds-logo-svg-vector.svg',
        controller: 'logos/nintendo-3ds/controller.png'
    },
    'ps': {
        name: 'PlayStation',
        logo: 'logos/ps5/PlayStation_Wordmark.svg.png',
        controller: 'logos/ps5/ControlSolid.svg'
    },
    'xbox': {
        name: 'Xbox',
        logo: 'logos/xbox/Xbox_wordmark.svg.png',
        controller: 'logos/xbox/Control Solid SVG.svg'
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
        'B': { icon: 'buttons/XBOX/Y.svg', class: 'xbox-x' },
    }
};


// --- SONG DATA ---
// The base notes for all songs are the N64 version. They are converted for other platforms.
export const songs = {
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
export const maps = [
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

// --- BOMBER'S NOTEBOOK DATA ---
export const bombersNotebookData = [
    {
        id: 'anju', name: 'Anju', description: 'The anxious innkeeper of the Stock Pot Inn.', img: 'https://placehold.co/80x80/a78bfa/1e1b4b?text=Anju',
        events: [
            { id: 'anju1', day: 1, time: '14:10', description: "The Postman delivers a letter from Kafei to Anju.", icon: 'event' },
            { id: 'anju2', day: 1, time: '16:30', description: "Speak to Anju wearing the Kafei Mask to schedule a meeting in the kitchen at night.", icon: 'event' },
            { id: 'anju3', day: 1, time: '23:30', description: "Meet Anju in the inn's kitchen. She gives you the Letter to Kafei.", icon: 'reward' },
            { id: 'anju4', day: 2, time: '16:00', description: "Anju worries in her room. If you didn't meet her, she goes to Romani Ranch.", icon: 'event' },
            { id: 'anju5', day: 3, time: '13:00', description: "Anju waits in her room for Kafei's return. Give her the Pendant of Memories to receive the Couple's Mask.", icon: 'reward' }
        ]
    },
    {
        id: 'kafei', name: 'Kafei', description: 'A resident of Clock Town who has mysteriously vanished.', img: 'https://placehold.co/80x80/a78bfa/1e1b4b?text=Kafei',
        events: [
            { id: 'kafei1', day: 1, time: '15:15', description: "Mail the Letter to Kafei in a postbox.", icon: 'event' },
            { id: 'kafei2', day: 2, time: '13:45', description: "The Postman delivers the letter to Kafei's hideout behind the Curiosity Shop.", icon: 'event' },
            { id: 'kafei3', day: 2, time: '16:10', description: "Meet Kafei in his hideout. He gives you the Pendant of Memories.", icon: 'reward' },
            { id: 'kafei4', day: 3, time: '13:00', description: "Confront Sakon in Ikana Canyon to retrieve the Sun's Mask. Kafei gives you the Keaton Mask and a letter for his mother.", icon: 'reward' },
             { id: 'kafei5', day: 3, time: '16:30', description: "Kafei returns to the Stock Pot Inn to reunite with Anju.", icon: 'event' }
        ]
    },
    {
        id: 'romani', name: 'Romani', description: 'A young girl who runs Romani Ranch with her sister.', img: 'https://placehold.co/80x80/a78bfa/1e1b4b?text=Romani',
        events: [
            { id: 'romani1', day: 1, time: '06:00', description: "Talk to Romani and agree to help her defend the barn from 'Them'.", icon: 'event' },
            { id: 'romani2', day: 1, time: '02:30', description: "Defend the barn from the alien invaders until 5:15 AM.", icon: 'reward' },
            { id: 'romani3', day: 2, time: '18:00', description: "If you succeeded, escort Cremia's milk delivery to Clock Town, defending it from the Gorman Brothers.", icon: 'reward' }
        ]
    },
    {
        id: 'gorman', name: 'Gorman Bros.', description: 'A shady pair of brothers who dislike Cremia.', img: 'https://placehold.co/80x80/a78bfa/1e1b4b?text=Gorman',
        events: [
            { id: 'gorman1', day: 2, time: '18:00', description: "They will attempt to raid Cremia's milk cart on the way to Clock Town.", icon: 'event' }
        ]
    },
     {
        id: 'granny', name: 'Anju\'s Granny', description: 'An old woman at the Stock Pot Inn with stories to tell.', img: 'https://placehold.co/80x80/a78bfa/1e1b4b?text=Granny',
        events: [
            { id: 'granny1', day: 1, time: '08:00', description: "Listen to her 2-hour story 'Carnival of Time' with the All-Night Mask to get a Piece of Heart.", icon: 'reward' },
            { id: 'granny2', day: 2, time: '08:00', description: "Listen to her 6-hour story 'The Four Giants' with the All-Night Mask to get another Piece of Heart.", icon: 'reward' },
        ]
    },
];

// --- INSTRUMENT & EVENT ICONS ---
export const instrumentImages = [
    'linkOcarina.webp',
    'goronDrums.png',
    'zoraGuitar.png',
    'pipesOfAwakening.png'
];

export const eventIcons = {
    event: `<svg class="event-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-5h2v2h-2zm0-8h2v6h-2z"></path></svg>`,
    reward: `<svg class="event-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-4h-8v-2h8v2zm0-4h-8v-2h8v2z"></path></svg>`,
};
