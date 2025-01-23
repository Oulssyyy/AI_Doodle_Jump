import randMinMax from "./util.js";

export default class Model {   
    static GRAVITY    = 20;
    static JUMP_FORCE = 500;
    static SPEED      = 200;
    static PLAYER_WIDTH = 10;
    static PLAYER_HEIGHT = 10;
    static MIN_PLAYER_Y = 250;
    static MIN_Y_PLATFORM_BUFFER = -1000;

    constructor() {
        this._direction = 0;                
        this._gravitySpeed = 0;
        this._position = {x: 0, y:0};
        this._platforms = [
            { x: 50, y: 50, height: 20, width: 100,  type: '?' }
        ];
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

    _GeneratePlatforms() {
        // pour l'instant,  on considere que le tableau de platform n'est pas vide

        let currentYGeneration = this._platforms[this._platforms.length - 1].y;

        let defaultGenRange = { min: 50, max: 200 }

        while (currentYGeneration > Model.MIN_Y_PLATFORM_BUFFER) {
            let nextY = currentYGeneration + randMinMax(defaultGenRange.min, defaultGenRange.max);
            let nextX = randMinMax(0, 300 - Model.PLAYER_WIDTH);
            
            let nextPlatform = { x: nextX, y: nextY, height: 20, width: 100,  type: 'basic' };
            this._platforms.push(nextPlatform);
            currentYGeneration = nextY;
        }

    }
    
    BindDisplay(callback) {
        this.b_Display = callback;
    }

    Move(fps) {
        this._gravitySpeed += Model.GRAVITY;
        this._position.y += this._gravitySpeed / fps;

        if (this._position.y < Model.MIN_PLAYER_Y) {
            let delta = Model.MIN_PLAYER_Y - this._position.y;
            this._position.y += delta;
            for (let platform of this._platforms) {
                platform.y += delta;
            }
        }

        this._position.x += this._direction * Model.SPEED / fps;

        if (this._position.y > 100) {
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