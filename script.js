class Warrior {
    constructor(id, healthElement) {
        this.element = document.getElementById(id);
        this.healthElement = healthElement;
        this.position = id === 'red-warrior' ? 50 : 700;
        this.health = 150;
        this.isDefending = false;
        this.movingLeft = false;
        this.movingRight = false;
        this.element.style.left = this.position + 'px';
    }

    updatePosition() {
        if (this.movingLeft && this.position > 0) {
            this.position -= 2;
        }
        if (this.movingRight && this.position < 760) {
            this.position += 2;
        }
        this.element.style.left = this.position + 'px';
    }

    attack() {
        this.element.classList.add('attacking');
        return true;
    }

    defend() {
        this.isDefending = true;
        this.element.classList.add('defending');
        setTimeout(() => {
            this.isDefending = false;
            this.element.classList.remove('defending');
        }, 500);
    }

    takeDamage() {
        if (!this.isDefending) {
            this.health -= 10;
            this.healthElement.style.width = (this.health / 150) * 100 + '%';
            this.healthElement.textContent = this.health;
        }
        return this.health <= 0;
    }
}

const redWarrior = new Warrior('red-warrior', document.getElementById('red-health'));
const blueWarrior = new Warrior('blue-warrior', document.getElementById('blue-health'));
const gameMessage = document.getElementById('game-message');

function checkDistance() {
    return Math.abs(redWarrior.position - blueWarrior.position) <= 70;
}

function showMessage(message) {
    gameMessage.textContent = message;
}

// Game loop
function gameLoop() {
    redWarrior.updatePosition();
    blueWarrior.updatePosition();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Key state tracking
const keys = {
    a: false, // Red left
    d: false, // Red right
    w: false, // Red attack
    s: false, // Red defend
    j: false, // Blue left
    l: false, // Blue right
    i: false, // Blue attack
    k: false  // Blue defend
};

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) {
        keys[key] = true;
        
        // Handle attacks and defends immediately
        switch (key) {
            case 'w':
                if (redWarrior.attack() && checkDistance()) {
                    if (blueWarrior.takeDamage()) {
                        showMessage('Red Warrior Wins!');
                        // Stop the game by removing key listeners
                        document.removeEventListener('keydown', () => {});
                        document.removeEventListener('keyup', () => {});
                    }
                }
                break;
            case 's':
                redWarrior.defend();
                break;
            case 'i':
                if (blueWarrior.attack() && checkDistance()) {
                    if (redWarrior.takeDamage()) {
                        showMessage('Blue Warrior Wins!');
                        // Stop the game by removing key listeners
                        document.removeEventListener('keydown', () => {});
                        document.removeEventListener('keyup', () => {});
                    }
                }
                break;
            case 'k':
                blueWarrior.defend();
                break;
        }
    }

    // Update movement states
    updateMovement();
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) {
        keys[key] = false;
    }
    
    // Update movement states
    updateMovement();
});

function updateMovement() {
    // Update red warrior movement
    redWarrior.movingLeft = keys.a;
    redWarrior.movingRight = keys.d;

    // Update blue warrior movement
    blueWarrior.movingLeft = keys.j;
    blueWarrior.movingRight = keys.l;
}