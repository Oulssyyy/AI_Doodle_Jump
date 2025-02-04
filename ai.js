import Model from "./model.js";
import { matrixProduct, matrixSum } from "./util.js";
import { AIController } from "./controller.js";

export class Bot {
    constructor(model, neuralNetwork) {
        this.fourClosestPlatforms = null;
        this.fourClosestPlatformsNormalized = null;
        this.neuralNetwork = neuralNetwork;
        this.model = model;
    }

    MakeDecision() {
        this.FourClosestPlatforms();
        let entryVector = [...this.fourClosestPlatforms, (this.model.position.x * 2 + Model.PLAYER_WIDTH) / 300, (this.model.position.y + Model.PLAYER_HEIGHT) / 600].map(el => [el]);

        (entryVector);
        
        let result = [ entryVector,  ...this.neuralNetwork ].reduce((a, b) => b.Calculate(a))

        let maxIndex = 0;
        let max = result[0];

        for (let i = 0; i  < result.length; i++) {
            if (result[i] > max) {
                maxIndex = i;
                max = result[i];
            }
        }

        // -1, 0 or 1 to chose left, no-direction or right direction
        this.model.direction =  maxIndex - 1;
    }

    FourClosestPlatforms() {
        let doodleCenter = { x: (this.model.position.x * 2 + Model.PLAYER_WIDTH) / 2, y: this.model.position.y + Model.PLAYER_HEIGHT };

        const topLeftCondition = (doodle, platform) => doodle.x <= platform.x && doodle.y > platform.y;
        const topRightCondition = (doodle, platform) => doodle.x > platform.x && doodle.y > platform.y;
        const bottomLeftCondition = (doodle, platform) => doodle.x <= platform.x && doodle.y <= platform.y;
        const bottomRightCondition = (doodle, platform) => doodle.x > platform.x && doodle.y <= platform.y;

        const classify = (doodleCenter, classifier) => {
            return this.model.platforms.filter(platform => {
                let platformCenter = { x: (platform.x * 2 + platform.width) / 2, y: platform.y };
                return classifier(doodleCenter, platformCenter);
            }).map(platform => {
                let platformCenter = { x: (platform.x * 2 + platform.width) / 2, y: platform.y };
                let dist = ((doodleCenter.x - platformCenter.x)) * ((doodleCenter.x - platformCenter.x)) + (((doodleCenter.y - platformCenter.y)) * ((doodleCenter.y - platformCenter.y)));
                return { ...platform, dist: dist };
            }).sort((a, b) => a.dist - b.dist)[0];
        }

        this.fourClosestPlatforms = [
            classify(doodleCenter, topLeftCondition) || -1,
            classify(doodleCenter, topRightCondition) || -1,
            classify(doodleCenter, bottomRightCondition) || -1,
            classify(doodleCenter, bottomLeftCondition) || -1
        ].map(el => {
            if (el !== -1) {
                return el.dist;
            } else {
                return el;
            }
        });
    }
}

export class NetworkLayer {
    constructor(weights, bias) {
        this.weights = weights;
        this.bias = bias;
    }

    Calculate(entry) {
        //(this);
        (matrixProduct(this.weights, entry));
        
        //(this.bias);
        return matrixSum(
            matrixProduct(this.weights, entry), this.bias
        );
    }

    static InitiateRandom(from, to) {
        // from : nombre de neuronne sur la couche d'avant
        // to : nombre de neuronne qu'on veut sur la couche suivante
        let weights = new Array(to);

        for (let i = 0; i < weights.length; i++) {
            weights[i] = new Array(from);
        }
        
        
        for (let i = 0; i < to; i++) {
            for (let j = 0; j < from; j++) {
                weights[i][j] = Math.random() * 2 - 1.0;
            }
        }

        let bias = new Array(to);

        for (let i = 0; i < to; i++) {
            bias[i] = [Math.random() * 2 - 1.0];
        }

        return new NetworkLayer(weights, bias);
    }

    // return a network layer where every coefficient of the weights matrix and bias vector is the avg between A and B ones
    static MergeNetworkLayer(A, B) {
        let weights = new Array(A.weights.length);
        for (let i = 0; i < A.weights.length; i++) {
            weights[i] = new Array(A.weights[i].length);
        }

        for (let i = 0; i < A.weights.length; i++) {
            for (let j = 0; j < A.weights[i].length; j++) {
                weights[i][j] = (A.weights[i][j] + B.weights[i][j]) / 2;
            }
        }

        let bias = new Array(A.bias.length);

        for (let i = 0; i < A.bias.length; i++) {
            bias[i] = [(A.bias[i][0] + B.bias[i][0]) / 2];
        }

        return new NetworkLayer(weights, bias);
    }
}