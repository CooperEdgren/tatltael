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

## 1. Current Architecture & Goal

The save file parsing system is built on a modern technical stack designed for performance and accuracy.

-   **Core Engine:** It uses the industry-standard `PKHeX.Core` C# library, which is the most comprehensive and accurate Pokémon save file parsing engine available.
-   **Technology:** The C# logic is compiled to WebAssembly (WASM) using Blazor, allowing the powerful C# code to run directly in the browser.
-   **Wrapper Model:** The `SaveParser.Wasm` C# project acts as a thin wrapper. Its sole purpose is to receive a save file from the JavaScript front-end and hand it off to `PKHeX.Core`. The `scripts/pokedex/save-parser.js` file handles the browser-side file reading.

The goal is to create a seamless experience where a user can upload any valid Pokémon save file (including common emulator formats like `.dsv`) and have it parsed correctly.

## 2. Current Roadblock

The system is currently non-functional due to a critical issue in the communication layer between the JavaScript front-end and the C# WASM back-end.

-   **The Problem:** When the JavaScript `parseSaveFile` function calls the C# `ParseSaveFile` method via Blazor's JS Interop (`DotNet.invokeMethodAsync`), the call fails.
-   **The Error:** The browser console shows a `System.Text.Json.JsonException: Unexpected JSON Property...` error. This indicates that the way Blazor is serializing the arguments (specifically the large `Uint8Array` of the save file) in JavaScript is not compatible with what the C# method expects on the other side. The data is becoming corrupted or malformed during the serialization process.

This is not a `PKHeX.Core` issue. The C# code is correct, but it never gets a chance to execute because the data transfer fails before the method is invoked.

## 3. Path Forward: Recommended Next Steps

The next developer must focus exclusively on solving the Blazor JS Interop serialization issue.

1.  **Investigate Blazor Serialization:**
    -   **Action:** Research the specific mechanisms Blazor uses to serialize complex JavaScript objects (especially those containing `Uint8Array`) into JSON for C# consumption.
    -   **Focus:** Look for required C# attributes (like `[JsonPropertyName("...")]` in the `FileInput` class) or specific JavaScript object structures that Blazor's serializer expects. The mismatch is likely due to a subtle, undocumented requirement, possibly related to case sensitivity or property ordering.

2.  **Explore Alternative Data Transfer Methods:**
    -   If direct object passing remains problematic, consider a more primitive but robust transfer method as a fallback.
    -   **Action:** Modify the JavaScript to convert the `Uint8Array` into a Base64 string before sending it. Modify the C# method to accept this string and then decode it back into a `byte[]` array.
    -   **Trade-offs:** This method is less efficient due to the overhead of Base64 encoding/decoding, but it is highly likely to bypass the complex object serialization issue entirely, as it only involves passing a simple string.

3.  **Verify Blazor Configuration and Version:**
    -   **Action:** Review the project's Blazor and .NET version (`net8.0`). Check for any known JS Interop bugs or breaking changes in that specific version.
    -   **Focus:** Ensure all NuGet packages are correctly restored and that the project configuration (`SaveParser.Wasm.csproj`) is sound.

By tackling the JS-to-C# data transfer issue directly, the existing, powerful `PKHeX.Core` implementation can be unlocked, making the save file parser fully functional.


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
