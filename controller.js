import Model from './model.js';
import { View, AIView } from './vue.js';
import { Bot, NetworkLayer } from './ai.js';


export class Controller {
    constructor(model, view) {
        this._model = model || new Model();
        this._view = view || new View();
        this._startTime     = Date.now();
        this._lag           = 0;
        this._fps           = 60; // Frame rate.
        this._frameDuration = 1000 / this._fps; // Avec 60 frame par seconde, la frame va durer 16.7ms.

        this._model.BindDisplay(this.Display.bind(this, this._model.position, this._model.platforms, this._model.score));
        this._model.BindRestart(this.Restart.bind(this));
        this._view.BindSetDirection(this.SetDirection.bind(this));
    }

    Display(position, platforms, score) {
        this._view.Display(position, platforms, this._model.score);
    }

    SetDirection(newDirection) {
        this._model.direction = newDirection;
    }
    
    async Update(condition = (() => true)) {
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
        
        if (condition()) {
            requestAnimationFrame(this.Update.bind(this)); // La fonction de rappel est généralement appelée 60 fois par seconde.
        } else {
            console.log('partie finie');
            return;
        }
    }

    Restart(model, view){
        ("Restarting game");
        this._model = model;
        this._view = view;
        this._startTime = Date.now();
        this._lag = 0;
        this._model.BindDisplay(this.Display.bind(this, this._model.position, this._model.platforms, this._model.score));
        this._view.BindSetDirection(this.SetDirection.bind(this));
    }
}

export class AIController extends Controller {
    constructor(model, view, bot, callback) {
        super(model, view)
        this.bot = bot;
        this.callback = callback;
    }

    Update() {
        (this);
        this.bot.MakeDecision(this._model);
        super.Update(() => !this.CheckLoseOrBlocked());
    }

    CheckLoseOrBlocked() {
        if (this._model.scoreSince > 1000 || this._model.loose) {
            this.callback();
            // console.log('fini');
            
            return true;
        }
        return false;
    }

    Restart(model, view, bot){
        console.log("Restarting game");
        this._model = model || new Model();
        this.bot = bot || new Bot(this._model);
        this._view = view || new AIView(this.bot, this._model);
        this._startTime = Date.now();
        this._lag = 0;
        this._model.BindDisplay(this.Display.bind(this, this._model.position, this._model.platforms, this._model.score));
        this._model.BindRestart(this.Restart.bind(this));
    }
}