export const items = {
    "All": [],
    "Masks": [
        {
            "id": "deku-mask",
            "name": "Deku Mask",
            "image": "images/items/Deku_Mask.png",
            "description": "Transforms Link into a Deku Scrub, allowing him to shoot bubbles, hop across water, and use Deku Flowers to fly.",
            "acquisition": "Acquired at the beginning of the game after Link retrieves his ocarina from the Skull Kid."
        },
        {
            "id": "goron-mask",
            "name": "Goron Mask",
            "image": "images/items/Goron_Mask.png",
            "description": "Transforms Link into Goron Link, who can roll at high speeds, punch with great strength, and walk on lava.",
            "acquisition": "Play the Song of Healing for the spirit of the Goron hero, Darmani, in the Goron Graveyard."
        },
        {
            "id": "zora-mask",
            "name": "Zora Mask",
            "image": "images/items/Zora_Mask.png",
            "description": "Transforms Link into Zora Link, allowing him to swim with incredible speed, create a magical barrier, and use his fins as boomerangs.",
            "acquisition": "Play the Song of Healing for the spirit of Mikau, a Zora guitarist, found floating in the waters of Great Bay."
        },
        {
            "id": "fierce-deity-mask",
            "name": "Fierce Deity's Mask",
            "image": "images/items/Fierce_Deity_Mask.png",
            "description": "Transforms Link into the Fierce Deity, a towering figure with a double-helix sword that can fire beams of energy. It can only be used during boss battles.",
            "acquisition": "A reward for collecting all other 23 masks in the game and speaking to the Moon Children."
        },
        {
            "id": "all-night-mask",
            "name": "All-Night Mask",
            "image": "images/items/All-Night_Mask.png",
            "description": "Allows Link to stay awake for Anju's grandmother's stories, leading to a Piece of Heart.",
            "acquisition": "Purchase from the Curiosity Shop for 500 rupees, available on the final night if you saved the old lady from the bomb bag thief."
        }
    ],
    "Equipment": [
        {
            "id": "kokiri-sword",
            "name": "Kokiri Sword",
            "image": "images/items/Kokiri_Sword.png",
            "description": "Link's starting sword. It's a reliable, but basic weapon.",
            "acquisition": "Given to Link at the start of the game."
        },
        {
            "id": "razor-sword",
            "name": "Razor Sword",
            "image": "images/items/Razor_Sword.png",
            "description": "A temporary upgrade that is twice as strong but breaks after 100 hits or if time is reset.",
            "acquisition": "Upgrade the Kokiri Sword at the Mountain Smithy for 100 rupees."
        },
        {
            "id": "gilded-sword",
            "name": "Gilded Sword",
            "image": "images/items/Gilded_Sword.png",
            "description": "A permanent and powerful upgrade to the Kokiri Sword.",
            "acquisition": "After obtaining the Razor Sword, win the Goron Race to get a bottle of Gold Dust. Then, upgrade the Razor Sword at the Mountain Smithy."
        },
        {
            "id": "heros-shield",
            "name": "Hero's Shield",
            "image": "images/items/Heros_Shield.png",
            "description": "Link's default shield. Can be used to block many enemy attacks.",
            "acquisition": "Available from the start of the game."
        },
        {
            "id": "mirror-shield",
            "name": "Mirror Shield",
            "image": "images/items/Mirror_Shield.png",
            "description": "Can reflect light and certain magical attacks.",
            "acquisition": "Found in the Ikana Canyon dungeon, the Stone Tower Temple."
        }
    ],
    "Inventory": [
        {
            "id": "heros-bow",
            "name": "Hero's Bow",
            "image": "images/items/Heros_Bow.png",
            "description": "Found in the Woodfall Temple, used to shoot arrows.",
            "acquisition": "Obtained in the Woodfall Temple."
        },
        {
            "id": "fire-arrow",
            "name": "Fire Arrow",
            "image": "images/items/Fire_Arrow.png",
            "description": "Magical arrows that can melt ice and light torches.",
            "acquisition": "Obtained in the Snowhead Temple."
        },
        {
            "id": "ice-arrow",
            "name": "Ice Arrow",
            "image": "images/items/Ice_Arrow.png",
            "description": "Magical arrows that can freeze enemies and create platforms in water.",
            "acquisition": "Obtained in the Great Bay Temple."
        },
        {
            "id": "light-arrow",
            "name": "Light Arrow",
            "image": "images/items/Light_Arrow.png",
            "description": "Magical arrows that can dispel evil and solve certain puzzles.",
            "acquisition": "Obtained in the Stone Tower Temple."
        },
        {
            "id": "hookshot",
            "name": "Hookshot",
            "image": "images/items/Hookshot.png",
            "description": "Allows Link to grapple onto distant objects.",
            "acquisition": "Found in the Pirates' Fortress."
        },
        {
            "id": "lens-of-truth",
            "name": "Lens of Truth",
            "image": "images/items/Lens_of_Truth.png",
            "description": "Reveals hidden objects and enemies.",
            "acquisition": "Found in a cave behind a waterfall in the Goron Village after using a Goron to punch the wall."
        }
    ]
};

// Populate the "All" category with all items from other categories
for (const category in items) {
    if (category !== "All") {
        items.All.push(...items[category]);
    }
}