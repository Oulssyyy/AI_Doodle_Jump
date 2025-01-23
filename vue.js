export default class View {
    constructor() {
        this._canvas = document.getElementById('my_canvas');
        this.ctx     = this._canvas.getContext('2d');
        this._hold_right = false;
        this._hold_left = false;
        this.imageDirection = 1;
        this.Events();
    }

    BindSetDirection(callback) {
        this.b_SetDirection = callback;
    }

    Events() {
        document.addEventListener('keydown', (evt) => {                
            if (evt.key == 'ArrowLeft' || evt.key == 'ArrowRight') {
                switch (evt.key) {
                    case 'ArrowLeft': // Move left.
                        this._hold_left = true;
                        this.b_SetDirection(-1);
                        break;
                    case 'ArrowRight': // Move right.
                        this._hold_right = true;
                        this.b_SetDirection(1);
                        break;
                }
            }
        });

        document.addEventListener('keyup', (evt) => {
            switch (evt.key) {
                case 'ArrowLeft': // Move left.
                    if (!this._hold_right) {
                        this.b_SetDirection(0);
                    }
                    this._hold_left = false;
                    break;
                case 'ArrowRight': // Move right.
                    if (!this._hold_left) {
                        this.b_SetDirection(0);
                    }
                    this._hold_right = false;
                    break;
            }
        });
    }

    Display(position, platforms) {
        const img = new Image();
        img.src = './assets/skibidi.png';        
        
        // Dessiner un rectangle plein.
        //this.ctx.fillRect(x, y, 10, 10);
        
        img.onload = () => {

            let x = position.x;
            let y = position.y;
        
            this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

            for(let i = 0; i < platforms.length; i++) {
                if(platforms[i].type == 'oneTime')
                    this.ctx.fillStyle = 'red';
                else if(platforms[i].type == 'basic')
                    this.ctx.fillStyle = 'black';
                else if(platforms[i].type == 'moving')
                    this.ctx.fillStyle = 'blue';
                this.ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
            }

            if(this._hold_right && !this._hold_left && this.imageDirection != 1) {
                this.imageDirection = 1;
            } else if(this._hold_left && !this._hold_right && this.imageDirection != -1) {
                this.imageDirection = -1;
            }



            if (this.imageDirection == -1) {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(img, -x - 25, y, 25, 34);
                this.ctx.restore();
                this.image

            } else {
                this.ctx.drawImage(img, x, y, 25, 34);
            }
        };

        
        
    }
}