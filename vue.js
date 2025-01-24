export default class View {
    constructor() {
        this._canvas = document.getElementById('my_canvas');
        this.ctx     = this._canvas.getContext('2d');
        this._hold_right = false;
        this._hold_left = false;
        this.imageDirection = 1;
        this.Events();
        this.lowestPosition = 1000
        this.maxPosition = 0;
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

    Display(position, platforms, score) {

        
        // this.lowestPosition = Math.min(this.lowestPosition, position.y);
        // this.maxPosition = Math.max(this.maxPosition, position.y);
        // console.log('position:', this.lowestPosition, this.maxPosition);

        const img = new Image();
        img.src = './assets/skibidi.png'; 

        const img2 = new Image();
        img2.src = './assets/social_credit_up.png';

        const background = new Image();
        background.src = './assets/night_sky.png';

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mode') === 'china') {
            img.src = './assets/mao.png';
            background.src = './assets/chinese_sky.jpg';
        }
        
        

        const basicPlatform = new Image();
        const oneTimePlatform = new Image();
        const movingPlatform = new Image();

        Promise.all([img.decode(), img2.decode(), background.decode()]).then(() => {
            let x = position.x;
            let y = position.y;
        
            this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

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

            for(let i = 0; i < platforms.length; i++) {
                if(platforms[i].type == 'oneTime')
                    this.ctx.fillStyle = 'red';
                else if(platforms[i].type == 'basic')
                    this.ctx.fillStyle = 'white';
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

            if (urlParams.get('mode') === 'china'){
                this.ctx.drawImage(img2, 220, 5, 70, 40);
                this.ctx.font = '20px Arial';
                this.ctx.fillStyle = 'white';
                this.ctx.fillText('社会信用: ' + score, 10, 30);
            }
            else{
                this.ctx.font = '20px Arial';
                this.ctx.fillStyle = 'white';
                this.ctx.fillText('Sigma: ' + score, 10, 30);
            }

            
        }).catch((error) => {
            console.error('Error loading images:', error);
        });        
        
    }
}