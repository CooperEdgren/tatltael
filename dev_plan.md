# Development Plan: QR Code Scanning & Pokémon Catching Feature

This document outlines the development plan for a new feature that allows users to scan QR codes or barcodes to find Pokémon and then catch them in a mini-game inspired by Pokémon GO.

## 1. Core Feature: QR/Barcode Scanning

### 1.1. Library Integration
- **Objective:** Integrate a reliable, open-source library for QR and barcode scanning.
- **Action:**
    - Research and select a suitable JavaScript library (e.g., `html5-qrcode`, `zxing-js`).
    - Add the library to `pokedex.html`, either via a CDN link or by including it locally.

### 1.2. UI & Workflow
- **Objective:** Create a seamless user flow for initiating a scan.
- **Action:**
    - Add a "Scan" button to the main Pokédex view, likely in the header or as a floating action button.
    - When clicked, the button will open a dedicated scanning view with a camera feed and an overlay to guide the user.
    - On a successful scan, the app will validate the decoded URL. A valid URL should point to a specific Pokémon (e.g., `https://pokeapi.co/api/v2/pokemon/25`).

## 2. Core Feature: Pokémon Catching Mini-Game

### 2.1. Game View
- **Objective:** Create the environment for the catching mini-game.
- **Action:**
    - Design a new "Catch Screen" that displays the wild Pokémon.
    - The Pokémon's animated sprite will be centered on the screen, playing its idle animation on a loop.
    - A 2D sprite of a Pokéball will be rendered at the bottom of the screen.

### 2.2. Throwing Mechanic
- **Objective:** Implement a swipe-to-throw mechanic for the Pokéball.
- **Action:**
    - Add event listeners to the Pokéball sprite to detect a swipe gesture (mousedown/touchstart, mousemove/touchmove, mouseup/touchend).
    - Implement simple physics to calculate the Pokéball's trajectory based on the swipe's speed and angle. The ball should appear to fly towards the Pokémon.

## 3. Core Feature: Catch Animation Sequence

### 3.1. Collision & Capture
- **Objective:** Create a visually engaging animation for a successful catch.
- **Action:**
    - **Collision Detection:** Implement a function to detect when the Pokéball sprite collides with the Pokémon sprite.
    - **Glow & Shrink:** On collision, the Pokémon sprite will flash white, then transform into a white silhouette. This silhouette will rapidly shrink and fly into the Pokéball.
    - **Pokéball Landing:** The Pokéball will then drop to the bottom-center of the screen, creating a small "dust" or "impact" particle effect where it lands.

### 3.2. Shaking & Confirmation
- **Objective:** Build suspense and confirm the catch.
- **Action:**
    - **Shakes:** The Pokéball will shake three times, with a brief pause between each shake.
    - **Confirmation:** After the third shake, the Pokéball will flash, and three golden stars will emerge from the top as a particle effect, indicating a successful catch.

## 4. State Management & UI Flow

### 4.1. Updating Pokédex
- **Objective:** Reflect the results of the encounter in the user's Pokédex.
- **Action:**
    - **Successful Catch:** If the Pokémon is caught, its status will be updated to "Caught" in the tracker. The app will then transition to the Pokémon's details modal.
    - **Scan Only:** If the user scans a Pokémon but chooses not to attempt a catch (e.g., by closing the catch screen), the Pokémon will be marked as "Seen." The app will then open the details modal for that Pokémon.

### 4.2. User Options
- **Objective:** Give the user control over the encounter.
- **Action:**
    - After a successful scan, a prompt will appear with two options: "Catch" or "View Details."
    - "Catch" will initiate the mini-game.
    - "View Details" will mark the Pokémon as "Seen" and open its details modal directly.

This plan provides a comprehensive roadmap for implementing the new scanning and catching feature, ensuring a fun and engaging experience for the user.

---

# Feature Plan: Advanced Save File Parsing

## 1. Introduction & Goal

The current save file parser is functional but limited. It relies on hardcoded memory offsets, extracts only basic data, and is difficult to extend. The goal of this development effort is to re-engineer the parser into a robust, scalable, and comprehensive tool.

This will be achieved by studying the provided reference projects (`PKHeX`, `HTML5PokemonSaveReader`, `PKMDS-Blazor`) and adopting a modern, structure-based parsing approach, likely using **WebAssembly (WASM)** for maximum performance and accuracy.

The final product should be able to extract rich data from save files, including:
-   Full Trainer Info (Name, ID, Money, etc.)
-   Detailed Party Pokémon (Stats, Moves, IVs, EVs, Nature, etc.)
-   PC Box Contents
-   Item Inventory (PC and Bag)
-   Full Pokédex Status (Seen, Caught, Forms, etc.)

## 2. Phase 1: Research & Analysis

The first step is to thoroughly analyze the provided reference projects to understand the underlying logic of Pokémon save files.

-   **`PKHeX` (The "Source of Truth"):**
    -   **Objective:** Understand the data structures.
    -   **Action:** Do not focus on the UI code. Instead, analyze the core C# library. Identify the key classes and structs that define save file layouts (`SAV`), Pokémon data (`PKM`), and inventory blocks for each game generation. This is the blueprint for how data is organized.

-   **`HTML5PokemonSaveReader` (The JavaScript Approach):**
    -   **Objective:** Understand in-browser file handling.
    -   **Action:** Analyze its implementation. How does it use `FileReader` to handle the file upload? How does it use `DataView` and `ArrayBuffer` to read the binary data? Assess which parts of its parsing logic can be reused or adapted, and identify its limitations.

-   **`PKMDS-Blazor` (The WebAssembly Path):**
    -   **Objective:** Understand the C# to WASM pipeline.
    -   **Action:** Investigate how this project compiles C# code to a WASM module that can run in the browser. This serves as the primary architectural model for our new parser.

## 3. Phase 2: Architectural Decision

Based on the research, the following architecture is recommended:

-   **WebAssembly (WASM) is the clear path forward.**
    -   **Why:** Pokémon save files are complex and have many variations. Re-implementing all of this logic in JavaScript would be extremely time-consuming and error-prone. A C# library, compiled to WASM, allows us to leverage the strongly-typed, high-performance nature of C# for the heavy lifting, while using JavaScript for the user interface. This is the approach used by modern tools like `PKMDS-Blazor` and is the most robust solution.

## 4. Phase 3: Implementation Plan

### 4.1. Set Up the WASM Project
-   **Action:** Create a new .NET class library project. This library will contain the core parsing logic, adapted from the principles learned from `PKHeX`. Configure the project to compile to WebAssembly.

### 4.2. Implement the Core C# Parser
-   **Action:**
    -   Define C# classes that mirror the data structures from `PKHeX` (e.g., `SAV8`, `PK8` for Generation 8).
    -   Write a main parser class in C# with a public method that accepts a byte array (the save file) and returns a JSON-serialized string of the parsed data. This keeps the interop with JavaScript simple and clean.

### 4.3. Integrate WASM with the Frontend
-   **Action:**
    -   In `save-parser.js`, load the compiled WASM module.
    -   Modify the `parseSaveFile` function:
        1.  Read the uploaded file into an `ArrayBuffer`.
        2.  Pass the resulting `Uint8Array` to the C# WASM function.
        3.  Receive the JSON string back from WASM.
        4.  Use `JSON.parse()` to convert the string into a JavaScript object.
        5.  Return this object.

### 4.4. Expand the UI
-   **Action:**
    -   The Trainer Card view (`trainer-card.js` and `pokedex.html`) needs to be significantly expanded.
    -   Add new sections to the Trainer Card to display the player's full team, with details like level, stats, and moves.
    -   Consider adding a new view to show the PC boxes and the player's item inventory.

## 5. Conclusion

By leveraging the power of WebAssembly and the proven data structures from projects like `PKHeX`, we can transform the save file parser from a simple tool into a powerful, modern feature. This approach is scalable, maintainable, and will provide a much richer experience for the user.

---

# Feature Plan: Interactive Game Map

## 1. Introduction & Goal

This feature will provide users with a fully interactive, pannable, and zoomable map of a Pokémon game region (e.g., Kanto). Users will be able to see points of interest, filter them by category, and click on them to get more information.

The chosen technology for this is **Leaflet.js**, a lightweight and powerful open-source mapping library. It is ideal for this use case because it excels at handling non-geographical maps (like a game map image) and has a rich ecosystem of plugins.

## 2. Phase 1: Setup and Integration

-   **Objective:** Add Leaflet.js to the project and create the map container.
-   **Action:**
    1.  **Add Leaflet to `pokedex.html`:** Link the Leaflet CSS and JavaScript files in the `<head>` section using a CDN for simplicity.
    2.  **Create Map Container:** Add a new view `div` (e.g., `<div id="map-view" style="display: none;">`) to `pokedex.html`. Inside this, add the map container itself: `<div id="interactive-map" style="height: 100vh;"></div>`.
    3.  **Add Navigation:** Add a "Map" button to the main navigation to allow users to switch to this new view.

## 3. Phase 2: Basic Map Implementation

-   **Objective:** Display the game map image as a pannable, zoomable layer.
-   **Action:**
    1.  **Create `interactive-map.js`:** Create a new JavaScript file to house the map logic.
    2.  **Initialize the Map:**
        -   Use `L.map('interactive-map', ...)` to create the map instance.
        -   **Crucially, set the Coordinate Reference System (CRS) to `L.CRS.Simple`**. This treats the map as a flat plane of pixels, not a geographical sphere.
        -   Set an initial view and zoom level.
    3.  **Add the Map Image:**
        -   Source a high-resolution image of the Kanto region map and add it to the project.
        -   Use `L.imageOverlay('path/to/map.png', bounds).addTo(map);` to place the image on the map. The `bounds` will be a simple `[[0, 0], [imageHeight, imageWidth]]` array.
    4.  **Configure Controls:**
        -   Set `minZoom` and `maxZoom` to prevent the user from zooming too far in or out.
        -   Set `maxBounds` to the image bounds to prevent the user from panning away from the map.

## 4. Phase 3: Adding Markers and Popups

-   **Objective:** Populate the map with interactive points of interest.
-   **Action:**
    1.  **Create Map Data:** Create a `map-data.json` file. This file will contain an array of objects, where each object represents a marker:
        ```json
        [
          {
            "coords": [y, x],
            "type": "city",
            "title": "Pallet Town",
            "description": "A quiet little town where new beginnings are born."
          },
          ...
        ]
        ```
        *(Note: Leaflet uses `[y, x]` for coordinates, which can be counter-intuitive. `y` is the vertical distance from the top, `x` is the horizontal distance from the left.)*
    2.  **Load and Display Markers:**
        -   In `interactive-map.js`, fetch the `map-data.json` file.
        -   Loop through the data and create an `L.marker` for each location at its specified `coords`.
        -   Use `.bindPopup()` to add the `title` and `description` to each marker, which will appear on click.
    3.  **Custom Icons:**
        -   Use `L.icon()` to create custom icons for different marker types (e.g., a small building icon for cities, a cave icon for dungeons).

## 5. Phase 4: Filtering and UI Enhancements

-   **Objective:** Allow users to filter the markers displayed on the map.
-   **Action:**
    1.  **Layer Groups:** Group the markers into `L.layerGroup` based on their `type` (e.g., `cities`, `caves`, `items`).
    2.  **Layer Control:** Add an `L.control.layers` to the map. This will create a control box in the corner of the map that allows users to toggle the visibility of each layer group (e.g., show/hide all "Cities").
    3.  **Add a Search Bar:** (Optional) Add a search input that allows users to filter markers by their title, zooming the map to the corresponding location when a result is selected.

## 6. Conclusion

Using Leaflet.js provides a robust and user-friendly way to create a feature-rich interactive map. This plan breaks down the implementation into manageable phases, starting with a basic map and progressively adding layers of interactivity and control for the user.
