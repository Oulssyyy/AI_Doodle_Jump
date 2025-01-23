import randMinMax from "./util.js";

export default class Model {   
    static GRAVITY    = 20;
    static JUMP_FORCE = 800;
    static SPEED      = 200;
    static PLAYER_WIDTH = 34;
    static PLAYER_HEIGHT = 25;
    static MIN_PLAYER_Y = 250;
    static MIN_Y_PLATFORM_BUFFER = -1000;

    constructor() {
        this._direction = 0;                
        this._gravitySpeed = 0;
        this._position = {x: 0, y:0};
        this._platforms = [
            { x: 0, y: 300, height: 50, width: 300,  type: 'basic' },
        ];
        this._score = 0;
    }

    get position() {
        return this._position; 
    }

    get platforms() {
        return this._platforms;
    }

    get direction() {
        return this._direction;
    }

    set direction(value) {
        return this._direction = value; 
    }

    get score() {
        return this._score;
    }

    set score(value) {
        return this._score = value;
    }

    _GeneratePlatforms() {
        // pour l'instant,  on considere que le tableau de platform n'est pas vide

        let currentYGeneration = this._platforms[this._platforms.length - 1].y;

        let defaultGenRange = { min: 50, max: 200 }

        while (currentYGeneration > Model.MIN_Y_PLATFORM_BUFFER) {
            let nextY = currentYGeneration - randMinMax(defaultGenRange.min, defaultGenRange.max);
            
            let platformWidth = randMinMax(30,80);
            let nextX = randMinMax(0, 300 - platformWidth);

            let nextPlatform = { x: nextX, y: nextY, height: 10, width: platformWidth,  type: Math.random() > 0.75 ? Math.random() > 0.5 ? 'moving' : 'oneTime' : 'basic' };

            if(nextPlatform.type == 'moving') {
                nextPlatform.from = randMinMax(0, 200 - platformWidth);
                nextPlatform.to = randMinMax(nextPlatform.from, 300 - platformWidth);
                nextPlatform.speed = randMinMax(50, 200) / 100;
                nextPlatform.direction = Math.random() > 0.5 ? 1 : -1;
            }

            this._platforms.push(nextPlatform);
            currentYGeneration = nextY;
        }

    }

    UpdatePlatforms(fps) {
        for (let i = 0; i < this._platforms.length; i++) {
            if(this._platforms[i].type == 'moving') {

                if(this._platforms[i].x >= this._platforms[i].to) {
                    this._platforms[i].x += this._platforms[i].speed *-1;
                    this._platforms[i].direction = -1;
                } else if(this._platforms[i].x <= this._platforms[i].from) {
                    this._platforms[i].x += this._platforms[i].speed;
                    this._platforms[i].direction = 1;
                } else {
                    this._platforms[i].x += this._platforms[i].speed * this._platforms[i].direction;
                }
            }
        }
    }


    isOnPlatform() {
        for (let i = 0; i < this._platforms.length; i++) {
            if (
                this._position.x + Model.PLAYER_HEIGHT >= this._platforms[i].x && 
                this._position.x <= this._platforms[i].x + this._platforms[i].width
            ) {
                if(this._position.y + Model.PLAYER_WIDTH >= this._platforms[i].y &&
                    this._position.y + Model.PLAYER_WIDTH <= this._platforms[i].y + this._platforms[i].height
                ){
                    if(this._platforms[i].type == 'oneTime') {
                        this._platforms.splice(i, 1);
                        return true;
                    }
                    return true;
                }
            }
        }
        return false;
    }    
    
    BindDisplay(callback) {
        this.b_Display = callback;
    }

    Move(fps) {

        this.UpdatePlatforms(fps);
        this._gravitySpeed += Model.GRAVITY;

        this._position.y += this._gravitySpeed / fps;

        if (this._position.y < Model.MIN_PLAYER_Y) {
            let delta = Model.MIN_PLAYER_Y - this._position.y;
            this._position.y += delta;
            this._score += Math.round(delta / 10);
            for (let platform of this._platforms) {
                platform.y += delta;
            }
        }

        this._position.x += this._direction * Model.SPEED / fps;

        if (this._position.x >= 300) {
            this._position.x = 0;
        } else if (this._position.x + Model.PLAYER_WIDTH <= 0) {
            this._position.x = 300 - Model.PLAYER_WIDTH;
        }

        if (this._position.y > 600) {
            // Player loses the game
            if (confirm("Perdu ! Skibidi toilet score : " + this._score + ". Click OK to restart.")) {
                location.reload();
            }
            this._position = { x: 0, y: 0 };
            this._gravitySpeed = 0;
            this._direction = 0;
            this._platforms = [{ x: 0, y: 300, height: 20, width: 300, type: 'basic' }];
            this._score = 0;
        
        }
        

        if(this._gravitySpeed > 0 && this.isOnPlatform(this)) {
            this._Jump();
        }

        if (this._platforms[this._platforms.length - 1].y > -100) {
            this._GeneratePlatforms();
        }

        this.b_Display(this._position);
    }

    _Jump() {
        this._gravitySpeed = -Model.JUMP_FORCE;
    }
}