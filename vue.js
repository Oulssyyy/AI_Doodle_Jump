export default class View {
    constructor() {
        this._canvas = document.getElementById('my_canvas');
        this.ctx     = this._canvas.getContext('2d');
        this._hold_right = false;
        this._hold_left = false;

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

    Display(position) {
        let x = position.x;
        let y = position.y;
        
        this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        // Dessiner les lignes.
        this.ctx.beginPath(); // Nouveau tracé.
        this.ctx.moveTo(100, 0); // Déplacement du crayon en (100, 0).
        this.ctx.lineTo(100, 100); // Dessiner la ligne en (150, 100).
        this.ctx.stroke(); // Afficher la ligne.
        this.ctx.beginPath(); // Nouveau tracé.
        this.ctx.moveTo(0, 100); // Déplacement du crayon en (100, 0).
        this.ctx.lineTo(100, 100); // Dessiner la ligne en (150, 100).
        this.ctx.stroke(); // Afficher la ligne.
        
        // Dessiner un rectangle plein.
        this.ctx.fillRect(x, y, 10, 10);
    }
}