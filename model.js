export default class Model {   
    static GRAVITY    = 20;
    static JUMP_FORCE = 800;
    static SPEED      = 200;
    static PLAYER_WIDTH = 10;

    constructor() {
        this._direction = 0;                
        this._gravitySpeed = 0;
        this._position = {x: 0, y:0};
        this._platforms = [
            { x: 50, y: 50, height: 20, width: 100,  type: 'basic' },
            { x: 200, y: 400, height: 20, width: 100,  type: 'oneTime' },
            { x: 100, y: 300, height: 20, width: 100,  type: 'moving', from: 400, to: 600, speed: 50 },
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

    isOnPlatform() {
        for (let i = 0; i < this._platforms.length; i++) {
            if (
                this._position.x + Model.PLAYER_WIDTH >= this._platforms[i].x && 
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
        this._gravitySpeed += Model.GRAVITY;
        this._position.y += this._gravitySpeed / fps;
        this._position.x += this._direction * Model.SPEED / fps;
        this._isFalling = this._gravitySpeed > 0;

        if (this._position.y > 600) {
            this._Jump();
        }
        

        if(this._isFalling && this.isOnPlatform(this)) {
            this._Jump();
            console.log('On platform');
        }

        this.b_Display(this._position);
    }

    _Jump() {
        this._gravitySpeed = -Model.JUMP_FORCE;
    }
}