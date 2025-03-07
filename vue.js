export class View {
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

    renderBackground(background, score) {

        const scrollSpeed = score * 0.001; // Adjust the scroll speed as needed
        const backgroundY = (score + scrollSpeed) % this._canvas.height;

        this.ctx.drawImage(background, 0, backgroundY, this._canvas.width, this._canvas.height);
        if (backgroundY > 0) {
            this.ctx.drawImage(background, 0, backgroundY - this._canvas.height, this._canvas.width, this._canvas.height);
        } else {
            this.ctx.drawImage(background, 0, backgroundY + this._canvas.height, this._canvas.width, this._canvas.height);
        }
        
        this.ctx.drawImage(background, 0, backgroundY, this._canvas.width, this._canvas.height);
        if (backgroundY < 0) {
            this.ctx.drawImage(background, 0, backgroundY + this._canvas.height, this._canvas.width, this._canvas.height);
        }
    }

    Display(position, platforms, score, aiDirection) {
        // ('position:', position.y);
        // ('platforms:', platforms);

        const img = new Image();
        img.src = './assets/skibidi.png'; 

        const background = new Image();
        background.src = './assets/night_sky.png';

        const basicPlatform = new Image();
        basicPlatform.src = './assets/normal_platform.png';
        const oneTimePlatform = new Image();
        oneTimePlatform.src = './assets/oneTime_platform.png';
        const movingPlatform = new Image();
        movingPlatform.src = './assets/moving_platform.png';

        Promise.all([
            img.decode(), 
            background.decode(), 
            basicPlatform.decode(), 
            oneTimePlatform.decode(), 
            movingPlatform.decode()
        ]).then(() => {
            let x = position.x;
            let y = position.y;
        
            this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

            this.renderBackground(background, Math.floor(score / 10));

            

            for(let i = 0; i < platforms.length; i++) {
                if(platforms[i].type == 'oneTime')
                    this.ctx.drawImage(oneTimePlatform, platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
                else if(platforms[i].type == 'basic')
                    this.ctx.drawImage(basicPlatform, platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
                else if(platforms[i].type == 'moving')
                    this.ctx.drawImage(movingPlatform, platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
                //this.ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
            }

            if(aiDirection === undefined){
                if(this._hold_right && !this._hold_left && this.imageDirection != 1) {
                    this.imageDirection = 1;
                } else if(this._hold_left && !this._hold_right && this.imageDirection != -1) {
                    this.imageDirection = -1;
                }
            }
            else this.imageDirection = aiDirection;

            if (this.imageDirection == -1) {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(img, -x - 25, y, 25, 34);
                this.ctx.restore();
                this.image

            } else {
                this.ctx.drawImage(img, x, y, 25, 34);
            }
            this.ctx.font = '20px Arial';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText('Sigma: ' + score, 10, 30);

            
        }).catch((error) => {
            console.error('Error loading images:', error);
        });    
        
    }

    Restart() {
        ('Restart view');
        this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        //this.ctx.clearCanvas();
        
    }
}

export class AIView extends View {
    constructor(canvas, bot, model, drawVector = false) {
        super();
        this._canvas = canvas;
        this.ctx     = canvas.getContext('2d');
        this.bot = bot;
        this.drawVector = drawVector;
        this.model = model;
        //this.aiDirection = ;
    }

    Events() {

    }


    Display(position, platforms, score) {
        super.Display(position, platforms, score, this.model.direction);

        if (this.bot.fourClosestPlatforms == null) {
            this.bot.FourClosestPlatforms();
        }

        (this.bot.fourClosestPlatforms.length);
        
        
        if (this.drawVector) {
            this.ctx.lineWidth = 5;
        

        for (let i = 0; i < this.bot.fourClosestPlatforms.length; i++) {
                const platform = this.bot.fourClosestPlatforms[i];
                
                if(platform === undefined) {
                    continue;
                }
                this.ctx.beginPath();
                
                this.ctx.moveTo(position.x, position.y);
                this.ctx.lineTo(platform.x, platform.y);
                this.ctx.strokeStyle = [ 'red', 'yellow', 'blue', 'green' ][i];
                this.ctx.stroke();
            }
        }
    }
}