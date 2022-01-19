export const rotation_tests: {
  [key: string]: {
    [key: number]: {
      [key: number]: number[][]
    }
  }
} = {
  nonI: {
    0: {
      1: [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [0, 2],
        [-1, 2],
      ],
      3: [
        [0, 0],
        [1, 0],
        [1, -1],
        [0, 2],
        [1, 2],
      ],
    },
    1: {
      0: [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, -2],
        [1, -2],
      ],
      2: [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, -2],
        [1, -2],
      ],
    },
    2: {
      1: [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [0, 2],
        [-1, 2],
      ],
      3: [
        [0, 0],
        [1, 0],
        [1, -1],
        [0, 2],
        [1, 2],
      ],
    },
    3: {
      2: [
        [0, 0],
        [-1, 0],
        [-1, 1],
        [0, -2],
        [-1, -2],
      ],
      0: [
        [0, 0],
        [-1, 0],
        [-1, 1],
        [0, -2],
        [-1, -2],
      ],
    },
  },
  I: {
    0: {
      1: [
        [0, 0],
        [-2, 0],
        [1, 0],
        [-2, -1],
        [1, -2],
      ],
      3: [
        [0, 0],
        [-1, 0],
        [2, 0],
        [-1, -2],
        [2, 1],
      ],
    },
    1: {
      0: [
        [0, 0],
        [2, 0],
        [-1, 0],
        [2, -1],
        [-1, 2],
      ],
      2: [
        [0, 0],
        [-1, 0],
        [2, 0],
        [-1, 2],
        [2, 1],
      ],
    },
    2: {
      1: [
        [0, 0],
        [1, 0],
        [-2, 0],
        [1, 2],
        [-2, -1],
      ],
      3: [
        [0, 0],
        [2, 0],
        [-1, 0],
        [2, -1],
        [-1, 2],
      ],
    },
    3: {
      2: [
        [0, 0],
        [-2, 0],
        [1, 0],
        [-2, 1],
        [1, -2],
      ],
      0: [
        [0, 0],
        [1, 0],
        [-2, 0],
        [1, 2],
        [-2, -1],
      ],
    },
  },
};

export const shape_data: {
  [key: string]: {
    [key: string]: number[][] | string
  }
} = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "#0DDCE5",
  },
  J: {
    shape: [
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    color: "#1F77F7",
  },
  L: {
    shape: [
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    color: "#E9800F",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#F9EC23",
  },
  S: {
    shape: [
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "#01D705",
  },
  T: {
    shape: [
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    color: "#FC59FE",
  },
  Z: {
    shape: [
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    color: "#E83B40",
  },
};
