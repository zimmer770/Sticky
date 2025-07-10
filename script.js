// ========================================
// CARD WORKSPACE APPLICATION
// A simple drag-and-drop card organizer
// ========================================

// ----------------------------------------
// 1. GLOBAL CONFIGURATION & DATA STORAGE
// ----------------------------------------

// This object holds all our app's settings and card data
const appConfig = {
  // Array to store all our cards and their properties
  cards: [
    {
      id: "card-1",
      title: "How to Use?",
      content:
        "Click and drag any card to move it around. Cards can be placed freely anywhere on the screen",
      position: { x: 100, y: 100 },
      zIndex: 1,
    },
    {
      id: "card-2",
      title: "What matters now?",
      content:
        "Identify your top priority today. Keep it visible, actionable, and small.",
      position: { x: 450, y: 150 },
      zIndex: 2,
    },
    {
      id: "card-3",
      title: "Idea in progress!",
      content:
        "What if we approached this differently? — Use this space to explore raw thoughts.",
      position: { x: 200, y: 300 },
      zIndex: 3,
    },
    {
      id: "card-4",
      title: "Looped Thought!",
      content:
        "Recurring pattern or belief? Examine it. Is it still serving you?",
      position: { x: 500, y: 350 },
      zIndex: 4,
    },
  ],

  // Keep track of the highest z-index (for layering cards on top of each other)
  maxZIndex: 4,
};

// ----------------------------------------
// 2. DRAG & DROP STATE MANAGEMENT
// ----------------------------------------

// This object tracks what's happening during drag operations
let dragState = {
  isDragging: false, // Are we currently dragging something?
  draggedCard: null, // Which card element is being dragged?
  mouseOffset: { x: 0, y: 0 }, // Where did the user click on the card?
};

// ----------------------------------------
// 3. CARD CREATION AND POSITIONING
// ----------------------------------------

/**
 * Creates a single card element with all its HTML and styling
 * @param {Object} cardData - The data for this card (title, content, etc.)
 * @returns {HTMLElement} - The created card element
 */
function createCard(cardData) {
  // Create a new div element for our card
  const card = document.createElement("div");

  // Add CSS class for styling
  card.className = "info-card";
  card.id = cardData.id;

  // Set basic styles that JavaScript needs to control
  card.style.position = "absolute";
  card.style.left = cardData.position.x + "px";
  card.style.top = cardData.position.y + "px";
  card.style.width = "300px"; // Fixed width like original
  card.style.height = "auto"; // Auto height to fit content
  card.style.maxHeight = "400px"; // Maximum height limit
  card.style.zIndex = cardData.zIndex;
  card.style.cursor = "grab";
  card.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";

  // Add the HTML content inside the card
  card.innerHTML = `
    <button class="remove-button" onclick="removeCard('${cardData.id}')" title="Remove card">
      ×
    </button>
    <h3 class="card-title">${cardData.title}</h3>
    <p class="card-content">${cardData.content}</p>
  `;

  // Add event listeners for drag functionality
  setupCardEvents(card);

  // Add the card to the webpage
  document.body.appendChild(card);

  return card;
}

/**
 * Creates all cards from our data array
 */
function createAllCards() {
  // Loop through each card in our data array
  appConfig.cards.forEach((cardData) => {
    createCard(cardData);
  });
}

/**
 * Generates a random position for new cards
 * @returns {Object} - Object with x and y coordinates
 */
function getRandomPosition() {
  return {
    x: Math.random() * (window.innerWidth - 300), // Leave space for card width (300px)
    y: Math.random() * (window.innerHeight - 400) + 50, // Leave space for card height (400px max)
  };
}

// ----------------------------------------
// 4. DRAG AND DROP FUNCTIONALITY
// ----------------------------------------

/**
 * Sets up all the event listeners needed for dragging a card
 * @param {HTMLElement} card - The card element to make draggable
 */
function setupCardEvents(card) {
  // When mouse is pressed down on card, start dragging
  card.addEventListener("mousedown", startDrag);

  // Prevent the default drag behavior (we're making our own)
  card.addEventListener("dragstart", (e) => e.preventDefault());

  // Add hover effects when mouse enters card
  card.addEventListener("mouseenter", () => {
    if (!dragState.isDragging) {
      card.style.transform = "translateY(-3px)";
      card.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
    }
  });

  // Remove hover effects when mouse leaves card
  card.addEventListener("mouseleave", () => {
    if (!dragState.isDragging) {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
    }
  });
}

/**
 * Starts the drag operation when user clicks on a card
 * @param {Event} event - The mouse event
 */
function startDrag(event) {
  // Don't start dragging if user clicked the remove button
  if (event.target.classList.contains("remove-button")) {
    return;
  }

  event.preventDefault();

  const card = event.currentTarget;

  // Bring this card to the front
  bringCardToFront(card.id);

  // Calculate where the mouse is relative to the card's top-left corner
  const cardRect = card.getBoundingClientRect();
  const mouseOffset = {
    x: event.clientX - cardRect.left,
    y: event.clientY - cardRect.top,
  };

  // Update our drag state
  dragState = {
    isDragging: true,
    draggedCard: card,
    mouseOffset: mouseOffset,
  };

  // Change the card's appearance while dragging
  card.style.cursor = "grabbing";
  card.style.transform = "rotate(2deg) scale(1.05)";
  card.style.boxShadow = "0 15px 30px rgba(0,0,0,0.25)";
  card.style.transition = "none"; // Remove transition for smooth dragging
}

/**
 * Handles mouse movement during drag operation
 * @param {Event} event - The mouse event
 */
function handleDrag(event) {
  // Only do something if we're actually dragging
  if (!dragState.isDragging || !dragState.draggedCard) return;

  const card = dragState.draggedCard;

  // Calculate new position based on mouse position minus offset
  const newX = event.clientX - dragState.mouseOffset.x;
  const newY = event.clientY - dragState.mouseOffset.y;

  // Update card position
  card.style.left = newX + "px";
  card.style.top = newY + "px";
}

/**
 * Stops the drag operation when user releases mouse
 */
function stopDrag() {
  // Only do something if we're actually dragging
  if (!dragState.isDragging || !dragState.draggedCard) return;

  const card = dragState.draggedCard;

  // Restore card's normal appearance
  card.style.cursor = "grab";
  card.style.transform = "rotate(0deg) scale(1)";
  card.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
  card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";

  // Update our data with the new position
  updateCardPosition(card);

  // Save the current state
  saveToStorage();

  // Reset drag state
  dragState = {
    isDragging: false,
    draggedCard: null,
    mouseOffset: { x: 0, y: 0 },
  };
}

/**
 * Brings a card to the front by giving it the highest z-index
 * @param {string} cardId - The ID of the card to bring forward
 */
function bringCardToFront(cardId) {
  // Find the card data
  const cardData = appConfig.cards.find((card) => card.id === cardId);
  if (!cardData) return;

  // Increase the maximum z-index and assign it to this card
  appConfig.maxZIndex++;
  cardData.zIndex = appConfig.maxZIndex;

  // Update the actual element
  const cardElement = document.getElementById(cardId);
  if (cardElement) {
    cardElement.style.zIndex = appConfig.maxZIndex;
  }
}

/**
 * Updates the position data for a card after it's been moved
 * @param {HTMLElement} card - The card element that was moved
 */
function updateCardPosition(card) {
  // Find the card data
  const cardData = appConfig.cards.find((data) => data.id === card.id);

  if (cardData) {
    // Update the position in our data
    cardData.position = {
      x: parseInt(card.style.left),
      y: parseInt(card.style.top),
    };
  }
}

// ----------------------------------------
// 5. CARD MANAGEMENT (Add/Remove)
// ----------------------------------------

/**
 * Removes a card from the workspace
 * @param {string} cardId - The ID of the card to remove
 */
function removeCard(cardId) {
  // Find and remove the visual element
  const cardElement = document.getElementById(cardId);
  if (cardElement) {
    // Add a nice animation before removing
    cardElement.style.transition = "all 0.3s ease";
    cardElement.style.transform = "scale(0.8) rotate(5deg)";
    cardElement.style.opacity = "0";

    // Actually remove it after animation
    setTimeout(() => {
      cardElement.remove();
    }, 300);
  }

  // Remove from our data array
  const cardIndex = appConfig.cards.findIndex((card) => card.id === cardId);
  if (cardIndex !== -1) {
    appConfig.cards.splice(cardIndex, 1);
  }

  // Save the updated state
  saveToStorage();
}

/**
 * Shows a dialog to add a new card
 */
function showAddCardDialog() {
  // Get input from user
  const title = prompt("Enter card title:");
  if (!title) return;

  const content = prompt("Enter card content:");
  if (!content) return;

  // Create new card data
  const newCardData = {
    id: `card-${Date.now()}`, // Use timestamp for unique ID
    title: title,
    content: content,
    position: getRandomPosition(),
    zIndex: ++appConfig.maxZIndex,
  };

  // Add to our data array
  appConfig.cards.push(newCardData);

  // Create the visual card
  const newCard = createCard(newCardData);

  // Add entrance animation
  newCard.style.transform = "scale(0.8) translateY(-20px)";
  newCard.style.opacity = "0";

  setTimeout(() => {
    newCard.style.transition = "all 0.4s ease";
    newCard.style.transform = "scale(1) translateY(0)";
    newCard.style.opacity = "1";
  }, 100);

  // Save the updated state
  saveToStorage();
}

// ----------------------------------------
// 6. DATA PERSISTENCE (Save/Load)
// ----------------------------------------

/**
 * Saves current workspace state to browser's local storage
 */
function saveToStorage() {
  try {
    const workspaceData = {
      cards: appConfig.cards,
      maxZIndex: appConfig.maxZIndex,
      timestamp: Date.now(),
    };

    localStorage.setItem("cardWorkspace", JSON.stringify(workspaceData));
  } catch (error) {
    console.error("Failed to save workspace:", error);
  }
}

/**
 * Loads workspace state from browser's local storage
 */
function loadFromStorage() {
  try {
    const saved = localStorage.getItem("cardWorkspace");
    if (saved) {
      const workspaceData = JSON.parse(saved);

      if (workspaceData.cards && Array.isArray(workspaceData.cards)) {
        // Replace our default data with saved data
        appConfig.cards = workspaceData.cards;
        appConfig.maxZIndex = workspaceData.maxZIndex || 4;

        // Remove any existing cards and create new ones
        document
          .querySelectorAll(".info-card")
          .forEach((card) => card.remove());
        createAllCards();
      }
    }
  } catch (error) {
    console.error("Failed to load workspace:", error);
  }
}

/**
 * Resets workspace to default state
 */
function resetWorkspace() {
  const confirmed = confirm(
    "Reset workspace? This will remove all custom cards."
  );
  if (!confirmed) return;

  // Remove all current cards
  document.querySelectorAll(".info-card").forEach((card) => {
    card.style.transition = "all 0.3s ease";
    card.style.transform = "scale(0.8) rotate(5deg)";
    card.style.opacity = "0";
    setTimeout(() => card.remove(), 300);
  });

  // Reset data to original state
  setTimeout(() => {
    appConfig.cards = [
      {
        id: "card-1",
        title: "How to Use?",
        content:
          "Click and drag any card to move it around. Cards can be placed freely anywhere on the screen",
        position: getRandomPosition(),
        zIndex: 1,
      },
      {
        id: "card-2",
        title: "What matters now?",
        content:
          "Identify your top priority today. Keep it visible, actionable, and small.",
        position: getRandomPosition(),
        zIndex: 2,
      },
      {
        id: "card-3",
        title: "Idea in progress!",
        content:
          "What if we approached this differently? — Use this space to explore raw thoughts.",
        position: getRandomPosition(),
        zIndex: 3,
      },
      {
        id: "card-4",
        title: "Looped Thought!",
        content:
          "Recurring pattern or belief? Examine it. Is it still serving you?",
        position: getRandomPosition(),
        zIndex: 4,
      },
    ];

    appConfig.maxZIndex = 4;
    createAllCards();
    saveToStorage();
  }, 350);
}

// ----------------------------------------
// 7. THEME MANAGEMENT (Dark/Light Mode)
// ----------------------------------------

/**
 * Simple theme manager for dark/light mode
 */
class ThemeManager {
  constructor() {
    this.themeButton = document.querySelector(".theme-toggle");
    this.themeIcon = this.themeButton?.querySelector(".theme-icon");
    this.isDarkMode = false;

    // Only initialize if theme button exists
    if (this.themeButton) {
      this.init();
    }
  }

  init() {
    // Load saved theme or use system preference
    this.loadTheme();

    // Set up click handler for theme toggle
    this.themeButton.addEventListener("click", () => {
      this.toggleTheme();
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    this.saveTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.add("dark-mode");
      if (this.themeIcon) this.themeIcon.textContent = "☽";
      this.themeIcon.style.fontSize = "2rem";
    } else {
      document.body.classList.remove("dark-mode");
      if (this.themeIcon) this.themeIcon.textContent = "✺";
    }
  }

  saveTheme() {
    localStorage.setItem("themePreference", this.isDarkMode ? "dark" : "light");
  }

  loadTheme() {
    const savedTheme = localStorage.getItem("themePreference");

    if (savedTheme) {
      this.isDarkMode = savedTheme === "dark";
    } else {
      // Use system preference if no saved preference
      this.isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
    }

    this.applyTheme();
  }
}

// ----------------------------------------
// 8. EVENT LISTENERS & INITIALIZATION
// ----------------------------------------

/**
 * Sets up all global event listeners
 */
function setupEventListeners() {
  // Mouse events for dragging
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);

  // Button event listeners
  const addButton = document.querySelector(".add-card-button");
  if (addButton) {
    addButton.addEventListener("click", showAddCardDialog);
  }

  const resetButton = document.querySelector(".reset-button");
  if (resetButton) {
    resetButton.addEventListener("click", resetWorkspace);
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (event) => {
    // Don't trigger shortcuts if user is typing in an input
    if (
      event.target.tagName === "INPUT" ||
      event.target.tagName === "TEXTAREA"
    ) {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case "a":
          event.preventDefault();
          showAddCardDialog();
          break;
        case "r":
          event.preventDefault();
          resetWorkspace();
          break;
      }
    }
  });
}

/**
 * Handles window resize to keep cards within bounds
 */
function handleWindowResize() {
  appConfig.cards.forEach((cardData) => {
    // Make sure cards don't go off-screen when window is resized
    const maxX = window.innerWidth - 300; // Card width
    const maxY = window.innerHeight - 400; // Card max height

    // Adjust position if card is off-screen
    if (cardData.position.x > maxX) {
      cardData.position.x = maxX;
    }
    if (cardData.position.y > maxY) {
      cardData.position.y = maxY;
    }

    // Update the visual position of the card
    const cardElement = document.getElementById(cardData.id);
    if (cardElement) {
      cardElement.style.left = cardData.position.x + "px";
      cardElement.style.top = cardData.position.y + "px";
    }
  });

  // Save the updated positions
  saveToStorage();
}
/**
 * Initializes the entire application
 */
function initializeApp() {
  console.log("🌟 Starting Card Workspace Application");

  // Set up all event listeners
  setupEventListeners();

  // Initialize theme manager
  new ThemeManager();

  // Try to load saved data, otherwise use defaults
  loadFromStorage();

  // If no saved data, create default cards
  if (document.querySelectorAll(".info-card").length === 0) {
    createAllCards();
  }

  // Handle window resize to keep cards in bounds
  window.addEventListener("resize", handleWindowResize);

  console.log("✅ Application ready!");
  console.log("💡 Tips:");
  console.log("  - Drag cards to move them around");
  console.log("  - Click × to remove cards");
  console.log("  - Use Ctrl+A to add new cards");
  console.log("  - Use Ctrl+R to reset workspace");
}

// ----------------------------------------
// 9. START THE APPLICATION
// ----------------------------------------

// Wait for the HTML to be fully loaded, then start our app
document.addEventListener("DOMContentLoaded", initializeApp);
