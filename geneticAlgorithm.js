import { Controller, AIController } from './controller.js';
import { Bot, NetworkLayer } from './ai.js';
import Model from './model.js';
import { View, AIView } from './vue.js';
import randMinMax from './util.js';

export class GeneticAlgorithm {
    constructor(numberOfInstances) {
        this.numberOfInstances = numberOfInstances;
    }

    StartLearning() {
        document.getElementById('normal-container').style.display = 'none';

        const container = document.getElementById('ai-container');

        for (let i = 0; i < this.numberOfInstances; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 600;
            container.appendChild(canvas);
            
            const instance = new GeneticBotInstance(canvas);
            instance.StartPlaying();
        }
    }
}

class GeneticBotInstance {
    constructor(canvas) {
        this.model = new Model();
        this.bot = new Bot(this.model, [
            NetworkLayer.InitiateRandom(6, 4),
            NetworkLayer.InitiateRandom(4, 3)
        ]);
        this.controller = new AIController(this.model, new AIView(canvas, this.bot), this.bot);
    }

    StartPlaying() {
        this.controller.Update();
    }
}