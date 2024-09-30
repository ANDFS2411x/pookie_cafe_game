let coffeeLevel = 0;
let currentIngredients = { cafe: 0, leche: 0, azucar: 0 };
let ingredientCounts = { cafe: 5, leche: 5, azucar: 5 };
let score = 0;
let loveLevel = 0;
let level = 1;
let orderTimer;
let achievements = [
    { id: '☕', name: 'Barista Novato', condition: () => score >= 50, unlocked: false },
    { id: '🏆', name: 'Maestro del Café', condition: () => score >= 100, unlocked: false },
    { id: '🌟', name: 'Favorito de los Clientes', condition: () => loveLevel >= 50, unlocked: false },
    { id: '🚀', name: 'Velocista del Espresso', condition: () => level >= 5, unlocked: false },
    { id: '🎨', name: 'Artista Latte', condition: () => score >= 200, unlocked: false }
];

const coffeeTypes = [
    { name: "Espresso", recipe: { cafe: 2, leche: 0, azucar: 0 } },
    { name: "Latte", recipe: { cafe: 1, leche: 2, azucar: 1 } },
    { name: "Cappuccino", recipe: { cafe: 1, leche: 1, azucar: 1 } },
    { name: "Americano", recipe: { cafe: 2, leche: 0, azucar: 1 } },
    { name: "Mocha", recipe: { cafe: 1, leche: 1, azucar: 2 } },
    { name: "Macchiato", recipe: { cafe: 2, leche: 1, azucar: 0 } },
    { name: "Flat White", recipe: { cafe: 2, leche: 2, azucar: 0 } },
    { name: "Affogato", recipe: { cafe: 2, leche: 0, azucar: 2 } }
];

const loveMessages = [
    "QUE MARAVILLOSA ERESSS!!!",
    "¿Sabías que esa sonrisa me enamora mucho?",
    "y sí, yo te amo más!!",
    "damnnn súper mi reinaaaa",
    "¿Nos casamos?",
    "holateamoquegenia",
    "mi motivación: SOFIA MAYOR!!!",
    "Juntos x siempre jejeje",
    "excelenteeeeeee, que ricooo!",
    "me regalas una sonrisita?",
    "si lees esto te debo un millon de besos",
    "tuamimefascinas muchoooo"
];

let currentOrder;

function generateOrder() {
    currentOrder = coffeeTypes[Math.floor(Math.random() * coffeeTypes.length)];
    document.getElementById('currentOrder').innerText = `${currentOrder.name}`;
    giveHint();
    startOrderTimer();
}

function giveHint() {
    let hint = "Pista: ";
    if (currentOrder.recipe.cafe > 1) hint += "Mucho café, ";
    else if (currentOrder.recipe.cafe === 1) hint += "Un poco de café, ";
    if (currentOrder.recipe.leche > 1) hint += "bastante leche, ";
    else if (currentOrder.recipe.leche === 1) hint += "un toque de leche, ";
    if (currentOrder.recipe.azucar > 1) hint += "bien dulce";
    else if (currentOrder.recipe.azucar === 1) hint += "un poco de azúcar";
    else hint += "sin azúcar";
    document.getElementById('recipeHint').innerText = hint;
}

function startOrderTimer() {
    let timeLeft = 30 + (level * 2); // Aumenta el tiempo con el nivel
    document.getElementById('orderTimer').innerText = timeLeft;
    clearInterval(orderTimer);
    orderTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('orderTimer').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(orderTimer);
            orderFailed();
        }
    }, 1000);
}

function orderFailed() {
    score = Math.max(0, score - 10);
    loveLevel = Math.max(0, loveLevel - 5);
    document.getElementById('message').innerText = "¡Oh no! El pedido no se completó a tiempo POOKIEEEE :c.";
    resetCup();
    generateOrder();
    updateDisplay();
}

function addIngredient(ingredient) {
    if (ingredientCounts[ingredient] > 0 && currentIngredients[ingredient] < 2) {
        currentIngredients[ingredient]++;
        ingredientCounts[ingredient]--;
        updateDisplay();
        animateAdd(ingredient);
    }
}

function animateAdd(ingredient) {
    let cup = document.querySelector('.coffee-cup');
    let drop = document.createElement('div');
    drop.style.position = 'absolute';
    drop.style.width = '10px';
    drop.style.height = '10px';
    drop.style.borderRadius = '50%';
    drop.style.backgroundColor = ingredient === 'cafe' ? '#4B2F2F' : ingredient === 'leche' ? '#FFF' : '#FFD700';
    drop.style.top = '-10px';
    drop.style.left = '45px';
    drop.style.animation = 'drop 0.5s linear';
    cup.appendChild(drop);
    setTimeout(() => cup.removeChild(drop), 500);
}

function serveCoffee() {
    clearInterval(orderTimer);
    if (compareRecipes(currentIngredients, currentOrder.recipe)) {
        score += 10 + (level * 2);
        loveLevel = Math.min(100, loveLevel + 5);
        showLoveMessage();
        if (score % 50 === 0) levelUp();
    } else {
        score = Math.max(0, score - 5);
        loveLevel = Math.max(0, loveLevel - 2);
        document.getElementById('message').innerText = "¡Uyyy amooor, CASIII!! TE AMOOOOOOO dale de nuevo!!! :D";
    }
    resetCup();
    generateOrder();
    updateDisplay();
    checkAchievements();
}

function levelUp() {
    level++;
    document.getElementById('level').innerText = level;
    document.getElementById('message').innerText = `¡Felicidades! Has subido al nivel ${level}`;
}

function showLoveMessage() {
    let message = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    document.getElementById('message').innerText = message;
    document.getElementById('message').classList.add('animate__animated', 'animate__heartBeat');
    setTimeout(() => {
        document.getElementById('message').classList.remove('animate__animated', 'animate__heartBeat');
    }, 1000);
}

function compareRecipes(made, ordered) {
    return JSON.stringify(made) === JSON.stringify(ordered);
}

function resetCup() {
    currentIngredients = { cafe: 0, leche: 0, azucar: 0 };
    coffeeLevel = 0;
    document.getElementById('coffee').style.height = '0%';
}

function restockIngredients() {
    for (let ingredient in ingredientCounts) {
        ingredientCounts[ingredient] = 5;
    }
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('cafeCount').innerText = ingredientCounts.cafe;
    document.getElementById('lecheCount').innerText = ingredientCounts.leche;
    document.getElementById('azucarCount').innerText = ingredientCounts.azucar;
    document.getElementById('score').innerText = score;
    document.getElementById('loveMeter').style.width = `${loveLevel}%`;
    document.getElementById('level').innerText = level;

    let totalIngredients = currentIngredients.cafe + currentIngredients.leche + currentIngredients.azucar;
    coffeeLevel = (totalIngredients / 6) * 100; // 6 is max total ingredients (2 of each)
    document.getElementById('coffee').style.height = `${coffeeLevel}%`;
}

function checkAchievements() {
    achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.condition()) {
            achievement.unlocked = true;
            showAchievement(achievement);
        }
    });
}

function showAchievement(achievement) {
    let achievementElement = document.createElement('div');
    achievementElement.className = 'achievement';
    achievementElement.innerHTML = achievement.id;
    achievementElement.title = achievement.name;
    document.getElementById('achievements').appendChild(achievementElement);
    setTimeout(() => achievementElement.classList.add('unlocked'), 100);
}

function animateCat() {
    const cat = document.querySelector('.cat');
    cat.style.animation = 'none';
    cat.offsetHeight; // Trigger reflow
    cat.style.animation = 'bounce 2s infinite';
}

// Inicialización del juego
generateOrder();
updateDisplay();
setInterval(animateCat, 4000); // Anima al gato cada 4 segundos

// Guardar y cargar progreso
function saveGame() {
    const gameState = {
        score: score,
        loveLevel: loveLevel,
        level: level,
        achievements: achievements
    };
    localStorage.setItem('cafeGatunoGame', JSON.stringify(gameState));
}

function loadGame() {
    const savedGame = localStorage.getItem('cafeGatunoGame');
    if (savedGame) {
        const gameState = JSON.parse(savedGame);
        score = gameState.score;
        loveLevel = gameState.loveLevel;
        level = gameState.level;
        achievements = gameState.achievements;
        updateDisplay();
        checkAchievements();
    }
}

// Guardar el juego cada minuto
setInterval(saveGame, 60000);

// Cargar el juego al inicio
loadGame();