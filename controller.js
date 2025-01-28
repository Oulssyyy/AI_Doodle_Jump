export class Controller {
    constructor(model, view) {
        this._model = model;
        this._view = view;
        this._startTime     = Date.now();
        this._lag           = 0;
        this._fps           = 60; // Frame rate.
        this._frameDuration = 1000 / this._fps; // Avec 60 frame par seconde, la frame va durer 16.7ms.

        this._model.BindDisplay(this.Display.bind(this, this._model.position, this._model.platforms, this._model.score));
        this._view.BindSetDirection(this.SetDirection.bind(this));
    }

    Display(position, platforms, score) {
        this._view.Display(position, platforms, this._model.score);
    }

    SetDirection(newDirection) {
        this._model.direction = newDirection;
    }
    
    Update() {
        /* Calcul du deltaTime */
        let currentTime = Date.now();
        let deltaTime   = currentTime - this._startTime; // La durée entre deux appels (entre 2 frames).
        
        this._lag += deltaTime;
        this._startTime = currentTime;

        /* Mettre à jour la logique si la variable _lag est supérieure ou égale à la durée d'une frame */
        while (this._lag >= this._frameDuration) {
            /* Mise à jour de la logique */
            this._model.Move(this._fps);
            /* Réduire la variable _lag par la durée d'une frame */
            this._lag -= this._frameDuration;
        }
        
        requestAnimationFrame(this.Update.bind(this)); // La fonction de rappel est généralement appelée 60 fois par seconde.
    }

    Restart(model, view){
        console.log("Restarting game");
        this._model = model;
        this._view = view;
        this._startTime = Date.now();
        this._lag = 0;
        this._model.BindDisplay(this.Display.bind(this, this._model.position, this._model.platforms, this._model.score));
        this._view.BindSetDirection(this.SetDirection.bind(this));
    }
}

export class AIController extends Controller {
    constructor(model, view, bot) {
        super(model, view)
        this.bot = bot;
    }

    Update() {
        console.log(this);
        this.bot.MakeDecision(this._model);
        super.Update();
    }
}