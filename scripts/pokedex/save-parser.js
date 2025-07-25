// save-parser.js
// This file contains functions to parse Pokémon save files from different game generations.
// It reads the raw binary data from a save file and extracts information such as
// trainer name, Pokédex data, badges, etc.

// Character maps are used to convert the byte values from the save file into readable text.
const CHARACTER_MAP_GEN1 = {
    0x50 : "\0", 0x7F : " ",

    0x80 : "A", 0x81 : "B", 0x82 : "C", 0x83 : "D", 0x84 : "E",
    0x85 : "F", 0x86 : "G", 0x87 : "H", 0x88 : "I", 0x89 : "J",
    0x8A : "K", 0x8B : "L", 0x8C : "M", 0x8D : "N", 0x8E : "O",
    0x8F : "P", 0x90 : "Q", 0x91 : "R", 0x92 : "S", 0x93 : "T",
    0x94 : "U", 0x95 : "V", 0x96 : "W", 0x97 : "X", 0x98 : "Y",
    0x99 : "Z", 0x9A : "(", 0x9B : ")", 0x9C : ":", 0x9D : ";",
    0x9E : "[", 0x9F : "]",

    0xA0 : "a", 0xA1 : "b", 0xA2 : "c", 0xA3 : "d", 0xA4 : "e",
    0xA5 : "f", 0xA6 : "g", 0xA7 : "h", 0xA8 : "i", 0xA9 : "j",
    0xAA : "k", 0xAB : "l", 0xAC : "m", 0xAD : "n", 0xAE : "o",
    0xAF : "p", 0xB0 : "q", 0xB1 : "r", 0xB2 : "s", 0xB3 : "t",
    0xB4 : "u", 0xB5 : "v", 0xB6 : "w", 0xB7 : "x", 0xB8 : "y",
    0xB9 : "z",

    0xE1 : "PK", 0xE2 : "MN", 0xE3 : "-",
    0xE6 : "?", 0xE7 : "!", 0xE8 : ".",

    0xF1 : "*",
    0xF3 : "/", 0xF4 : ",",

    0xF6 : "0", 0xF7 : "1", 0xF8 : "2", 0xF9 : "3", 0xFA : "4",
    0xFB : "5", 0xFC : "6", 0xFD : "7", 0xFE : "8", 0xFF : "9"
};

const CHARACTER_MAP_GEN2 = {
    0x80: 'A', 0x81: 'B', 0x82: 'C', 0x83: 'D', 0x84: 'E', 0x85: 'F', 0x86: 'G', 0x87: 'H',
    0x88: 'I', 0x89: 'J', 0x8A: 'K', 0x8B: 'L', 0x8C: 'M', 0x8D: 'N', 0x8E: 'O', 0x8F: 'P',
    0x90: 'Q', 0x91: 'R', 0x92: 'S', 0x93: 'T', 0x94: 'U', 0x95: 'V', 0x96: 'W', 0x97: 'X',
    0x98: 'Y', 0x99: 'Z', 0x9A: '(', 0x9B: ')', 0x9C: ':', 0x9D: ';', 0x9E: '[', 0x9F: ']',
    0xA0: 'a', 0xA1: 'b', 0xA2: 'c', 0xA3: 'd', 0xA4: 'e', 0xA5: 'f', 0xA6: 'g', 0xA7: 'h',
    0xA8: 'i', 0xA9: 'j', 0xAA: 'k', 0xAB: 'l', 0xAC: 'm', 0xAD: 'n', 0xAE: 'o', 0xAF: 'p',
    0xB0: 'q', 0xB1: 'r', 0xB2: 's', 0xB3: 't', 0xB4: 'u', 0xB5: 'v', 0xB6: 'w', 0xB7: 'x',
    0xB8: 'y', 0xB9: 'z', 0xBA: '_', 0xBB: '-', 0xBC: '?', 0xBD: '!', 0xBE: '.', 0xBF: '/',
    0x7F: ' ', 0x50: ''
};

const CHARACTER_MAP_GEN3 = {
    0x00: ' ', 0xBB: 'A', 0xBC: 'B', 0xBD: 'C', 0xBE: 'D', 0xBF: 'E',
    0xC0: 'F', 0xC1: 'G', 0xC2: 'H', 0xC3: 'I', 0xC4: 'J', 0xC5: 'K',
    0xC6: 'L', 0xC7: 'M', 0xC8: 'N', 0xC9: 'O', 0xCA: 'P', 0xCB: 'Q',
    0xCC: 'R', 0xCD: 'S', 0xCE: 'T', 0xCF: 'U', 0xD0: 'V', 0xD1: 'W',
    0xD2: 'X', 0xD3: 'Y', 0xD4: 'Z', 0xD5: 'a', 0xD6: 'b', 0xD7: 'c',
    0xD8: 'd', 0xD9: 'e', 0xDA: 'f', 0xDB: 'g', 0xDC: 'h', 0xDD: 'i',
    0xDE: 'j', 0xDF: 'k', 0xE0: 'l', 0xE1: 'm', 0xE2: 'n', 0xE3: 'o',
    0xE4: 'p', 0xE5: 'q', 0xE6: 'r', 0xE7: 's', 0xE8: 't', 0xE9: 'u',
    0xEA: 'v', 0xEB: 'w', 0xEC: 'x', 0xED: 'y', 0xEE: 'z',
    0xA1: '0', 0xA2: '1', 0xA3: '2', 0xA4: '3', 0xA5: '4', 0xA6: '5',
    0xA7: '6', 0xA8: '7', 0xA9: '8', 0xAA: '9',
    0xAB: '!', 0xAC: '?', 0xAD: '.', 0xAE: '-', 0xB5: '♂', 0xB6: '♀',
    0x2E: '.', 0xFF: ''
};

function parseGen1(buffer) {
    const view = new DataView(buffer);

    function getTextString(offset, size) {
        let output = "";
        for (let i = 0; i < size; i++) {
            const code = view.getUint8(offset + i);
            if (code === 0x50) break; // string terminator
            output += CHARACTER_MAP_GEN1[code] || '';
        }
        return output;
    }

    function getPokedexList(offset) {
        const seen = new Set();
        const caught = new Set();
        for (let i = 0; i < 19; i++) {
            const byte = view.getUint8(offset + i);
            for (let j = 0; j < 8; j++) {
                const pokemonId = i * 8 + j + 1;
                if ((byte >> j) & 1) {
                    if (offset === 0x25B6) { // Seen list
                        seen.add(pokemonId);
                    } else { // Owned list
                        caught.add(pokemonId);
                    }
                }
            }
        }
        return offset === 0x25B6 ? [...seen] : [...caught];
    }

    const trainerName = getTextString(0x2598, 8);
    const rivalName = getTextString(0x25F6, 8);
    const seen = getPokedexList(0x25B6);
    const caught = getPokedexList(0x25A3);

    return {
        trainerName,
        rivalName,
        team: [], // Placeholder
        badges: [], // Placeholder
        seen,
        caught
    };
}


// Gen 3 save files are composed of 14 sections (4KB each).
// This function identifies the most recent save of each section.
function parseFireRed(buffer) {
    const view = new DataView(buffer);

    // A save file is 128KB, containing two 64KB save blocks for redundancy.
    // Each block has 14 sections of 4KB. We need to find the most recent block.
    const getSectionSaveIndex = (offset) => view.getUint32(offset + 0xFFC, true);

    const saveIndexA = getSectionSaveIndex(0); // Save index of first section in block A
    const saveIndexB = getSectionSaveIndex(65536); // Save index of first section in block B

    const activeBlockOffset = saveIndexA > saveIndexB ? 0 : 65536;
    const activeBuffer = buffer.slice(activeBlockOffset, activeBlockOffset + 65536);
    const activeView = new DataView(activeBuffer);

    const sections = new Map();
    for (let i = 0; i < 14; i++) {
        const offset = i * 4096;
        const sectionId = activeView.getUint16(offset + 0xFF4, true);
        sections.set(sectionId, offset);
    }

    const trainerInfoOffset = sections.get(0);
    const teamItemsOffset = sections.get(1);
    const pokedexOffset = sections.get(4);

    let trainerName = '';
    for (let i = 0; i < 7; i++) {
        const charCode = activeView.getUint8(trainerInfoOffset + 0x08 + i);
        if (charCode === 0xFF) break;
        trainerName += CHARACTER_MAP_GEN3[charCode] || '';
    }

    let rivalName = '';
     for (let i = 0; i < 7; i++) {
        const charCode = activeView.getUint8(teamItemsOffset + 0x204 + i);
        if (charCode === 0xFF) break;
        rivalName += CHARACTER_MAP_GEN3[charCode] || '';
    }

    const badges = [];
    const badgeByte = activeView.getUint8(trainerInfoOffset + 0x2A);
    for (let i = 0; i < 8; i++) {
        if ((badgeByte >> i) & 1) {
            badges.push(i + 1);
        }
    }

    const team = [];
    const partyCount = activeView.getUint32(teamItemsOffset + 0x234, true);
    for (let i = 0; i < partyCount; i++) {
        const pokemonOffset = teamItemsOffset + 0x238 + i * 100;
        const species = activeView.getUint16(pokemonOffset + 0x20, true);
        if (species === 0) continue;
        team.push({
            species,
            level: activeView.getUint8(pokemonOffset + 0x54),
        });
    }

    const seen = new Set();
    for (let i = 0; i < 49; i++) { // 386+ Pokemon / 8 bits per byte
        const seenByte = activeView.getUint8(pokedexOffset + 0x5C + i);
        for (let j = 0; j < 8; j++) {
            const pokemonId = i * 8 + j + 1;
            if (pokemonId > 386) continue;
            if ((seenByte >> j) & 1) {
                seen.add(pokemonId);
            }
        }
    }

    const caught = new Set();
    for (let i = 0; i < 49; i++) {
        const caughtByte = activeView.getUint8(pokedexOffset + 0x28 + i);
        for (let j = 0; j < 8; j++) {
            const pokemonId = i * 8 + j + 1;
            if (pokemonId > 386) continue;
            if ((caughtByte >> j) & 1) {
                caught.add(pokemonId);
            }
        }
    }
    caught.forEach(id => seen.add(id));

    return {
        trainerName,
        rivalName,
        team,
        badges,
        seen: [...seen],
        caught: [...caught]
    };
}

function parseCrystal(buffer) {
    const view = new DataView(buffer);

    // Trainer Name in Gen 2 is at a fixed offset.
    let trainerName = '';
    for (let i = 0; i < 11; i++) {
        const charCode = view.getUint8(0x2009 + i);
        if (charCode === 0x50) break; // End of string terminator
        trainerName += CHARACTER_MAP_GEN2[charCode] || '';
    }

    // Pokédex data in Gen 2.
    const seen = new Set();
    const caught = new Set();

    for (let i = 0; i < 32; i++) {
        const seenByte = view.getUint8(0x23E9 + i);
        const caughtByte = view.getUint8(0x2409 + i);
        for (let j = 0; j < 8; j++) {
            const pokemonId = i * 8 + j + 1;
            if ((caughtByte >> j) & 1) {
                caught.add(pokemonId);
            }
            if ((seenByte >> j) & 1) {
                seen.add(pokemonId);
            }
        }
    }

    // A caught pokemon is also a seen pokemon
    caught.forEach(id => seen.add(id));

    // Badge data in Gen 2 is a single byte bitfield.
    const badgeByte = view.getUint8(0x205E);
    const badges = [];
    for (let i = 0; i < 8; i++) {
        if ((badgeByte >> i) & 1) {
            badges.push(i + 1);
        }
    }

    return {
        trainerName,
        team: [], // Placeholder
        badges,
        seen: [...seen],
        caught: [...caught]
    };
}

function parseBlack(buffer) {
    const view = new DataView(buffer);
    const decoder = new TextDecoder('utf-16le');

    // Trainer Name in Gen 5 is stored in UTF-16 Little Endian.
    const trainerNameBytes = new Uint8Array(buffer, 0x19400 + 4, 14);
    const trainerName = decoder.decode(trainerNameBytes).replace(/\0/g, '');

    // Pokédex data in Gen 5.
    const seen = new Set();
    const caught = new Set();
    const pokedexOffset = 0x21600;
    const caughtOffset = pokedexOffset + 0x8;
    const seenOffset = caughtOffset + 0x54;

    for (let i = 0; i < 82; i++) {
        const seenByte = view.getUint8(seenOffset + i);
        const caughtByte = view.getUint8(caughtOffset + i);
        for (let j = 0; j < 8; j++) {
            const pokemonId = i * 8 + j + 1;
            if ((caughtByte >> j) & 1) {
                caught.add(pokemonId);
            }
            if ((seenByte >> j) & 1) {
                seen.add(pokemonId);
            }
        }
    }

    caught.forEach(id => seen.add(id));

    return {
        trainerName,
        team: [], // Placeholder
        badges: [], // Placeholder
        seen: [...seen],
        caught: [...caught]
    };
}

function parseNDS(buffer, game) {
    const view = new DataView(buffer);

    const blockPosition = [
        0, 1, 2, 3, 0, 1, 3, 2, 0, 2, 1, 3, 0, 3, 1, 2,
        0, 2, 3, 1, 0, 3, 2, 1, 1, 0, 2, 3, 1, 0, 3, 2,
        2, 0, 1, 3, 3, 0, 1, 2, 2, 0, 3, 1, 3, 0, 2, 1,
        1, 2, 0, 3, 1, 3, 0, 2, 2, 1, 0, 3, 3, 1, 0, 2,
        2, 3, 0, 1, 3, 2, 0, 1, 1, 2, 3, 0, 1, 3, 2, 0,
        2, 1, 3, 0, 3, 1, 2, 0, 2, 3, 1, 0, 3, 2, 1, 0
    ];

    function shuffleArray(data, sv, blockSize) {
        const sdata = new Uint8Array(data.length);
        const index = sv * 4;
        sdata.set(data.slice(0, 8), 0);
        const end = 8 + (blockSize * 4);
        sdata.set(data.slice(end), end);
        for (let block = 0; block < 4; block++) {
            const dest = sdata.subarray(8 + (blockSize * block), 8 + (blockSize * (block + 1)));
            const ofs = blockPosition[index + block];
            const src = data.subarray(8 + (blockSize * ofs), 8 + (blockSize * (ofs + 1)));
            dest.set(src);
        }
        return sdata;
    }

    function cryptArray(data, seed) {
        let currentSeed = seed;
        for (let i = 0; i < data.length; i += 2) {
            currentSeed = (0x41C64E6D * currentSeed + 0x6073) >>> 0;
            const xor = (currentSeed >> 16) & 0xFFFF;
            const val = view.getUint16(data.byteOffset + i, true);
            view.setUint16(data.byteOffset + i, val ^ xor, true);
        }
    }

    function decryptArray45(ekm) {
        const ekmView = new DataView(ekm.buffer, ekm.byteOffset, ekm.byteLength);
        const pv = ekmView.getUint32(0, true);
        const chk = ekmView.getUint16(6, true);
        const sv = (pv >> 13) & 31;

        const blockSize = 32;
        const start = 8;
        const end = (4 * blockSize) + start;

        const tempEkm = new Uint8Array(ekm);
        cryptArray(tempEkm.subarray(start, end), chk);
        if (tempEkm.length > end) {
            cryptArray(tempEkm.subarray(end), pv);
        }

        return shuffleArray(tempEkm, sv, blockSize);
    }

    let generalSize, trainerInfoOffset, partyOffset;

    if (game === 'diamond' || game === 'pearl') {
        generalSize = 0xC100;
        trainerInfoOffset = 0x64;
        partyOffset = 0x98;
    } else if (game === 'platinum') {
        generalSize = 0xCF2C;
        trainerInfoOffset = 0x68;
        partyOffset = 0xA0;
    } else if (game === 'heartgold' || game === 'soulsilver') {
        generalSize = 0xF628;
        trainerInfoOffset = 0x64;
        partyOffset = 0x98;
    } else {
        // Should not happen
        return {
            trainerName: 'NDS Trainer',
            team: [],
            badges: [],
            seen: [],
            caught: []
        };
    }

    const generalBlock = new Uint8Array(buffer, 0, generalSize);
    const trainerName = new TextDecoder('utf-16le').decode(generalBlock.subarray(trainerInfoOffset, trainerInfoOffset + 14)).replace(/\0/g, '');

    const team = [];
    for (let i = 0; i < 6; i++) {
        const pokemonOffset = partyOffset + i * 236;
        const encryptedPokemon = generalBlock.subarray(pokemonOffset, pokemonOffset + 236);
        const decryptedPokemon = decryptArray45(encryptedPokemon);
        const decryptedView = new DataView(decryptedPokemon.buffer);
        const species = decryptedView.getUint16(8, true);
        if (species === 0) continue;
        team.push({
            species,
            level: decryptedView.getUint8(0x8C),
        });
    }

    return {
        trainerName,
        team,
        badges: [],
        seen: [],
        caught: []
    };
}

export function parseSaveFile(file, game) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const buffer = event.target.result;
                let parsedData;

                switch (game) {
                    case 'red':
                    case 'blue':
                    case 'yellow':
                        parsedData = parseGen1(buffer);
                        break;
                    case 'firered':
                    case 'leafgreen':
                        parsedData = parseFireRed(buffer);
                        break;
                    case 'crystal':
                        parsedData = parseCrystal(buffer);
                        break;
                    case 'diamond':
                    case 'pearl':
                    case 'platinum':
                    case 'heartgold':
                    case 'soulsilver':
                        parsedData = parseNDS(buffer);
                        break;
                    case 'black':
                    case 'white':
                    case 'black-2':
                    case 'white-2':
                        parsedData = parseBlack(buffer);
                        break;
                    default:
                        // Provide a default structure for unimplemented games
                        console.warn(`Parsing for ${game} is not yet implemented.`);
                        parsedData = {
                            trainerName: 'Ash',
                            team: [],
                            badges: [],
                            seen: [],
                            caught: []
                        };
                }
                resolve(parsedData);
            } catch (error) {
                console.error(`Error parsing ${game} save file:`, error);
                reject(new Error(`Failed to parse save file. It might be corrupted or an unsupported format.`));
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}