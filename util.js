export const randMinMax  = (min, max) => min + parseInt((Math.random() * (max - min + 1)));

export const matrixSum = (a, b) => {
    let c = a;
    for (let i = 0; i < c.length; i++) {
        for (let j = 0; j < c[0].length; j++) {
            c[i][j] += b[i][j]
        }
    }
    return c;
}

export const matrixProduct = (a, b) => {
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

export default randMinMax;