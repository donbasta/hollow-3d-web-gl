// reference:
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web

// point • matrix

export const create = () => {
    return [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ];
};

const transpose = (matrix) => {
    return [
        matrix[0], matrix[4], matrix[8], matrix[12],
        matrix[1], matrix[5], matrix[9], matrix[13],
        matrix[2], matrix[6], matrix[10], matrix[14],
        matrix[3], matrix[7], matrix[11], matrix[15]
    ];
}

const multiplyMatrixAndPoint = (matrix, point) => {
    // Give a simple variable name to each part of the matrix, a column and row number
    let c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
    let c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
    let c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
    let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];
  
    // Now set some simple names for the point
    let x = point[0];
    let y = point[1];
    let z = point[2];
    let w = point[3];
  
    // Multiply the point against each part of the 1st column, then add together
    let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);
  
    // Multiply the point against each part of the 2nd column, then add together
    let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);
  
    // Multiply the point against each part of the 3rd column, then add together
    let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);
  
    // Multiply the point against each part of the 4th column, then add together
    let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);
  
    return [resultX, resultY, resultZ, resultW];
}

//matrixB • matrixA
const multiplyMatrices = (matrixA, matrixB) => {
    // Slice the second matrix up into rows
    let row0 = [matrixB[ 0], matrixB[ 1], matrixB[ 2], matrixB[ 3]];
    let row1 = [matrixB[ 4], matrixB[ 5], matrixB[ 6], matrixB[ 7]];
    let row2 = [matrixB[ 8], matrixB[ 9], matrixB[10], matrixB[11]];
    let row3 = [matrixB[12], matrixB[13], matrixB[14], matrixB[15]];
  
    // Multiply each row by matrixA
    let result0 = multiplyMatrixAndPoint(matrixA, row0);
    let result1 = multiplyMatrixAndPoint(matrixA, row1);
    let result2 = multiplyMatrixAndPoint(matrixA, row2);
    let result3 = multiplyMatrixAndPoint(matrixA, row3);
  
    // Turn the result rows back into a single matrix
    return [
      result0[0], result0[1], result0[2], result0[3],
      result1[0], result1[1], result1[2], result1[3],
      result2[0], result2[1], result2[2], result2[3],
      result3[0], result3[1], result3[2], result3[3]
    ];
}

const sin = Math.sin;
const cos = Math.cos;

const translationMatrix = (x, y, z) => {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1
    ];
}

const scaleMatrix = (w, h, d) => {
    return [
        w, 0, 0, 0,
        0, h, 0, 0,
        0, 0, d, 0,
        0, 0, 0, 1
    ];
}

const rotateXMatrix = (a) => {
    return [
        1,  0,      0,          0,
        0,  cos(a), -sin(a),    0,
        0,  sin(a), cos(a),     0,
        0,  0,      0,          1
    ];
}

const rotateYMatrix = (a) => {
    return [
        cos(a),     0,  sin(a), 0,
        0,          1,  0,      0,
        -sin(a),    0,  cos(a), 0,
        0,          0,  0,      1
    ];
}

const rotateZMatrix = (a) => {
    return [
        cos(a), -sin(a),    0,  0,
        sin(a), cos(a),     0,  0,
        0,      0,          1,  0,
        0,      0,          0,  1
    ];
};

export const rotate = (mat, angle, axis) => {
    if (axis === 'x') {
        return multiplyMatrices(mat, rotateXMatrix(angle));
    } else if (axis === 'y') {
        return multiplyMatrices(mat, rotateYMatrix(angle));
    } else if (axis === 'z') {
        return multiplyMatrices(mat, rotateZMatrix(angle));
    }
};

export const translate = (mat, vec) => {
    return multiplyMatrices(mat, translationMatrix(vec[0], vec[1], vec[2]));
}

const projector = {
    'orthographic' : [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, -1, -1,
        0, 0, 0, 0
    ],
    'default' : [
        1.8106601238250732, 0, 0, 0,
        0, 2.4142136573791504, 0, 0,
        0, 0, -1.0020020008087158, -1,
        0, 0, -0.20020020008087158, 0
    ]
}

export const getProjectorType = (projectorType) => {
    if (projector[projectorType] === undefined) {
        return projector['default'];
    }
    return projector[projectorType];
}

const frustum = (left, right, bottom, top, near, far) => {
    const rl = right - left;
    const tb = top - bottom;
    const fn = far - near;

    return [
        (near * 2.0) / rl, 0, 0, 0,
        0, (near * 2.0) / tb, 0, 0,
        (right + left) / rl, (top + bottom) / tb, -(far + near) / fn, -1,
        0, 0, -(far * near * 2.0) / fn, 0
    ];
}

export const perspective = (fovy, aspect, near, far) => {
    const top = near * Math.tan(fovy / 2);
    const right = top * aspect;
    return frustum(-right, right, -top, top, near, far);
}

export const orthographic = (left, right, bottom, top, near, far) => {
    const rl = right - left;
    const tb = top - bottom;
    const fn = far - near;
    
    return transpose([
        2/rl, 0, 0, 0,
        0, 2/tb, 0, 0,
        0, 0, -2/fn, 0,
        -(left+right)/rl, -(top+bottom)/tb, -(far+near)/fn, 1
    ]);
}

export const oblique = (theta, phi) => {
    const cotT = 1/Math.tan(theta);
    const cotP = 1/Math.tan(phi);

    const H = transpose([
        1, 0, 0, 0,
        0, 1, 0, 0,
        cotT, cotP, 1, 0,
        0, 0, 0, 1,
    ]);

    let mat = create();
    mat[10] = 0;
    mat = multiplyMatrices(mat, orthographic(-1, 1, -1, 1, -1, 1));
    mat = multiplyMatrices(mat, H);
    return mat;
}