// --- ICON DATA ---
const ps5_icons = { triangle: '<svg class="ps5-svg" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"></path></svg>', circle: '<svg class="ps5-svg" viewBox="0 0 24 24"><path d="M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10s10-4.47,10-10S17.53,2,12,2z"></path></svg>', x: '<svg class="ps5-svg" fill="none" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>', square: '<svg class="ps5-svg" viewBox="0 0 24 24"><path d="M3,3V21H21V3H3z M19,19H5V5H19V19z"></path></svg>', };
const n64_icons = { up: '<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" /></svg>', down: '<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>', left: '<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>', right: '<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>', };

// --- EXPORTED DATA ---
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

export const instrumentImages = [
    'linkOcarina.webp',
    'goronDrums.png',
    'zoraGuitar.png',
    'pipesOfAwakening.png'
];

export const noteMappings = { 'n64': { 'CU': { html: n64_icons.up, class: 'n64-c' }, 'CD': { html: n64_icons.down, class: 'n64-c' }, 'CL': { html: n64_icons.left, class: 'n64-c' }, 'CR': { html: n64_icons.right, class: 'n64-c' }, 'A': { html: 'A', class: 'n64-a' }, 'B': { html: 'B', class: 'n64-b' }, }, 'ds': { 'CU': { html: 'Y', class: 'ds-y' }, 'CD': { html: 'A', class: 'ds-a' }, 'CL': { html: 'L', class: 'ds-l' }, 'CR': { html: 'R', class: 'ds-r' }, 'A': { html: 'X', class: 'ds-x' }, 'B': { html: 'B', class: 'ds-b' }, }, 'ps5': { 'CU': { html: 'R3', class: 'ps5-r3' }, 'CD': { html: 'R1', class: 'ps5-r1' }, 'CL': { html: ps5_icons.triangle, class: 'ps5-triangle' }, 'CR': { html: ps5_icons.circle, class: 'ps5-circle' }, 'A': { html: ps5_icons.x, class: 'ps5-x' }, 'B': { html: ps5_icons.square, class: 'ps5-square' }, } };

export const eventIcons = {
    event: `<svg class="event-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-5h2v2h-2zm0-8h2v6h-2z"></path></svg>`,
    reward: `<svg class="event-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-4h-8v-2h8v2zm0-4h-8v-2h8v2z"></path></svg>`,
};
