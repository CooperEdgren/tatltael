# Tatl & Tael - A Zelda: Majora's Mask Companion & Smart Dex

Welcome to the Tatl & Tael project! This web application started as a comprehensive companion for *The Legend of Zelda: Majora's Mask* and has expanded to include the **Smart Dex**, a modern Pokedex application. This guide provides a detailed overview of the project's structure, systems, and best practices for development.

## Project Overview

This project is a client-side web application built with HTML, CSS, and vanilla JavaScript. It is designed to be a feature-rich, interactive resource for gamers. The project is divided into two main parts:

1.  **Tatl & Tael**: A companion app for *The Legend of Zelda: Majora's Mask*, providing in-game information like song lists, item locations, and character notebooks.
2.  **Smart Dex**: A modern, full-featured Pokedex application that allows users to browse, track, and learn about Pokemon.

## 1. Tatl & Tael

The "Tatl & Tael" portion of the application is a detailed companion for *Majora's Mask*. It provides players with easy access to essential in-game information, helping them navigate the complexities of the game's three-day cycle.

### Key Features

*   **Ocarina Songs**: A visual reference for all ocarina songs in the game.
*   **Bombers' Notebook**: A digital version of the in-game notebook to track characters and events.
*   **Item & Mask Checklist**: A tool to track collected items and masks.
*   **Stray Fairy & Heart Piece Locator**: Guides for finding all collectibles.
*   **Interactive Maps**: Maps of Termina with key locations and secrets marked.

### File Structure

The core files for the Tatl & Tael app are located in the root directory and the `scripts/` folder.

*   `index.html`: The main entry point for the Majora's Mask companion.
*   `ocarina.html`, `oot.html`: Additional pages for Ocarina of Time content.
*   `style.css`, `ocarina.css`: Main stylesheets for the app.
*   `data/`: Contains JSON files with game data (e.g., `notebook.json`, `items.json`).
*   `scripts/`: Contains the application logic, broken down by feature:
    *   `app.js`: Main application logic.
    *   `song-view.js`, `notebook-view.js`, `items-view.js`, etc.: Modules for rendering different views.
    *   `data.js`: Handles fetching and managing data from the JSON files.

### Development Best Practices

*   **Data-Driven**: All game content is stored in JSON files in the `data/` directory. To add or modify content, edit these files. The application will dynamically render the data.
*   **Modular JavaScript**: Each feature is encapsulated in its own JavaScript file in the `scripts/` directory. When adding a new feature, create a new file and import it into the main `app.js`.
*   **CSS Conventions**: Follow the existing CSS conventions in `style.css`. Use descriptive class names and keep the styling consistent with the game's aesthetic.

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

### Development Best Practices

*   **Modular and Service-Oriented**: The application is divided into modules with clear responsibilities. The `PokemonService` handles data fetching, the `UI` class handles rendering, and `app.js` handles user input and coordination. When adding new features, follow this pattern.
*   **Template-Based UI**: The UI is built using `<template>` elements in `pokedex.html`. To modify a UI component, edit its corresponding template. The `UI` class clones these templates to create new elements.
*   **State Management**: The application state (e.g., the list of all Pokemon) is managed in `scripts/pokedex/state.js`. Avoid storing state directly in the DOM.
*   **API Abstraction**: All interactions with the PokeAPI are handled by the `PokemonService` in `pokemon.js`. This keeps the rest of the application decoupled from the specific API implementation.
*   **Event-Driven Communication**: Use custom events for communication between modules. For example, when the modal is closed, it dispatches a `closeModal` event that `app.js` listens for.

## General Development Guidelines

### Code Style

*   **JavaScript**: Use modern JavaScript (ES6+). Follow a consistent coding style, with clear variable names and comments for complex logic.
*   **CSS**: Use descriptive, kebab-case class names (e.g., `.pokemon-card`).
*   **HTML**: Use semantic HTML5 tags where appropriate.

### Dependencies

This project uses no external libraries or frameworks. It is built with pure HTML, CSS, and JavaScript.

### Getting Started

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/ZeldaSongbook.git
    ```
2.  Open the `index.html` or `pokedex.html` file in your web browser to run the application. Since this is a client-side application, no build step or server is required for basic use.

Thank you for contributing to the Tatl & Tael and Smart Dex project!
