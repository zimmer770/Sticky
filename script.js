/*
=====================================================
MODULAR WORKSPACE - BEGINNER-FRIENDLY JAVASCRIPT
=====================================================

This file contains all the JavaScript code that makes the workspace interactive.
We'll go through each section step by step to understand how it works.

Key Concepts You'll Learn:
- How to store data in objects and arrays
- How to manipulate the DOM (Document Object Model)
- How to handle user interactions (mouse events)
- How to create smooth animations and transitions
- How to organize code into reusable functions
*/

// ==========================================
// CONFIGURATION AND DATA STORAGE
// ==========================================

/*
This CONFIG object stores all the settings and data for our workspace.
Think of it like a filing cabinet that holds all the information about
our cards and grid layout.
*/

const CONFIG = {
  // Grid settings - how many rows and columns our grid has
  gridSize: {
    rows: 2, // 3 rows
    cols: 2, // 3 columns
  },

  // Array of card data - each card is an object with properties
  cardData: [
    {
      id: "card-1", // Unique identifier
      title: "How to Use?", // Card title
      content:
        "Click and drag any card to move it around, Drop cards on the grid to organize them, Cards can be placed freely anywhere on the screen",
      // Random position on screen
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
        "What if we approached this differently?” — Use this space to explore raw thoughts.",
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

// ==========================================
// DRAG AND DROP STATE MANAGEMENT
// ==========================================

/*
This object keeps track of what's happening during a drag operation.
It's like a notebook where we write down important information while
the user is dragging a card around.
*/

let dragState = {
  isDragging: false, // Are we currently dragging something?
  draggedCard: null, // Which card is being dragged?
  startPosition: null, // Where did the drag start?
  offset: { x: 0, y: 0 }, // How far from card's corner did user click?
  originalParent: null, // Where was the card before dragging?
};

// ==========================================
// MAIN INITIALIZATION FUNCTION
// ==========================================

/*
This function runs when the page loads and sets up everything.
It's like the main conductor of an orchestra, coordinating all the parts.
*/

function initializeWorkspace() {
  console.log("Starting workspace initialization...");

  // Step 1: Create all the cards
  createAllCards();

  // Step 2: Set up event listeners (make things interactive)
  setupEventListeners();

  // Step 3: Set up the add card button
  setupAddCardButton();

  console.log("Workspace initialized successfully!");
}

// ==========================================
// CARD CREATION FUNCTIONS
// ==========================================

/*
This function creates all the cards based on our CONFIG data.
It's like a factory that produces cards according to our specifications.
*/

function createAllCards() {
  console.log("Creating all cards...");

  // Loop through each card in our config data
  CONFIG.cardData.forEach((cardData, index) => {
    // Create the card element
    const card = createSingleCard(cardData);

    // Position the card where it should be
    positionCard(card, cardData);

    console.log(`Created card: ${cardData.title}`);
  });
}

/*
This function creates a single card element.
It's like a template that builds each card with all its parts.
*/

function createSingleCard(cardData) {
  // Create the main card element
  const card = document.createElement("div");

  // Add CSS classes for styling
  card.className = `info-card card-${cardData.type}`;

  // Set the unique ID
  card.id = cardData.id;

  // Build the HTML content inside the card
  card.innerHTML = `
        <h3 class="card-title">${cardData.title}</h3>
        <p class="card-content">${cardData.content}</p>
    `;

  // Make the card draggable by adding event listeners
  setupCardDragEvents(card);

  return card;
}

/*
This function positions a card either in the grid or freely on the page.
It's like deciding where to place a piece on a board game.
*/

function positionCard(card, cardData) {
  if (cardData.freePosition) {
    // Position the card freely on the page
    positionCardFreely(card, cardData.freePosition);
  } else if (cardData.position) {
    // Position the card in a grid cell
    positionCardInGrid(card, cardData.position);
  }
}

/*
This function positions a card freely anywhere on the page.
*/

function positionCardFreely(card, freePosition) {
  // Add CSS class for free positioning
  card.classList.add("free-position");

  // Set the exact position
  card.style.left = freePosition.x + "px";
  card.style.top = freePosition.y + "px";

  // Set fixed dimensions
  card.style.width = "280px";
  card.style.height = "180px";

  // Add to the page body
  document.body.appendChild(card);
}

/*
This function positions a card in a specific grid cell.
*/

function positionCardInGrid(card, gridPosition) {
  // Find the target grid cell
  const targetCell = document.getElementById(
    `cell-${gridPosition.row}-${gridPosition.col}`
  );

  if (targetCell) {
    // Add the card to the cell
    targetCell.appendChild(card);

    // Store the grid position in the card
    card.dataset.row = gridPosition.row;
    card.dataset.col = gridPosition.col;
  }
}

// ==========================================
// DRAG AND DROP EVENT HANDLING
// ==========================================

/*
This function sets up all the drag and drop event listeners.
It's like teaching the cards how to respond to mouse movements.
*/

function setupCardDragEvents(card) {
  // When user presses mouse button down on card
  card.addEventListener("mousedown", startDragging);

  // Prevent default drag behavior
  card.addEventListener("dragstart", (e) => e.preventDefault());
}

/*
This function sets up global event listeners that work anywhere on the page.
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
This function starts the dragging process when user clicks on a card.
*/

function startDragging(event) {
  // Prevent default behavior
  event.preventDefault();

  console.log("🖱️ Starting drag operation...");

  // Get the card that was clicked
  const card = event.currentTarget;

  // Get the card's position and size
  const cardRect = card.getBoundingClientRect();

  // Store all the important information about this drag
  dragState = {
    isDragging: true,
    draggedCard: card,
    startPosition: { x: event.clientX, y: event.clientY },
    offset: {
      x: event.clientX - cardRect.left, // How far from left edge
      y: event.clientY - cardRect.top, // How far from top edge
    },
    originalParent: card.parentElement,
    wasInGrid: card.parentElement.classList.contains("grid-cell"),
  };

  // Convert the card to free positioning for smooth dragging
  convertCardToFreePosition(card, cardRect);

  // Add visual feedback
  card.classList.add("dragging");
  document.body.style.cursor = "grabbing";
}

/*
This function converts a card to free positioning so it can be dragged smoothly.
*/

function convertCardToFreePosition(card, cardRect) {
  // Add the free-position class
  card.classList.add("free-position");

  // Set the exact position where the card currently is
  card.style.left = cardRect.left + "px";
  card.style.top = cardRect.top + "px";
  card.style.width = "280px";
  card.style.height = "180px";

  // Move the card to the body so it can move freely
  document.body.appendChild(card);
}

/*
This function handles mouse movement while dragging.
*/

function handleMouseMovement(event) {
  // Only do something if we're currently dragging
  if (!dragState.isDragging || !dragState.draggedCard) return;

  const card = dragState.draggedCard;

  // Calculate where the card should be positioned
  const newX = event.clientX - dragState.offset.x;
  const newY = event.clientY - dragState.offset.y;

  // Update the card's position
  card.style.left = newX + "px";
  card.style.top = newY + "px";

  // Show visual feedback for potential drop targets
  showDropTargetFeedback(event.clientX, event.clientY);
}

/*
This function handles when the user releases the mouse button.
*/

function stopDragging(event) {
  // Only do something if we were dragging
  if (!dragState.isDragging || !dragState.draggedCard) return;

  console.log("🛑 Stopping drag operation...");

  const card = dragState.draggedCard;

  // Check if the card was dropped on a grid cell
  const dropTarget = findGridCellUnderMouse(event.clientX, event.clientY);

  if (dropTarget) {
    // Card was dropped on grid - snap it to the grid
    snapCardToGrid(card, dropTarget);
  } else {
    // Card was dropped in empty space - leave it there
    finalizeCardFreePosition(card);
  }

  // Clean up the dragging state
  cleanupAfterDrag();
}

// ==========================================
// DROP TARGET DETECTION AND FEEDBACK
// ==========================================

/*
This function provides visual feedback showing where the card can be dropped.
*/

function showDropTargetFeedback(mouseX, mouseY) {
  // Remove previous feedback
  document.querySelectorAll(".drop-target").forEach((cell) => {
    cell.classList.remove("drop-target");
  });

  // Find the grid cell under the mouse
  const targetCell = findGridCellUnderMouse(mouseX, mouseY);

  if (targetCell) {
    // Highlight the target cell
    targetCell.classList.add("drop-target");
  }
}

/*
This function finds which grid cell is under the mouse cursor.
*/

function findGridCellUnderMouse(mouseX, mouseY) {
  // Get all grid cells
  const gridCells = document.querySelectorAll(".grid-cell");

  // Check each cell to see if mouse is over it
  for (let cell of gridCells) {
    const cellRect = cell.getBoundingClientRect();

    // Check if mouse is inside this cell's boundaries
    if (
      mouseX >= cellRect.left &&
      mouseX <= cellRect.right &&
      mouseY >= cellRect.top &&
      mouseY <= cellRect.bottom
    ) {
      return cell;
    }
  }

  return null; // No cell found under mouse
}

// ==========================================
// CARD POSITIONING AND SNAPPING
// ==========================================

/*
This function snaps a card to a grid cell.
*/

function snapCardToGrid(card, targetCell) {
  console.log("📌 Snapping card to grid...");

  // Check if the target cell already has a card
  const existingCard = targetCell.querySelector(".info-card:not(.dragging)");

  if (existingCard) {
    // There's already a card here - swap their positions
    swapCardPositions(card, existingCard);
  } else {
    // Cell is empty - just move the card here
    moveCardToGridCell(card, targetCell);
  }
}

/*
This function moves a card to a specific grid cell.
*/

function moveCardToGridCell(card, targetCell) {
  // Remove free positioning styles
  card.classList.remove("free-position");
  card.style.left = "";
  card.style.top = "";
  card.style.width = "";
  card.style.height = "";

  // Update the card's grid position data
  card.dataset.row = targetCell.dataset.row;
  card.dataset.col = targetCell.dataset.col;

  // Add the card to the target cell
  targetCell.appendChild(card);

  // Update our data storage
  updateCardDataPosition(card, {
    row: parseInt(targetCell.dataset.row),
    col: parseInt(targetCell.dataset.col),
  });

  // Add visual feedback
  showCardPlacementFeedback(card);
}

/*
This function swaps the positions of two cards.
*/

function swapCardPositions(card1, card2) {
  console.log("🔄 Swapping card positions...");

  // Get the parent containers
  const card1Parent = card1.parentElement;
  const card2Parent = card2.parentElement;

  // Move each card to the other's position
  moveCardToGridCell(card1, card2Parent);
  moveCardToGridCell(card2, card1Parent);
}

/*
This function finalizes a card's free position when it's not dropped on the grid.
*/

function finalizeCardFreePosition(card) {
  console.log("🎯 Finalizing free position...");

  // Remove dragging visual effects
  card.classList.remove("dragging");

  // Update our data storage with the new position
  updateCardDataPosition(card, null, {
    x: parseInt(card.style.left),
    y: parseInt(card.style.top),
  });

  // Add visual feedback
  showCardPlacementFeedback(card);
}

/*
This function updates the stored data for a card's position.
*/

function updateCardDataPosition(card, gridPosition, freePosition) {
  // Find the card's data in our CONFIG
  const cardData = CONFIG.cardData.find((data) => data.id === card.id);

  if (cardData) {
    if (gridPosition) {
      // Card is in grid
      cardData.position = gridPosition;
      cardData.freePosition = null;
    } else {
      // Card is in free position
      cardData.position = null;
      cardData.freePosition = freePosition;
    }
  }
}

/*
This function shows a brief animation when a card is placed.
*/

function showCardPlacementFeedback(card) {
  card.classList.add("placed");
  setTimeout(() => {
    card.classList.remove("placed");
  }, 500);
}

// ==========================================
// CLEANUP AND RESET FUNCTIONS
// ==========================================

/*
This function cleans up after a drag operation is complete.
*/

function cleanupAfterDrag() {
  console.log("🧹 Cleaning up after drag...");

  // Remove visual effects from the dragged card
  if (dragState.draggedCard) {
    dragState.draggedCard.classList.remove("dragging");
  }

  // Remove drop target highlights
  document.querySelectorAll(".drop-target").forEach((cell) => {
    cell.classList.remove("drop-target");
  });

  // Reset cursor
  document.body.style.cursor = "";

  // Reset drag state
  dragState = {
    isDragging: false,
    draggedCard: null,
    startPosition: null,
    offset: { x: 0, y: 0 },
    originalParent: null,
    wasInGrid: false,
  };
}

// ==========================================
// ADD NEW CARD FUNCTIONALITY
// ==========================================

/*
This function sets up the "Add Card" button functionality.
*/

function setupAddCardButton() {
  console.log("➕ Setting up add card button...");

  const addButton = document.getElementById("addCardButton");

  if (addButton) {
    addButton.addEventListener("click", showAddCardDialog);
  }
}

/*
This function shows a dialog for adding a new card.
*/

function showAddCardDialog() {
  console.log("📝 Showing add card dialog...");

  // Simple prompt for now - in a real app, this would be a nice modal
  const title = prompt("Enter card title:");
  if (!title) return;

  const content = prompt("Enter card content:");
  if (!content) return;

  // Create new card data
  const newCardData = {
    id: `card-${Date.now()}`, // Unique ID based on timestamp
    title: title,
    content: content,
    type: "idea", // Default type
    position: null,
    freePosition: {
      x: Math.random() * (window.innerWidth - 300),
      y: Math.random() * (window.innerHeight - 200) + 100,
    },
  };

  // Add to our data storage
  CONFIG.cardData.push(newCardData);

  // Create and display the card
  const newCard = createSingleCard(newCardData);
  positionCard(newCard, newCardData);

  // Add entrance animation
  newCard.classList.add("new-card");

  console.log("✅ New card added successfully!");
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/*
This function gets the current state of all cards for debugging.
*/

function getWorkspaceState() {
  console.log("📊 Current workspace state:");
  console.table(CONFIG.cardData);
  return CONFIG.cardData;
}

/*
This function resets all cards to their original positions.
*/

function resetWorkspace() {
  console.log("🔄 Resetting workspace...");

  // Remove all existing cards
  document.querySelectorAll(".info-card").forEach((card) => {
    card.remove();
  });

  // Regenerate random positions
  CONFIG.cardData.forEach((cardData) => {
    cardData.position = null;
    cardData.freePosition = {
      x: Math.random() * (window.innerWidth - 300),
      y: Math.random() * (window.innerHeight - 200) + 100,
    };
  });

  // Recreate all cards
  createAllCards();

  console.log("✅ Workspace reset complete!");
}

// ==========================================
// RESPONSIVE DESIGN HELPERS
// ==========================================

/*
This function handles window resize events.
*/

function handleWindowResize() {
  console.log("📱 Handling window resize...");

  // Update free-positioned cards to stay within bounds
  CONFIG.cardData.forEach((cardData) => {
    if (cardData.freePosition) {
      // Make sure cards don't go off-screen
      cardData.freePosition.x = Math.min(
        cardData.freePosition.x,
        window.innerWidth - 300
      );
      cardData.freePosition.y = Math.min(
        cardData.freePosition.y,
        window.innerHeight - 200
      );

      // Update the actual card position
      const card = document.getElementById(cardData.id);
      if (card && card.classList.contains("free-position")) {
        card.style.left = cardData.freePosition.x + "px";
        card.style.top = cardData.freePosition.y + "px";
      }
    }
  });
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

/*
This function sets up keyboard shortcuts for power users.
*/

function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (event) => {
    // Check if user is typing in an input field
    if (
      event.target.tagName === "INPUT" ||
      event.target.tagName === "TEXTAREA"
    ) {
      return;
    }

    // Handle different keyboard shortcuts
    switch (event.key) {
      case "r":
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          resetWorkspace();
        }
        break;

      case "a":
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          showAddCardDialog();
        }
        break;

      case "s":
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          console.log("💾 Workspace state saved to console");
          getWorkspaceState();
        }
        break;
    }
  });
}

// ==========================================
// INITIALIZATION AND STARTUP
// ==========================================

/*
This event listener waits for the HTML page to fully load,
then starts up our workspace application.
*/

document.addEventListener("DOMContentLoaded", () => {
  console.log("🌟 DOM Content Loaded - Starting Application");

  // Initialize the main workspace
  initializeWorkspace();

  // Set up keyboard shortcuts
  setupKeyboardShortcuts();

  // Set up window resize handler
  window.addEventListener("resize", handleWindowResize);

  // Log helpful information for developers
  console.log("🎉 Workspace Application Ready!");
  console.log("💡 Tips:");
  console.log("  - Drag cards around to organize them");
  console.log("  - Drop cards on grid cells to snap them");
  console.log("  - Use Ctrl+A to add a new card");
  console.log("  - Use Ctrl+R to reset the workspace");
  console.log("  - Use Ctrl+S to see current state");
  console.log("  - Call getWorkspaceState() to see all card data");
  console.log("  - Call resetWorkspace() to randomize positions");
});

/*
==================================================
CONGRATULATIONS! 🎉

You've just learned about:
- Object-oriented data management
- DOM manipulation and event handling
- Drag and drop functionality
- Responsive design principles
- Code organization and documentation
- Debugging and logging techniques

Next steps to improve this code:
1. Add data persistence (save to localStorage)
2. Add more card types and customization
3. Implement better mobile touch support
4. Add collaborative features
5. Create a proper modal for adding cards
6. Add card editing functionality
7. Implement themes and customization

Keep practicing and experimenting! 🚀
==================================================
*/
