import {
  GRID_COLUMNS,
  GRID_ROWS,
  MIN_CLUSTER_SIZE,
  PAYTABLE_CAP_CLUSTER_SIZE,
  PAYTABLE_CAP_MULTIPLIER,
  PAYTABLE_CURVE_EXPONENT,
  SLOT_SYMBOLS,
  WILD_SYMBOL_ID,
} from "./symbols.config";

const getTotalWeight = (symbols) => symbols.reduce((sum, symbol) => sum + symbol.weight, 0);

const pickWeightedSymbol = (symbols, totalWeight, rng) => {
  const roll = rng() * totalWeight;
  let runningWeight = 0;

  for (const symbol of symbols) {
    runningWeight += symbol.weight;
    if (roll <= runningWeight) {
      return symbol.id;
    }
  }

  return symbols[symbols.length - 1].id;
};

export const createRandomSymbolId = ({
  symbols = SLOT_SYMBOLS,
  rng = Math.random,
} = {}) => {
  const totalWeight = getTotalWeight(symbols);
  return pickWeightedSymbol(symbols, totalWeight, rng);
};

export const createRandomGrid = ({
  columns = GRID_COLUMNS,
  rows = GRID_ROWS,
  symbols = SLOT_SYMBOLS,
  rng = Math.random,
} = {}) => {
  const totalWeight = getTotalWeight(symbols);

  return Array.from({ length: rows }, () => (
    Array.from({ length: columns }, () => pickWeightedSymbol(symbols, totalWeight, rng))
  ));
};

const DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const toPositionKey = (row, column) => `${row}:${column}`;

const parsePositionKey = (key) => {
  const [row, column] = key.split(":").map(Number);
  return { row, column };
};

const roundCurrency = (value) => Math.round(value * 100) / 100;

const buildSymbolLookup = (symbols) => {
  return symbols.reduce((acc, symbol) => {
    acc[symbol.id] = symbol;
    return acc;
  }, {});
};

const getNonWildSymbolsByPriority = (symbols) => {
  return symbols
    .filter((symbol) => symbol.id !== WILD_SYMBOL_ID)
    .sort((left, right) => right.payoutTier - left.payoutTier);
};

const collectAvailableWilds = (grid) => {
  const keys = [];

  for (let row = 0; row < grid.length; row += 1) {
    for (let column = 0; column < grid[row].length; column += 1) {
      if (grid[row][column] === WILD_SYMBOL_ID) {
        keys.push(toPositionKey(row, column));
      }
    }
  }

  return new Set(keys);
};

const detectComponentsForSymbol = ({ grid, symbolId, availableWildKeys }) => {
  const rowCount = grid.length;
  const columnCount = grid[0].length;
  const visited = new Set();
  const components = [];

  const isEligibleCell = (row, column) => {
    const symbol = grid[row][column];
    const key = toPositionKey(row, column);

    if (symbol === symbolId) {
      return true;
    }

    return symbol === WILD_SYMBOL_ID && availableWildKeys.has(key);
  };

  for (let row = 0; row < rowCount; row += 1) {
    for (let column = 0; column < columnCount; column += 1) {
      const startKey = toPositionKey(row, column);

      if (visited.has(startKey) || !isEligibleCell(row, column)) {
        continue;
      }

      const stack = [{ row, column }];
      const componentKeys = [];
      const componentWildKeys = [];
      let componentSymbolCount = 0;

      while (stack.length > 0) {
        const current = stack.pop();
        const currentKey = toPositionKey(current.row, current.column);

        if (visited.has(currentKey) || !isEligibleCell(current.row, current.column)) {
          continue;
        }

        visited.add(currentKey);
        componentKeys.push(currentKey);

        if (grid[current.row][current.column] === WILD_SYMBOL_ID) {
          componentWildKeys.push(currentKey);
        } else {
          componentSymbolCount += 1;
        }

        for (const [rowOffset, columnOffset] of DIRECTIONS) {
          const nextRow = current.row + rowOffset;
          const nextColumn = current.column + columnOffset;

          if (
            nextRow >= 0
            && nextRow < rowCount
            && nextColumn >= 0
            && nextColumn < columnCount
          ) {
            stack.push({ row: nextRow, column: nextColumn });
          }
        }
      }

      components.push({
        symbolId,
        keys: componentKeys,
        wildKeys: componentWildKeys,
        symbolCount: componentSymbolCount,
      });
    }
  }

  return components;
};

export const findWinningClusters = ({
  grid,
  symbols = SLOT_SYMBOLS,
  minimumClusterSize = MIN_CLUSTER_SIZE,
} = {}) => {
  const availableWildKeys = collectAvailableWilds(grid);
  const clusters = [];

  for (const symbol of getNonWildSymbolsByPriority(symbols)) {
    const components = detectComponentsForSymbol({
      grid,
      symbolId: symbol.id,
      availableWildKeys,
    });

    for (const component of components) {
      const clusterSize = component.keys.length;
      const hasBaseSymbol = component.symbolCount > 0;

      if (!hasBaseSymbol || clusterSize < minimumClusterSize) {
        continue;
      }

      for (const wildKey of component.wildKeys) {
        availableWildKeys.delete(wildKey);
      }

      clusters.push({
        symbolId: component.symbolId,
        size: clusterSize,
        positions: component.keys.map(parsePositionKey),
        wildPositions: component.wildKeys.map(parsePositionKey),
      });
    }
  }

  return clusters;
};

export const calculateClusterPayout = ({
  cluster,
  bet,
  symbols = SLOT_SYMBOLS,
} = {}) => {
  const symbolLookup = buildSymbolLookup(symbols);
  const symbol = symbolLookup[cluster.symbolId];

  if (!symbol) {
    return 0;
  }

  const baseMultiplier = symbol.basePayoutMultiplier ?? 0;

  if (cluster.size <= MIN_CLUSTER_SIZE) {
    return roundCurrency(baseMultiplier * bet);
  }

  if (cluster.size >= PAYTABLE_CAP_CLUSTER_SIZE) {
    return roundCurrency(baseMultiplier * PAYTABLE_CAP_MULTIPLIER * bet);
  }

  const normalizedProgress = (cluster.size - MIN_CLUSTER_SIZE)
    / (PAYTABLE_CAP_CLUSTER_SIZE - MIN_CLUSTER_SIZE);
  const easedProgress = Math.pow(normalizedProgress, PAYTABLE_CURVE_EXPONENT);
  const scaledMultiplier = baseMultiplier * (1 + ((PAYTABLE_CAP_MULTIPLIER - 1) * easedProgress));

  return roundCurrency(scaledMultiplier * bet);
};

export const evaluateSpinOutcome = ({
  grid,
  bet,
  symbols = SLOT_SYMBOLS,
  minimumClusterSize = MIN_CLUSTER_SIZE,
} = {}) => {
  const clusters = findWinningClusters({
    grid,
    symbols,
    minimumClusterSize,
  });

  const clustersWithPayout = clusters.map((cluster) => ({
    ...cluster,
    payout: calculateClusterPayout({ cluster, bet, symbols }),
  }));

  const totalPayout = clustersWithPayout.reduce((sum, cluster) => sum + cluster.payout, 0);

  return {
    clusters: clustersWithPayout,
    totalPayout,
  };
};

export const runWildPrioritySelfTest = () => {
  const filler = "J";
  const grid = Array.from({ length: GRID_ROWS }, () => Array.from({ length: GRID_COLUMNS }, () => filler));

  grid[2][3] = WILD_SYMBOL_ID;

  // n1 cluster candidate (4 n1 + 1 shared WILD)
  grid[0][4] = "n1";
  grid[1][4] = "n1";
  grid[2][4] = "n1";
  grid[3][4] = "n1";

  // A cluster candidate (4 A + same shared WILD)
  grid[1][2] = "A";
  grid[2][2] = "A";
  grid[3][2] = "A";
  grid[4][2] = "A";

  const outcome = evaluateSpinOutcome({ grid, bet: 1 });
  const hasN1Cluster = outcome.clusters.some((cluster) => cluster.symbolId === "n1" && cluster.size >= 5);
  const hasACluster = outcome.clusters.some((cluster) => cluster.symbolId === "A" && cluster.size >= 5);

  return {
    passed: hasN1Cluster && !hasACluster,
    outcome,
  };
};
