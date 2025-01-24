import Model from "./model.js";

export default class Bot {
    constructor() {
        this.weights = [];
    }

    MakeDecision(model) {
        let entryVector = []
    }

    _FourClosestPlatforms(model) {
        let doodleCenter = { x: (model.position().x * 2 + Model.PLAYER_WIDTH) / 2, y: model.position().y + Model.PLAYER_HEIGHT };

        let topLeftClosestVector = model.platforms().filter(el => {
            
        })

        return model.platforms().map(platform => {
            let platformCenter = { x: (platform.x * 2 + platform.width) / 2, y: platform.y };
            let dist = (doodleCenter.x - platformCenter.x) * (doodleCenter.x - platformCenter.x) + ((doodleCenter.y - platformCenter.y) * (doodleCenter.y - platformCenter.y));
            return { ...platform, dist: dist };
        }).sort((a, b) => a.dist - b.dist).slice(3);
    }
}

const matrixSum = (a, b) => {
    let c = a;
    for (let i = 0; i < c.length; i++) {
        for (let j = 0; j < c[0].length; j++) {
            c[i][j] += b[i][j]
        }
    }
    return c;
}

const matrixProduct = (a, b) => {
    // Nombre de lignes de la matrice a
    const rowsA = a.length;
    // Nombre de colonnes de la matrice a (ou nombre de lignes de b)
    const colsA = a[0].length;
    // Nombre de colonnes de la matrice b
    const colsB = b[0].length;
  
    // Initialisation de la matrice résultante avec des zéros
    const result = Array.from({ length: rowsA }, () => Array(colsB).fill(0));
  
    // Calcul du produit matriciel
    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        for (let k = 0; k < colsA; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
  
    return result;
  };