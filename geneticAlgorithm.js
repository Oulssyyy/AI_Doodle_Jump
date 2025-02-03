import { Controller, AIController } from './controller.js';
import { Bot, NetworkLayer } from './ai.js';
import Model from './model.js';
import { View, AIView } from './vue.js';
import randMinMax from './util.js';

export class GeneticAlgorithm {
    constructor(numberOfInstances, numberOfGoodInstances, updateChart) {
        this.numberOfGoodInstances = numberOfGoodInstances // indicates the number of instance we keep from each generation
        this.numberOfInstances = numberOfInstances;
        this.instances = [];
        this.bestScores = [];
        this.generation = 0;
        this.updateChart = updateChart;
    }

    InstanceEnded() {
        if (this.instances.filter(el => !el.lose).length === 0) {
            this.generation++;
            const orderedInstances = this.instances.sort((a, b) => b.score - a.score);
        
            const bestScore = orderedInstances[0].score;
            console.log('best score = ' + bestScore);
            
            const keepingNeuralNetworks = orderedInstances.slice(this.numberOfGoodInstances).map(el => el.bot.neuralNetwork);
            const newNeuralNetworks = [];
            
            this.bestScores.push(this.generation, bestScore);

            //this.updateChart(this.bestScores);
            
            for (const el of orderedInstances.slice(this.numberOfGoodInstances + 1, orderedInstances.length)) {
                // console.log(el);
                // console.log(keepingNeuralNetworks);
                
                const newNeuralNetwork = [];
                const A = el.bot.neuralNetwork;
                const B = keepingNeuralNetworks[randMinMax(0, keepingNeuralNetworks.length - 1)];

                for (let i = 0; i < A.length; i++) {
                    newNeuralNetwork.push(NetworkLayer.MergeNetworkLayer(A[i], B[i]));
                }

                newNeuralNetworks.push(newNeuralNetwork);
                this.instances = [];
                this.Learning([...keepingNeuralNetworks, ...newNeuralNetworks]);
                console.log("C'est repartie pour un tour !");
            }
        } else {
            // console.log('une en moins !');
        }
    }

    StartLearning() {
        document.getElementById('normal-container').style.display = 'none';

        const container = document.getElementById('ai-container');


        for (let i = 0; i < this.numberOfInstances; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 600;
            container.appendChild(canvas);
            
            const instance = new GeneticBotInstance(canvas, this);
            this.instances.push(instance);
            instance.StartPlaying();
        }
    }

    Learning(botNeuralNetworks) {
        // console.log(botNeuralNetworks);
        
        const container = document.getElementById('ai-container');

        for (const el of container.querySelectorAll('canvas')) {
            if (canvas.id !== 'normal-container') {
                container.removeChild(el);
            }
        }


        for (let i = 0; i < botNeuralNetworks.length; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 600;
            container.appendChild(canvas);
            
            const instance = new GeneticBotInstance(canvas, this, botNeuralNetworks[i]);
            this.instances.push(instance);
            instance.StartPlaying();
        }
    }

    
}

class GeneticBotInstance {
    constructor(canvas, owner, neuralNetwork = [
        NetworkLayer.InitiateRandom(6, 4),
        NetworkLayer.InitiateRandom(4, 3)
    ]) {
        this.model = new Model();
        this.lose = false;
        this.score = null;
        this.neuralNetwork = neuralNetwork;
        this.bot = new Bot(this.model, this.neuralNetwork);
        this.owner = owner;
        this.controller = new AIController(this.model, new AIView(canvas, this.bot), this.bot, ()=>{this.InstanceEnded()});
    }

    InstanceEnded() {
        // console.log(this.owner);
        this.lose = true;
        this.score = this.controller._model.score;
        this.owner.InstanceEnded();
    }

    StartPlaying() {
        this.controller.Update();
    }
}