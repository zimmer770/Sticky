/*
 * ====================================================================
 * CARD WORKSPACE APPLICATION
 * ====================================================================
 *
 * This is a drag-and-drop card workspace where you can:
 * - Create, move, and delete cards
 * - Drag cards anywhere on the screen
 * - Save your workspace layout automatically
 * - Reset to default cards
 *
 * BEGINNER NOTES:
 * - const/let: Ways to declare variables (const = can't change, let = can change)
 * - function: A block of code that does a specific task
 * - addEventListener: Tells the browser to run code when something happens (like a click)
 * - document: Represents the entire webpage
 * - element: A piece of the webpage (like a div, button, etc.)
 * ====================================================================
 */

// ====================================================================
// CONFIGURATION - This holds all our app's settings and data
// ====================================================================

/*
 * CONFIG object stores all our application settings and card data
 * Think of it as the "brain" that remembers everything about our cards
 */
const CONFIG = {
  // Array (list) of all our cards with their information
  cardData: [
    {
      id: "card-1", // Unique identifier for this card
      title: "How to Use?",
      content:
        "Click and drag any card to move it around, Cards can be placed freely anywhere on the screen",
      freePosition: {
        // Where the card should appear on screen
        x: Math.random() * (window.innerWidth - 500), // Random X position
        y: Math.random() * (window.innerHeight - 500) + 100, // Random Y position
      },
    },
    {
      id: "card-2",
      title: "What matters now?",
      content:
        "Identify your top priority today. Keep it visible, actionable, and small.",
      freePosition: {
        x: Math.random() * (window.innerWidth - 500),
        y: Math.random() * (window.innerHeight - 500) + 100,
      },
    },
    {
      id: "card-3",
      title: "Idea in progress!",
      content:
        "What if we approached this differently? — Use this space to explore raw thoughts.",
      freePosition: {
        x: Math.random() * (window.innerWidth - 500),
        y: Math.random() * (window.innerHeight - 500) + 100,
      },
    },
    {
      id: "card-4",
      title: "Looped Thought!",
      content:
        "Recurring pattern or belief? Examine it. Is it still serving you?",
      freePosition: {
        x: Math.random() * (window.innerWidth - 500),
        y: Math.random() * (window.innerHeight - 500) + 100,
      },
    },
  ],
};

// ====================================================================
// DRAG STATE - Keeps track of what's being dragged
// ====================================================================

/*
 * dragState object keeps track of drag-and-drop information
 * This is like a "memory" of what's currently being dragged
 */
let dragState = {
  isDragging: false, // true/false - is something being dragged right now?
  draggedCard: null, // Which card is being dragged (null = none)
  startPosition: null, // Where the mouse was when dragging started
  offset: { x: 0, y: 0 }, // Distance from mouse to card's top-left corner
};

// ====================================================================
// INITIALIZATION FUNCTIONS - Set up the app when it loads
// ====================================================================

/*
 * initializeWorkspace() - The main function that starts everything
 * This runs when the page loads and sets up the entire application
 */
function initializeWorkspace() {
  console.log("Starting workspace initialization...");

  // Step 1: Create all the cards and put them on the page
  createAllCards();

  // Step 2: Set up event listeners (tell browser what to do when things happen)
  setupEventListeners();

  // Step 3: Set up the "Add Card" button
  setupAddCardButton();

  // Step 4: Set up the "Reset" button
  setupResetButton();

  // Step 5: Load any saved data from previous sessions
  loadFromLocalStorage();

  console.log("Workspace initialized successfully!");
}

/*
 * createAllCards() - Creates all cards from the CONFIG data
 * This loops through each card in our CONFIG and creates it on the page
 */
function createAllCards() {
  console.log("Creating all cards...");

  // forEach loops through each item in an array
  CONFIG.cardData.forEach((cardData, index) => {
    // Create a single card element
    const card = createSingleCard(cardData);

    // Position it on the screen
    positionCard(card, cardData);

    console.log(`Created card: ${cardData.title}`);
  });
}

// ====================================================================
// CARD CREATION FUNCTIONS - Build individual cards
// ====================================================================

/*
 * createSingleCard() - Creates one card element with all its features
 * Takes cardData (an object with id, title, content) and returns a DOM element
 */
function createSingleCard(cardData) {
  // Create a new div element (this will be our card)
  const card = document.createElement("div");

  // Set the CSS class for styling
  card.className = "info-card";

  // Give it a unique ID so we can find it later
  card.id = cardData.id;

  // Add smooth transition effects for buttery animations
  card.style.transition = "transform 0.2s ease-out, box-shadow 0.2s ease-out";
  card.style.cursor = "grab"; // Show grab cursor when hovering

  // Set the HTML content inside the card
  // Template literals (backticks) let us insert variables with ${}
  card.innerHTML = `
        <button class="remove-button" onclick="removeCard('${cardData.id}')" title="Remove card">×</button>
        <h3 class="card-title">${cardData.title}</h3>
        <p class="card-content">${cardData.content}</p>
    `;

  // Set up drag-and-drop functionality for this card
  setupCardDragEvents(card);

  return card; // Return the completed card element
}

// ====================================================================
// CARD POSITIONING FUNCTIONS - Put cards in the right places
// ====================================================================

/*
 * positionCard() - Puts a card in its correct position on the screen
 * Takes a card element and its data, then positions it
 */
function positionCard(card, cardData) {
  positionCardFreely(card, cardData.freePosition);
}

/*
 * positionCardFreely() - Positions a card at specific x,y coordinates
 * This makes the card "float" freely on the screen
 */
function positionCardFreely(card, freePosition) {
  // Set CSS positioning properties
  card.style.position = "absolute"; // Position relative to the page
  card.style.left = freePosition.x + "px"; // X coordinate
  card.style.top = freePosition.y + "px"; // Y coordinate
  card.style.width = "280px"; // Fixed width
  card.style.height = "180px"; // Fixed height

  // Add the card to the page body
  document.body.appendChild(card);
}

// ====================================================================
// DRAG AND DROP FUNCTIONALITY - Make cards draggable
// ====================================================================

/*
 * setupCardDragEvents() - Adds drag functionality to a card
 * This makes the card respond to mouse events for dragging
 */
function setupCardDragEvents(card) {
  // When mouse is pressed down on the card, start dragging
  card.addEventListener("mousedown", startDragging);

  // Prevent default drag behavior (we want our custom drag)
  card.addEventListener("dragstart", (e) => e.preventDefault());

  // Add hover effects for better user experience
  card.addEventListener("mouseenter", () => {
    // Only show hover effect if we're not currently dragging
    if (!dragState.isDragging) {
      card.style.transform = "translateY(-2px)"; // Lift up slightly
      card.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)"; // Bigger shadow
    }
  });

  // Remove hover effects when mouse leaves
  card.addEventListener("mouseleave", () => {
    if (!dragState.isDragging) {
      card.style.transform = "translateY(0)"; // Back to normal position
      card.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)"; // Normal shadow
    }
  });
}

/*
 * setupEventListeners() - Sets up page-wide event listeners
 * These listen for mouse events anywhere on the page
 */
function setupEventListeners() {
  console.log("🎯 Setting up event listeners...");

  // Listen for mouse movement anywhere on the page
  document.addEventListener("mousemove", handleMouseMovement);

  // Listen for mouse button release anywhere on the page
  document.addEventListener("mouseup", stopDragging);

  // Prevent default drag behavior
  document.addEventListener("dragstart", (e) => e.preventDefault());
}

/*
 * startDragging() - Begins a drag operation when mouse is pressed
 * This function runs when you click and hold on a card
 */
function startDragging(event) {
  // Don't start dragging if clicking on the remove button
  if (event.target.classList.contains("remove-button")) {
    return;
  }

  // Prevent default browser behavior
  event.preventDefault();
  console.log("🖱️ Starting drag operation...");

  // Get the card that was clicked
  const card = event.currentTarget;

  // Get the card's position and size on the screen
  const cardRect = card.getBoundingClientRect();

  // Calculate offset from mouse to card's top-left corner
  // This keeps the card in the same position relative to the mouse
  const offset = {
    x: event.clientX - cardRect.left, // Distance from mouse to left edge
    y: event.clientY - cardRect.top, // Distance from mouse to top edge
  };

  // Update our drag state to remember what's being dragged
  dragState = {
    isDragging: true,
    draggedCard: card,
    startPosition: { x: event.clientX, y: event.clientY },
    offset: offset,
  };

  // Style the card to show it's being dragged
  card.style.transition = "none"; // Disable transitions during drag for smoothness
  card.style.cursor = "grabbing"; // Change cursor to grabbing
  card.style.transform = "rotate(2deg) scale(1.05)"; // Slight rotate and scale
  card.style.boxShadow = "0 15px 30px rgba(0,0,0,0.25)"; // Bigger shadow
  card.style.zIndex = "1000"; // Bring to front

  // Change page cursor to grabbing
  document.body.style.cursor = "grabbing";
}

/*
 * handleMouseMovement() - Moves the card as the mouse moves
 * This function runs continuously while dragging
 */
function handleMouseMovement(event) {
  // Only do something if we're actually dragging a card
  if (!dragState.isDragging || !dragState.draggedCard) return;

  const card = dragState.draggedCard;

  // Calculate new position based on mouse position and offset
  const newX = event.clientX - dragState.offset.x;
  const newY = event.clientY - dragState.offset.y;

  // Use requestAnimationFrame for smooth animation
  // This makes the movement buttery smooth
  requestAnimationFrame(() => {
    card.style.left = newX + "px";
    card.style.top = newY + "px";
  });
}

/*
 * stopDragging() - Ends the drag operation when mouse is released
 * This function runs when you let go of the mouse button
 */
function stopDragging(event) {
  // Only do something if we're actually dragging
  if (!dragState.isDragging || !dragState.draggedCard) return;

  console.log("🛑 Stopping drag operation...");

  const card = dragState.draggedCard;

  // Reset the card's styling with smooth transitions
  card.style.transition = "transform 0.3s ease-out, box-shadow 0.3s ease-out";
  card.style.cursor = "grab";
  card.style.transform = "rotate(0deg) scale(1)"; // Back to normal
  card.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)"; // Normal shadow
  card.style.zIndex = "auto"; // Normal layer

  // Update our data with the new position
  updateCardDataPosition(card, {
    x: parseInt(card.style.left), // Convert string to number
    y: parseInt(card.style.top),
  });

  // Save the new layout to browser storage
  saveToLocalStorage();

  // Clean up drag state
  cleanupAfterDrag();

  // Add a subtle "drop" animation for nice feedback
  setTimeout(() => {
    card.style.transform = "translateY(-3px)"; // Lift up briefly
    setTimeout(() => {
      card.style.transform = "translateY(0)"; // Settle down
    }, 100);
  }, 50);
}

/*
 * updateCardDataPosition() - Updates the stored position data for a card
 * This keeps our CONFIG data in sync with the visual positions
 */
function updateCardDataPosition(card, freePosition) {
  // Find the card data that matches this card element
  const cardData = CONFIG.cardData.find((data) => data.id === card.id);

  if (cardData) {
    // Update the position in our data
    cardData.freePosition = freePosition;
  }
}

/*
 * cleanupAfterDrag() - Resets drag state after dragging is complete
 * This "forgets" what was being dragged and resets everything
 */
function cleanupAfterDrag() {
  console.log("🧹 Cleaning up after drag...");

  // Remove any drag-related styling
  if (dragState.draggedCard) {
    dragState.draggedCard.classList.remove("dragging");
  }

  // Reset page cursor
  document.body.style.cursor = "";

  // Reset drag state to "nothing is being dragged"
  dragState = {
    isDragging: false,
    draggedCard: null,
    startPosition: null,
    offset: { x: 0, y: 0 },
  };
}

// ====================================================================
// CARD MANAGEMENT FUNCTIONS - Add, remove, and modify cards
// ====================================================================

/*
 * removeCard() - Deletes a card from the workspace
 * This function runs when you click the × button on a card
 */
function removeCard(cardId) {
  console.log(`🗑️ Removing card: ${cardId}`);

  // Prevent the click from bubbling up to parent elements
  event?.stopPropagation();

  // Find the card element on the page
  const cardElement = document.getElementById(cardId);
  if (cardElement) {
    // Add smooth exit animation before removing
    cardElement.style.transition = "all 0.3s ease-out";
    cardElement.style.transform = "scale(0.8) rotate(5deg)"; // Shrink and rotate
    cardElement.style.opacity = "0"; // Fade out

    // Actually remove the element after animation completes
    setTimeout(() => {
      cardElement.remove();
    }, 300);
  }

  // Remove the card from our data array
  const cardIndex = CONFIG.cardData.findIndex((card) => card.id === cardId);
  if (cardIndex !== -1) {
    CONFIG.cardData.splice(cardIndex, 1); // Remove 1 item at cardIndex
    console.log(`✅ Card ${cardId} removed from data`);
  }

  // Save the updated data
  saveToLocalStorage();
  showRemovalFeedback();
}

/*
 * showRemovalFeedback() - Shows feedback when a card is removed
 * This could be expanded to show a toast notification or other feedback
 */
function showRemovalFeedback() {
  console.log("💫 Card removed successfully!");
  // You could add a toast notification here in the future
}

// ====================================================================
// BUTTON SETUP FUNCTIONS - Initialize interactive buttons
// ====================================================================

/*
 * setupAddCardButton() - Makes the "Add Card" button work
 * This finds the button and tells it what to do when clicked
 */
function setupAddCardButton() {
  console.log("➕ Setting up add card button...");

  // Find the add button on the page
  const addButton = document.getElementById("addCardButton");
  if (addButton) {
    // Tell the button to run showAddCardDialog when clicked
    addButton.addEventListener("click", showAddCardDialog);
  }
}

/*
 * setupResetButton() - Makes the "Reset" button work
 * This button will restore the workspace to its original state
 */
function setupResetButton() {
  console.log("🔄 Setting up reset button...");

  // Find the reset button on the page
  const resetButton = document.getElementById("resetButton");
  if (resetButton) {
    // Tell the button to run resetToDefault when clicked
    resetButton.addEventListener("click", resetToDefault);
  }
}

/*
 * showAddCardDialog() - Shows a dialog to create a new card
 * This function runs when you click the "Add Card" button
 */
function showAddCardDialog() {
  console.log("📝 Showing add card dialog...");

  // Ask the user for card information using simple prompts
  const title = prompt("Enter card title:");
  if (!title) return; // Exit if user cancels or enters nothing

  const content = prompt("Enter card content:");
  if (!content) return; // Exit if user cancels or enters nothing

  // Create new card data object
  const newCardData = {
    id: `card-${Date.now()}`, // Use timestamp for unique ID
    title: title,
    content: content,
    freePosition: {
      // Random position so it doesn't overlap existing cards
      x: Math.random() * (window.innerWidth - 300),
      y: Math.random() * (window.innerHeight - 200) + 100,
    },
  };

  // Add the new card to our data
  CONFIG.cardData.push(newCardData);

  // Create and position the card on the page
  const newCard = createSingleCard(newCardData);
  positionCard(newCard, newCardData);

  // Add smooth entrance animation
  newCard.style.transform = "scale(0.8) translateY(-20px)";
  newCard.style.opacity = "0";

  // Animate in after a brief delay
  setTimeout(() => {
    newCard.style.transition =
      "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    newCard.style.transform = "scale(1) translateY(0)";
    newCard.style.opacity = "1";
  }, 100);

  // Save the updated workspace
  saveToLocalStorage();

  console.log("✅ New card added successfully!");
}

// ====================================================================
// RESET FUNCTIONALITY - Restore workspace to default state
// ====================================================================

/*
 * resetToDefault() - Resets the workspace to its original 4 cards
 * This function runs when you click the "Reset" button
 */
function resetToDefault() {
  console.log("🔄 Resetting workspace to default state...");

  // Ask user to confirm they want to reset (this will delete all their cards)
  const confirmed = confirm(
    "Are you sure you want to reset the workspace? This will remove all custom cards and restore the original 4 cards."
  );

  if (!confirmed) {
    console.log("❌ Reset cancelled by user");
    return; // Exit if user cancels
  }

  // Remove all existing cards from the page
  document.querySelectorAll(".info-card").forEach((card) => {
    // Add exit animation before removing
    card.style.transition = "all 0.3s ease-out";
    card.style.transform = "scale(0.8) rotate(5deg)";
    card.style.opacity = "0";

    // Remove after animation
    setTimeout(() => {
      card.remove();
    }, 300);
  });

  // Wait for exit animations to complete, then restore default cards
  setTimeout(() => {
    // Reset CONFIG to original default cards
    CONFIG.cardData = [
      {
        id: "card-1",
        title: "How to Use?",
        content:
          "Click and drag any card to move it around, Cards can be placed freely anywhere on the screen",
        freePosition: {
          x: Math.random() * (window.innerWidth - 500),
          y: Math.random() * (window.innerHeight - 500) + 100,
        },
      },
      {
        id: "card-2",
        title: "What matters now?",
        content:
          "Identify your top priority today. Keep it visible, actionable, and small.",
        freePosition: {
          x: Math.random() * (window.innerWidth - 500),
          y: Math.random() * (window.innerHeight - 500) + 100,
        },
      },
      {
        id: "card-3",
        title: "Idea in progress!",
        content:
          "What if we approached this differently? — Use this space to explore raw thoughts.",
        freePosition: {
          x: Math.random() * (window.innerWidth - 500),
          y: Math.random() * (window.innerHeight - 500) + 100,
        },
      },
      {
        id: "card-4",
        title: "Looped Thought!",
        content:
          "Recurring pattern or belief? Examine it. Is it still serving you?",
        freePosition: {
          x: Math.random() * (window.innerWidth - 500),
          y: Math.random() * (window.innerHeight - 500) + 100,
        },
      },
    ];

    // Create the default cards with entrance animations
    CONFIG.cardData.forEach((cardData, index) => {
      const card = createSingleCard(cardData);
      positionCard(card, cardData);

      // Stagger the entrance animations
      card.style.transform = "scale(0.8) translateY(-20px)";
      card.style.opacity = "0";

      setTimeout(() => {
        card.style.transition =
          "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        card.style.transform = "scale(1) translateY(0)";
        card.style.opacity = "1";
      }, index * 100 + 100); // Stagger by 100ms for each card
    });

    // Save the reset state
    saveToLocalStorage();

    console.log("✅ Workspace reset to default successfully!");
  }, 350); // Wait for exit animations to complete
}

// ====================================================================
// LOCAL STORAGE FUNCTIONS - Save and load workspace state
// ====================================================================

/*
 * saveToLocalStorage() - Saves the current workspace to browser storage
 * This lets the workspace remember its state between page reloads
 */
function saveToLocalStorage() {
  try {
    // Create an object with our data and a timestamp
    const workspaceData = {
      cardData: CONFIG.cardData,
      timestamp: Date.now(), // When this was saved
    };

    // Convert to JSON string and save to localStorage
    localStorage.setItem("cardWorkspace", JSON.stringify(workspaceData));
    console.log("💾 Workspace saved to localStorage");
  } catch (error) {
    // If saving fails (maybe browser doesn't support it), log the error
    console.error("❌ Failed to save to localStorage:", error);
  }
}

/*
 * loadFromLocalStorage() - Loads previously saved workspace state
 * This runs when the page loads to restore the previous session
 */
function loadFromLocalStorage() {
  try {
    // Try to get saved data from localStorage
    const saved = localStorage.getItem("cardWorkspace");
    if (saved) {
      // Parse the JSON string back into an object
      const workspaceData = JSON.parse(saved);

      // Check if the data is valid
      if (workspaceData.cardData && Array.isArray(workspaceData.cardData)) {
        // Replace our current data with the saved data
        CONFIG.cardData = workspaceData.cardData;
        console.log("📂 Workspace loaded from localStorage");

        // Remove any existing cards and recreate from saved data
        document
          .querySelectorAll(".info-card")
          .forEach((card) => card.remove());
        createAllCards();
      }
    }
  } catch (error) {
    // If loading fails, log the error but continue with defaults
    console.error("❌ Failed to load from localStorage:", error);
  }
}

/*
 * clearLocalStorage() - Clears all saved workspace data
 * This is a utility function for debugging or complete reset
 */
function clearLocalStorage() {
  localStorage.removeItem("cardWorkspace");
  console.log("🗑️ LocalStorage cleared");
}

// ====================================================================
// UTILITY FUNCTIONS - Helper functions for debugging and maintenance
// ====================================================================

/*
 * getWorkspaceState() - Displays current workspace state in console
 * This is useful for debugging - you can call this in browser console
 */
function getWorkspaceState() {
  console.log("📊 Current workspace state:");
  console.table(CONFIG.cardData); // Shows data in a nice table format
  return CONFIG.cardData;
}

/*
 * resetWorkspace() - Randomizes positions of existing cards
 * This is different from resetToDefault - it keeps current cards but moves them
 */
function resetWorkspace() {
  console.log("🔄 Resetting workspace positions...");

  // Remove all cards from the page
  document.querySelectorAll(".info-card").forEach((card) => {
    card.remove();
  });

  // Give each card a new random position
  CONFIG.cardData.forEach((cardData) => {
    cardData.freePosition = {
      x: Math.random() * (window.innerWidth - 300),
      y: Math.random() * (window.innerHeight - 200) + 100,
    };
  });

  // Recreate all cards with new positions
  createAllCards();
  saveToLocalStorage();

  console.log("✅ Workspace positions reset complete!");
}

/*
 * handleWindowResize() - Adjusts card positions when window is resized
 * This prevents cards from going off-screen when the window gets smaller
 */
function handleWindowResize() {
  console.log("📱 Handling window resize...");

  // Check each card's position
  CONFIG.cardData.forEach((cardData) => {
    if (cardData.freePosition) {
      // Make sure the card doesn't go off the right edge
      cardData.freePosition.x = Math.min(
        cardData.freePosition.x,
        window.innerWidth - 300
      );

      // Make sure the card doesn't go off the bottom edge
      cardData.freePosition.y = Math.min(
        cardData.freePosition.y,
        window.innerHeight - 200
      );

      // Update the card's position on screen
      const card = document.getElementById(cardData.id);
      if (card) {
        card.style.left = cardData.freePosition.x + "px";
        card.style.top = cardData.freePosition.y + "px";
      }
    }
  });

  // Save the adjusted positions
  saveToLocalStorage();
}

// ====================================================================
// KEYBOARD SHORTCUTS - Convenient keyboard commands
// ====================================================================

/*
 * setupKeyboardShortcuts() - Sets up keyboard shortcuts for power users
 * This lets you use keyboard commands instead of clicking buttons
 */
function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (event) => {
    // Don't interfere if user is typing in an input field
    if (
      event.target.tagName === "INPUT" ||
      event.target.tagName === "TEXTAREA"
    ) {
      return;
    }

    // Check which key was pressed
    switch (event.key) {
      case "r":
        // Ctrl+R or Cmd+R - Reset workspace positions
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault(); // Prevent page reload
          resetWorkspace();
        }
        break;

      case "a":
        // Ctrl+A or Cmd+A - Add new card
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault(); // Prevent select all
          showAddCardDialog();
        }
        break;

      case "s":
        // Ctrl+S or Cmd+S - Save and show current state
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault(); // Prevent browser save dialog
          console.log("💾 Workspace state saved to console");
          getWorkspaceState();
          saveToLocalStorage();
        }
        break;

      case "d":
        // Ctrl+D or Cmd+D - Reset to default
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          resetToDefault();
        }
        break;
    }
  });
}

// ====================================================================
// APPLICATION STARTUP - This runs when the page loads
// ====================================================================

/*
 * DOMContentLoaded event - Waits for the page to fully load before starting
 * This ensures all HTML elements are ready before we try to use them
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌟 DOM Content Loaded - Starting Application");

  // Initialize the entire workspace
  initializeWorkspace();

  // Set up keyboard shortcuts
  setupKeyboardShortcuts();

  // Handle window resizing
  window.addEventListener("resize", handleWindowResize);

  // Show helpful information in the console
  console.log("🎉 Workspace Application Ready!");
  console.log("💡 Tips:");
  console.log("  - Drag cards around to organize them");
  console.log("  - Click the × button to remove cards");
  console.log("  - Use Ctrl+A to add a new card");
  console.log("  - Use Ctrl+R to reset card positions");
  console.log("  - Use Ctrl+D to reset to default cards");
  console.log("  - Use Ctrl+S to save current state");
  console.log("  - Call getWorkspaceState() to see all card data");
  console.log("  - Call resetWorkspace() to randomize positions");
  console.log("  - Call clearLocalStorage() to clear saved data");
  console.log("  - Call resetToDefault() to restore original cards");
});

/*
 * ====================================================================
 * END OF APPLICATION
 * ====================================================================
 *
 * BEGINNER SUMMARY:
 *
 * This application works by:
 * 1. Creating card elements and adding them to the webpage
 * 2. Listening for mouse events (click, move, release)
 * 3. Updating card positions as you drag them
 * 4. Saving the layout to browser storage
 * 5. Loading the saved layout when you reload the page
 *
 * Key concepts you learned:
 * - DOM manipulation (creating and moving elements)
 * - Event handling (responding to user actions)
 * - Local storage (saving data in the browser)
 * - CSS positioning and animations
 * - Object-oriented thinking (organizing data and functions)
 */
