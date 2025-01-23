export default class Model {   
    static GRAVITY    = 20;
    static JUMP_FORCE = 500;
    static SPEED      = 200;
    static PLAYER_WIDTH = 10;

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
    
    BindDisplay(callback) {
        this.b_Display = callback;
    }

    Move(fps) {
        this._gravitySpeed += Model.GRAVITY;
        this._position.y += this._gravitySpeed / fps;
        this._position.x += this._direction * Model.SPEED / fps;

        if (this._position.y > 100) {
            this._Jump();
        }

        this.b_Display(this._position);
    }

    _Jump() {
        this._gravitySpeed = -Model.JUMP_FORCE;
    }
}