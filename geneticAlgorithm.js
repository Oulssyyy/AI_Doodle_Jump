import { Controller, AIController } from './controller.js';
import { Bot, NetworkLayer } from './ai.js';
import Model from './model.js';
import { View, AIView } from './vue.js';
import randMinMax from './util.js';

export class GeneticAlgorithm {
    constructor(numberOfInstances, numberOfGoodInstances, localStorageData, updateChart) {
        this.numberOfGoodInstances = numberOfGoodInstances // indicates the number of instance we keep from each generation
        this.numberOfInstances = numberOfInstances;
        this.instances = [];
        this.bestScores = localStorageData?.bestScores || [[0,0,0]];
        this.generation = localStorageData?.generation || 0;
        this.updateChart = updateChart;
    }

InstanceEnded() {
    if (this.instances.filter(el => !el.lose).length === 0) {
        this.generation++;

        const orderedInstances = this.instances.sort((a, b) => b.score - a.score);

        const bestScore = orderedInstances[0].score;
        const averageScore = orderedInstances.reduce((acc, el) => acc + el.score, 0) / orderedInstances.length;
        console.log('best score = ' + bestScore);

        const totalInstances = this.instances.length;

        const keepingNeuralNetworks = orderedInstances
            .slice(0, this.numberOfGoodInstances)
            .map(el => el.bot.neuralNetwork);

        const newNeuralNetworks = [];

        const nbNewNetworks = totalInstances - keepingNeuralNetworks.length;

        for (let i = 0; i < nbNewNetworks; i++) {
            const parentA = keepingNeuralNetworks[randMinMax(0, keepingNeuralNetworks.length - 1)];
            const parentB = keepingNeuralNetworks[randMinMax(0, keepingNeuralNetworks.length - 1)];

            const newNeuralNetwork = [];
            for (let j = 0; j < parentA.length; j++) {
                newNeuralNetwork.push(NetworkLayer.MergeNetworkLayer(parentA[j], parentB[j]));
            }

            newNeuralNetworks.push(newNeuralNetwork);
        }

        this.bestScores.push([this.generation, bestScore, averageScore]);

        this.updateChart(this.bestScores);

        this.instances = [];
        this.Learning([...keepingNeuralNetworks, ...newNeuralNetworks]);

        localStorage.setItem('geneticData', JSON.stringify({ 
            generation: this.generation, 
            bestScores: this.bestScores, 
            neuralNetworks: [...keepingNeuralNetworks, ...newNeuralNetworks],
            numberOfGoodInstances: this.numberOfGoodInstances,
            numberOfInstances: this.numberOfInstances
        }));


        console.log("C'est reparti pour un tour !");
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
        console.log(botNeuralNetworks);
        
        const container = document.getElementById('ai-container');

        for (const el of container.querySelectorAll('canvas')) {
            if (el.id !== 'normal-container') {
                container.removeChild(el);
            }
        }

        console.log(botNeuralNetworks.length);

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
        this.controller = new AIController(this.model, new AIView(canvas, this.bot, this.model), this.bot, ()=>{this.InstanceEnded()});
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