    // --- ICON & NOTE MAPPINGS ---
    const ps5_icons = {
        triangle: '<svg class="ps5-svg" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"></path></svg>',
        circle: '<svg class="ps5-svg" viewBox="0 0 24 24"><path d="M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10s10-4.47,10-10S17.53,2,12,2z"></path></svg>',
        x: '<svg class="ps5-svg" fill="none" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>',
        square: '<svg class="ps5-svg" viewBox="0 0 24 24"><path d="M3,3V21H21V3H3z M19,19H5V5H19V19z"></path></svg>',
    };
    const n64_icons = {
        up: '<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" /></svg>',
        down: '<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>',
        left: '<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>',
        right: '<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>',
    };
    const noteMappings = {
        'n64': { 'CU': { html: n64_icons.up, class: 'n64-c' }, 'CD': { html: n64_icons.down, class: 'n64-c' }, 'CL': { html: n64_icons.left, class: 'n64-c' }, 'CR': { html: n64_icons.right, class: 'n64-c' }, 'A': { html: 'A', class: 'n64-a' }, 'B': { html: 'B', class: 'n64-b' }, },
        'ds': { 'CU': { html: 'Y', class: 'ds-y' }, 'CD': { html: 'A', class: 'ds-a' }, 'CL': { html: 'L', class: 'ds-l' }, 'CR': { html: 'R', class: 'ds-r' }, 'A': { html: 'X', class: 'ds-x' }, 'B': { html: 'B', class: 'ds-b' }, },
        'ps5': { 'CU': { html: 'R3', class: 'ps5-r3' }, 'CD': { html: 'R1', class: 'ps5-r1' }, 'CL': { html: ps5_icons.triangle, class: 'ps5-triangle' }, 'CR': { html: ps5_icons.circle, class: 'ps5-circle' }, 'A': { html: ps5_icons.x, class: 'ps5-x' }, 'B': { html: ps5_icons.square, class: 'ps5-square' }, }
    };