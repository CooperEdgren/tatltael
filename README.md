# Tatl & Tael - A Zelda Companion & Smart Pokedex

Welcome to the Tatl & Tael project! This web application is a feature-rich, client-side application built with vanilla JavaScript, HTML, and CSS. It serves as a comprehensive companion for *The Legend of Zelda: Majora's Mask* and *Ocarina of Time*, and also includes a modern, full-featured Pokedex application called **Smart Dex**.

## Project Overview

This project is divided into two main parts:

1.  **Tatl & Tael**: A companion app for *The Legend of Zelda: Majora's Mask* and *Ocarina of Time*.
2.  **Smart Dex**: A modern, full-featured Pokedex application.




## 1. Tatl & Tael

The "Tatl & Tael" portion of the application is a detailed companion for *Majora's Mask* and *Ocarina of Time*. It provides players with easy access to essential in-game information.

### Key Features

*   **Game Switching**: Seamlessly switch between *Majora's Mask* and *Ocarina of Time* content.
*   **Ocarina Songs**: A visual reference for all ocarina songs in the game.
*   **Bombers' Notebook**: A digital version of the in-game notebook to track characters and events.
*   **Item & Mask Checklist**: A tool to track collected items and masks.
*   **Stray Fairy & Heart Piece Locator**: Guides for finding all collectibles.
*   **Interactive Maps**: Maps of Termina with key locations and secrets marked.
*   **Playable Ocarina**: A separate interactive ocarina that can be played with a keyboard or mouse.

### File Structure

The core files for the Tatl & Tael app are located in the root directory and the `scripts/` folder.

*   `index.html`: The main entry point for the Majora's Mask companion.
*   `oot.html`: The entry point for the Ocarina of Time companion. It shares the same structure as `index.html`.
*   `ocarina.html`: A standalone page for the playable ocarina feature.
*   `style.css`: Main stylesheet for the app.
*   `data/`: Contains JSON files with game data (e.g., `notebook.json`, `items.json`).
*   `scripts/`: Contains the application logic, broken down by feature:
    *   `app.js`: Main application logic.
    *   `song-view.js`, `notebook-view.js`, `items-view.js`, etc.: Modules for rendering different views.
    *   `data.js`: Handles fetching and managing data from the JSON files.
    *   `ui.js`: Handles UI interactions and animations.

## 2. Smart Dex

The Smart Dex is a sophisticated, single-page Pokedex application designed to feel like a modern tool for Pokemon trainers. It is built with a modular, service-oriented architecture.

### Key Features

*   **Interactive Pokedex**: Browse and filter over 1,000 Pokemon.
*   **Detailed Pokemon View**: A modal view with comprehensive data, including stats, abilities, evolution chains, and type effectiveness.
*   **Advanced Filtering & Searching**: Filter Pokemon by generation, type, and tracking status (seen, caught, favorite).
*   **Trainer Card**: A personal profile that tracks Pokedex completion, team, and badges, with data saved to local storage.
*   **Save File Integration**: Upload a game save file to automatically update the Trainer Card and Pokedex.
*   **Pokemon Comparison**: A side-by-side comparison tool for two Pokemon.
*   **Catch Rate Calculator**: An interactive tool to calculate the probability of catching a Pokemon.

### File Structure

The Smart Dex is self-contained within the `pokedex.html` file and the `scripts/pokedex/` directory.

*   `pokedex.html`: The single-page entry point for the Smart Dex. It contains the HTML structure and templates for all UI components.
*   `css/pokedex.css`: The dedicated stylesheet for the Smart Dex.
*   `scripts/pokedex/`: Contains the modular JavaScript for the application:
    *   `app.js`: The main entry point that orchestrates the application.
    *   `pokemon.js`: A service for fetching data from the PokeAPI.
    *   `ui.js`: A class responsible for all DOM manipulation and UI rendering.
    *   `trainer-card.js`: Manages the Trainer Card feature.
    *   `filter.js`, `filter-manager.js`: Handles filtering logic.
    *   `modal.js`: Manages the detailed Pokemon view modal.
    *   `save-parser.js`: Logic for parsing uploaded save files.
    *   `cache.js`, `state.js`, `constants.js`: Utility modules for caching, state management, and constants.

## Getting Started

This is a client-side application and can be run by opening the HTML files in a browser. However, due to browser security restrictions on local files (CORS), it's recommended to use a local web server for development.

1.  Clone the repository:
    ```bash
    git clone https://github.com/CooperEdgren/ZeldaSongbook.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd ZeldaSongbook
    ```
3.  Start a local web server. A simple way is to use Python's built-in server:
    ```bash
    python3 -m http.server
    ```
4.  Open your browser and navigate to `http://localhost:8000`.

## Dependencies

This project uses a few external libraries, which are included via CDN:

*   **Tailwind CSS**: A utility-first CSS framework used for styling the Zelda companion.
*   **Howler.js**: An audio library for the web, used for sound effects and music.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and ensure the code is clean and well-commented.
4.  Test your changes thoroughly.
5.  Submit a pull request with a clear description of your changes.

### Code Style

*   **JavaScript**: Use modern JavaScript (ES6+). Follow a consistent coding style, with clear variable names and comments for complex logic.
*   **CSS**: Use descriptive, kebab-case class names (e.g., `.pokemon-card`).
*   **HTML**: Use semantic HTML5 tags where appropriate.