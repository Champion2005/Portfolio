import React from "react";
import { motion } from "motion/react";
import { FaCircleQuestion, FaGear } from "react-icons/fa6";
import {
  GRID_COLUMNS,
  GRID_ROWS,
  MIN_CLUSTER_SIZE,
  PAYTABLE_CAP_CLUSTER_SIZE,
  SLOT_SYMBOLS,
} from "./symbols.config";
import {
  calculateClusterPayout,
  createRandomGrid,
  createRandomSymbolId,
  evaluateSpinOutcome,
  runWildPrioritySelfTest,
} from "./slotEngine";

const BET_OPTIONS = [1, 2, 5];
const DEFAULT_BANKROLL = 1000;
const BASE_WIN_ANIMATION_MS = 620;
const BASE_DROP_ANIMATION_MS = 620;
const BASE_SPIN_CLEAR_MS = 380;
const BASE_NEW_BOARD_DROP_MS = 680;
const BASE_COLUMN_STAGGER_MS = 90;
const BASE_ROW_ACCORDION_MS = 70;
const BASE_POST_WIN_GRAVITY_DELAY_MS = 90;
const AUDIO_SOURCE = "/slots/bgmusic/bg-music-default.mp3";
const roundCurrency = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const formatCurrency = (value) => roundCurrency(value).toFixed(2);

const wait = (duration) => new Promise((resolve) => {
  window.setTimeout(resolve, duration);
});

const toPositionKey = (row, column) => `${row}:${column}`;
const SMOOTH_EASE_OUT = [0.22, 1, 0.36, 1];
const SMOOTH_EASE_IN = [0.4, 0, 1, 1];
const SMOOTH_EASE_IN_OUT = [0.45, 0.05, 0.55, 0.95];

const getSpinDropDelayMs = (rowIndex, columnIndex, columnStaggerMs, rowAccordionMs) => (
  (columnIndex * columnStaggerMs) + ((GRID_ROWS - 1 - rowIndex) * rowAccordionMs)
);

const getCascadeDropDelayMs = (columnIndex, dropRows, columnStaggerMs, rowAccordionMs) => {
  if (dropRows <= 0) {
    return 0;
  }

  return (columnIndex * columnStaggerMs) + ((dropRows - 1) * rowAccordionMs);
};

const MAX_DROP_ROWS = GRID_ROWS * 2;
const getMaxDropStaggerMs = (columnStaggerMs, rowAccordionMs) => (
  ((GRID_COLUMNS - 1) * columnStaggerMs) + ((MAX_DROP_ROWS - 1) * rowAccordionMs)
);

const createCellGridFromSymbols = ({ symbolGrid, nextCellIdRef }) => {
  return symbolGrid.map((row, rowIndex) => row.map((symbolId) => ({
    id: nextCellIdRef.current++,
    symbolId,
    isNew: true,
    dropRows: GRID_ROWS + rowIndex + 1,
    version: 0,
  })));
};

const toSymbolGrid = (cellGrid) => cellGrid.map((row) => row.map((cell) => cell.symbolId));

const getWinningKeySet = (clusters) => {
  const keys = new Set();

  for (const cluster of clusters) {
    for (const position of cluster.positions) {
      keys.add(toPositionKey(position.row, position.column));
    }
  }

  return keys;
};

const applyCascadeGravity = ({ currentGrid, winningKeys, nextCellIdRef }) => {
  const rowCount = currentGrid.length;
  const columnCount = currentGrid[0].length;
  const nextGrid = Array.from({ length: rowCount }, () => Array(columnCount));

  for (let column = 0; column < columnCount; column += 1) {
    const survivors = [];

    for (let row = 0; row < rowCount; row += 1) {
      const key = toPositionKey(row, column);
      if (!winningKeys.has(key)) {
        survivors.push({ ...currentGrid[row][column], isNew: false, sourceRow: row });
      }
    }

    const spawnCount = rowCount - survivors.length;
    const spawnedCells = Array.from({ length: spawnCount }, (_, spawnIndex) => ({
      id: nextCellIdRef.current++,
      symbolId: createRandomSymbolId(),
      isNew: true,
      dropRows: spawnCount + spawnIndex + 1,
      version: 0,
    }));

    const shiftedSurvivors = survivors.map((cell, index) => {
      const newRow = spawnCount + index;
      const dropRows = newRow - cell.sourceRow;

      return {
        ...cell,
        dropRows,
        version: dropRows > 0 ? cell.version + 1 : cell.version,
      };
    });

    const finalColumn = [...spawnedCells, ...shiftedSurvivors];

    for (let row = 0; row < rowCount; row += 1) {
      nextGrid[row][column] = finalColumn[row];
    }
  }

  return nextGrid;
};

const clearNewFlags = (cellGrid) => {
  return cellGrid.map((row) => row.map((cell) => ({
    ...cell,
    isNew: false,
    dropRows: 0,
  })));
};

const SlotsPage = () => {
  const nextCellIdRef = React.useRef(1);
  const gridRef = React.useRef(null);
  const [grid, setGrid] = React.useState(() => createCellGridFromSymbols({
    symbolGrid: createRandomGrid(),
    nextCellIdRef,
  }));
  const [rowStepPx, setRowStepPx] = React.useState(58);
  const [bankroll, setBankroll] = React.useState(DEFAULT_BANKROLL);
  const [selectedBet, setSelectedBet] = React.useState(1);
  const [spinSpeed, setSpinSpeed] = React.useState("normal");
  const [isMusicOn, setIsMusicOn] = React.useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isPayTableOpen, setIsPayTableOpen] = React.useState(false);
  const [isCascading, setIsCascading] = React.useState(false);
  const [isBoardClearing, setIsBoardClearing] = React.useState(false);
  const [winningKeys, setWinningKeys] = React.useState(() => new Set());
  const [lastSpin, setLastSpin] = React.useState({ clusters: [], totalPayout: 0 });
  const audioRef = React.useRef(null);

  React.useLayoutEffect(() => {
    const updateRowStep = () => {
      const gridElement = gridRef.current;
      if (!gridElement) {
        return;
      }

      const firstCell = gridElement.firstElementChild;
      if (!firstCell) {
        return;
      }

      const firstCellRect = firstCell.getBoundingClientRect();
      const computedGridStyle = window.getComputedStyle(gridElement);
      const rowGap = Number.parseFloat(computedGridStyle.rowGap || "0") || 0;
      const measuredStep = firstCellRect.height + rowGap;

      if (Number.isFinite(measuredStep) && measuredStep > 0) {
        setRowStepPx(measuredStep);
      }
    };

    updateRowStep();
    window.addEventListener("resize", updateRowStep);

    return () => {
      window.removeEventListener("resize", updateRowStep);
    };
  }, [grid]);

  const symbolsById = React.useMemo(() => {
    return SLOT_SYMBOLS.reduce((acc, symbol) => {
      acc[symbol.id] = symbol;
      return acc;
    }, {});
  }, []);

  const payTableClusterSizes = React.useMemo(() => {
    const sizes = [];
    for (let size = MIN_CLUSTER_SIZE; size < PAYTABLE_CAP_CLUSTER_SIZE; size += 1) {
      sizes.push(size);
    }
    sizes.push(`${PAYTABLE_CAP_CLUSTER_SIZE}+`);
    return sizes;
  }, []);

  const payTableSymbols = React.useMemo(() => {
    return SLOT_SYMBOLS
      .filter((symbol) => symbol.id !== "WILD")
      .sort((left, right) => right.payoutTier - left.payoutTier);
  }, []);

  const payTableRows = React.useMemo(() => {
    return payTableSymbols.map((symbol) => {
      const payouts = payTableClusterSizes.map((sizeValue) => {
        const numericSize = typeof sizeValue === "number" ? sizeValue : PAYTABLE_CAP_CLUSTER_SIZE;

        const payout = calculateClusterPayout({
          cluster: { symbolId: symbol.id, size: numericSize },
          bet: selectedBet,
        });

        return {
          key: sizeValue,
          payout: formatCurrency(payout),
        };
      });

      return {
        symbol,
        payouts,
      };
    });
  }, [payTableClusterSizes, payTableSymbols, selectedBet]);

  const timing = React.useMemo(() => {
    const speedMultiplier = spinSpeed === "fast" ? 0.42 : 1;
    const columnStaggerMs = Math.max(26, Math.round(BASE_COLUMN_STAGGER_MS * speedMultiplier));
    const rowAccordionMs = Math.max(20, Math.round(BASE_ROW_ACCORDION_MS * speedMultiplier));
    const maxDropStaggerMs = getMaxDropStaggerMs(columnStaggerMs, rowAccordionMs);
    const spinClearMs = Math.max(160, Math.round(BASE_SPIN_CLEAR_MS * speedMultiplier));
    const clearTotalMs = spinClearMs + maxDropStaggerMs;

    return {
      winAnimationMs: Math.max(220, Math.round(BASE_WIN_ANIMATION_MS * speedMultiplier)),
      dropAnimationMs: Math.max(220, Math.round(BASE_DROP_ANIMATION_MS * speedMultiplier)),
      spinClearMs,
      newBoardDropMs: Math.max(260, Math.round(BASE_NEW_BOARD_DROP_MS * speedMultiplier)),
      postWinGravityDelayMs: Math.max(30, Math.round(BASE_POST_WIN_GRAVITY_DELAY_MS * speedMultiplier)),
      columnStaggerMs,
      rowAccordionMs,
      maxDropStaggerMs,
      clearTotalMs,
      clearOverlapHalfMs: Math.floor(clearTotalMs / 2),
    };
  }, [spinSpeed]);

  React.useEffect(() => {
    const testResult = runWildPrioritySelfTest();
    console.info(
      `[WILD PRIORITY TEST] ${testResult.passed ? "PASSED" : "FAILED"} - n1 takes shared WILD over A.`
    );
  }, []);

  React.useEffect(() => {
    const audio = new Audio(AUDIO_SOURCE);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "auto";
    audioRef.current = audio;

    audio.play().catch(() => {
      console.info("[MUSIC] Autoplay blocked by browser policy. Music will start on next user interaction.");
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const handleToggleMusic = () => {
    const audio = audioRef.current;

    setIsMusicOn((currentValue) => {
      const nextValue = !currentValue;

      if (audio) {
        if (nextValue) {
          audio.play().catch(() => {
            console.info("[MUSIC] Playback was blocked by browser policy until user interaction.");
          });
        } else {
          audio.pause();
          audio.currentTime = 0;
        }
      }

      return nextValue;
    });
  };

  const getSpinDelay = (rowIndex, columnIndex) => {
    return getSpinDropDelayMs(rowIndex, columnIndex, timing.columnStaggerMs, timing.rowAccordionMs);
  };

  const getCascadeDelay = (columnIndex, dropRows) => {
    return getCascadeDropDelayMs(columnIndex, dropRows, timing.columnStaggerMs, timing.rowAccordionMs);
  };

  const handleSpin = async () => {
    if (isCascading) {
      return;
    }

    if (bankroll < selectedBet) {
      console.info("[BANKROLL AUTO-REPLENISH] Balance below selected bet. Resetting to $1000.");
      setBankroll(DEFAULT_BANKROLL);
      setLastSpin({ clusters: [], totalPayout: 0 });
      return;
    }

    setIsCascading(true);
    setLastSpin({ clusters: [], totalPayout: 0 });

    let runningGrid = createCellGridFromSymbols({
      symbolGrid: createRandomGrid(),
      nextCellIdRef,
    });
    let combinedClusters = [];
    let combinedPayout = 0;

    setIsBoardClearing(true);
    setBankroll((currentBankroll) => roundCurrency(currentBankroll - selectedBet));
    if (isMusicOn && audioRef.current?.paused) {
      audioRef.current.play().catch(() => {
        console.info("[MUSIC] Playback was blocked by browser policy until user interaction.");
      });
    }
    await wait(timing.clearTotalMs);

    setGrid(runningGrid);
    setIsBoardClearing(false);

    // Let the fresh spin board visibly tumble in from the top before win evaluation.
    await wait(timing.newBoardDropMs + timing.maxDropStaggerMs);

    runningGrid = clearNewFlags(runningGrid);
    setGrid(runningGrid);

    while (true) {
      const outcome = evaluateSpinOutcome({
        grid: toSymbolGrid(runningGrid),
        bet: selectedBet,
      });

      if (outcome.clusters.length === 0) {
        if (combinedClusters.length === 0) {
          console.info("[CLUSTER DETECTED] None on this spin.");
        }
        break;
      }

      outcome.clusters.forEach((cluster) => {
        console.info(
          `[CLUSTER DETECTED] Symbol: "${cluster.symbolId}", Size: ${cluster.size}, Payout: $${cluster.payout}`
        );
      });

      combinedClusters = [...combinedClusters, ...outcome.clusters];
      combinedPayout += outcome.totalPayout;
      setBankroll((currentBankroll) => roundCurrency(currentBankroll + outcome.totalPayout));

      const currentWinningKeys = getWinningKeySet(outcome.clusters);
      setWinningKeys(currentWinningKeys);
      await wait(timing.winAnimationMs);
      await wait(timing.postWinGravityDelayMs);

      runningGrid = applyCascadeGravity({
        currentGrid: runningGrid,
        winningKeys: currentWinningKeys,
        nextCellIdRef,
      });

      setWinningKeys(new Set());
      setGrid(runningGrid);
      await wait(timing.dropAnimationMs + timing.maxDropStaggerMs);

      runningGrid = clearNewFlags(runningGrid);
      setGrid(runningGrid);
    }

    setLastSpin({
      clusters: combinedClusters,
      totalPayout: roundCurrency(combinedPayout),
    });
    setIsCascading(false);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#033b5e] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,207,1,0.28),transparent_44%),radial-gradient(circle_at_86%_16%,rgba(0,85,150,0.42),transparent_52%),linear-gradient(180deg,#033b5e_0%,#005596_100%)]" />

      <main className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center px-3 py-2 sm:px-6">
        <div className="absolute right-2 top-2 z-30 flex items-center gap-2 sm:right-4 sm:top-4">
          <button
            type="button"
            aria-label="Open pay table"
            onClick={() => setIsPayTableOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ffcf01]/65 bg-[#005596]/85 text-[#ffcf01] shadow-[0_10px_22px_rgba(3,59,94,0.45)] transition hover:scale-105 hover:bg-[#0a6cb6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcf01] focus-visible:ring-offset-2 focus-visible:ring-offset-[#033b5e]"
          >
            <FaCircleQuestion className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Open settings"
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ffcf01]/65 bg-[#005596]/85 text-[#ffcf01] shadow-[0_10px_22px_rgba(3,59,94,0.45)] transition hover:scale-105 hover:bg-[#0a6cb6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcf01] focus-visible:ring-offset-2 focus-visible:ring-offset-[#033b5e]"
          >
            <FaGear className="h-4 w-4" />
          </button>
        </div>

        <img
          src="/slots/assets/GAMELOGO.svg"
          alt="Slot game logo"
          className="mb-2 h-10 w-auto sm:mb-3 sm:h-14"
          draggable="false"
        />

        <section className="w-full rounded-2xl border border-[#ffcf01]/45 bg-[#033b5e]/65 p-2 shadow-[0_14px_32px_rgba(3,59,94,0.45)] backdrop-blur-sm sm:p-3">
          <div className="relative mx-auto w-[min(94vw,78vh)] overflow-hidden rounded-xl">
            <div ref={gridRef} className="grid aspect-[7/6] grid-cols-7 grid-rows-6 gap-1 sm:gap-1.5">
            {grid.map((row, rowIndex) => row.map((cell, columnIndex) => {
                const symbol = symbolsById[cell.symbolId];
              const isTextSymbol = symbol.renderType === "text";
                const key = toPositionKey(rowIndex, columnIndex);
                const isWinning = winningKeys.has(key);
                const dropDelayMs = cell.isNew
                  ? getSpinDelay(rowIndex, columnIndex)
                  : getCascadeDelay(columnIndex, cell.dropRows);

              return (
                <motion.div
                  key={`${cell.id}-${cell.version}`}
                  initial={cell.dropRows > 0 ? { y: -(rowStepPx * cell.dropRows), opacity: 1 } : false}
                  animate={isBoardClearing
                    ? { y: 84, opacity: 0 }
                    : isWinning
                      ? { scale: [1, 1.14, 1.08, 0], opacity: [1, 1, 1, 0] }
                      : { y: 0, opacity: 1 }}
                  transition={isBoardClearing
                    ? {
                      duration: timing.spinClearMs / 1000,
                      delay: getSpinDelay(rowIndex, columnIndex) / 1000,
                      ease: SMOOTH_EASE_IN,
                    }
                    : isWinning
                      ? { duration: timing.winAnimationMs / 1000, ease: SMOOTH_EASE_IN_OUT }
                      : {
                        duration: cell.isNew ? timing.newBoardDropMs / 1000 : timing.dropAnimationMs / 1000,
                        delay: dropDelayMs / 1000,
                        ease: SMOOTH_EASE_OUT,
                      }}
                  style={{ willChange: "transform, opacity" }}
                  className="flex items-center justify-center rounded-md border border-[#ffcf01]/40 bg-[#005596]/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                >
                  {isTextSymbol ? (
                    <span className="select-none text-[clamp(1rem,2.8vh,1.5rem)] font-black tracking-wide text-[#ffcf01] [text-shadow:0_2px_8px_rgba(0,0,0,0.35)]">
                      {symbol.label}
                    </span>
                  ) : (
                    <img
                      src={symbol.assetPath}
                      alt={symbol.label}
                      className="h-[74%] w-[74%] object-contain"
                      draggable="false"
                    />
                  )}
                </motion.div>
              );
              }))}
            </div>
          </div>
        </section>

        <div className="mt-2 flex w-full max-w-2xl flex-wrap items-center justify-center gap-2 sm:mt-3 sm:gap-3">
          <div className="rounded-full border border-[#ffcf01]/50 bg-[#005596]/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#ffcf01] sm:text-sm">
            Bankroll: ${formatCurrency(bankroll)}
          </div>

          <div className="flex items-center gap-1 rounded-full border border-[#ffcf01]/45 bg-[#005596]/75 p-1">
            {BET_OPTIONS.map((betOption) => {
              const isActive = betOption === selectedBet;

              return (
                <button
                  key={betOption}
                  type="button"
                  onClick={() => setSelectedBet(betOption)}
                  disabled={isCascading}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] transition sm:px-4 sm:text-sm ${
                    isActive
                      ? "bg-[#ffcf01] text-[#033b5e] shadow-[0_0_0_1px_rgba(255,255,255,0.25)]"
                      : "bg-[#005596] text-[#ffcf01] hover:bg-[#0a6cb6]"
                  } ${isCascading ? "cursor-not-allowed opacity-45 hover:bg-[#005596]" : ""}`}
                >
                  ${betOption}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleSpin}
            disabled={isCascading}
            className={`rounded-full border-2 border-[#ffcf01] bg-[#005596] px-6 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#ffcf01] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcf01] focus-visible:ring-offset-2 focus-visible:ring-offset-[#033b5e] ${
              isCascading
                ? "cursor-not-allowed opacity-45"
                : "hover:-translate-y-0.5 hover:bg-[#0a6cb6]"
            }`}
          >
            {isCascading ? "Tumbling..." : "Spin"}
          </button>

          <div className="w-full text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#b8dbd9] sm:text-xs">
            Last Payout: ${formatCurrency(lastSpin.totalPayout)}
            {lastSpin.clusters.length > 0
              ? ` | Clusters: ${lastSpin.clusters.map((cluster) => `${cluster.symbolId} x${cluster.size}`).join(", ")}`
              : " | Clusters: None"}
          </div>
        </div>

      </main>

      {isSettingsOpen ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#033b5e]/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[#ffcf01]/55 bg-[#005596] p-4 shadow-[0_26px_42px_rgba(3,59,94,0.55)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-[#ffcf01]">Settings</h2>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-full border border-[#ffcf01]/70 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#ffcf01] transition hover:bg-[#0a6cb6]"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#b8dbd9]">Spin Speed</p>
                <div className="flex gap-2">
                  {[
                    { value: "normal", label: "Normal" },
                    { value: "fast", label: "Fast" },
                  ].map((option) => {
                    const isActive = option.value === spinSpeed;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSpinSpeed(option.value)}
                        className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition ${
                          isActive
                            ? "border-[#ffcf01] bg-[#ffcf01] text-[#033b5e]"
                            : "border-[#ffcf01]/60 bg-[#005596] text-[#ffcf01] hover:bg-[#0a6cb6]"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#b8dbd9]">Music</p>
                <button
                  type="button"
                  onClick={handleToggleMusic}
                  className={`w-full rounded-lg border px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition ${
                    isMusicOn
                      ? "border-[#ffcf01] bg-[#ffcf01] text-[#033b5e]"
                      : "border-[#ffcf01]/60 bg-[#005596] text-[#ffcf01] hover:bg-[#0a6cb6]"
                  }`}
                >
                  {isMusicOn ? "On" : "Off"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isPayTableOpen ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#033b5e]/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-5xl rounded-2xl border border-[#ffcf01]/55 bg-[#005596] p-4 shadow-[0_26px_42px_rgba(3,59,94,0.55)]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-[#ffcf01]">Pay Table</h2>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#b8dbd9] sm:text-xs">
                  Bet Basis: ${selectedBet.toFixed(2)} | 12+ = 100x of 5-cluster
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPayTableOpen(false)}
                className="rounded-full border border-[#ffcf01]/70 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#ffcf01] transition hover:bg-[#0a6cb6]"
              >
                Close
              </button>
            </div>

            <div className="max-h-[72vh] overflow-auto rounded-lg border border-[#ffcf01]/25 bg-[#033b5e]/40">
              <table className="min-w-full border-separate border-spacing-0 text-left text-[11px] sm:text-xs">
                <thead>
                  <tr>
                    <th className="sticky left-0 top-0 z-20 border-b border-r border-[#ffcf01]/30 bg-[#005596] px-3 py-2 font-bold uppercase tracking-[0.08em] text-[#ffcf01]">
                      Symbol
                    </th>
                    {payTableClusterSizes.map((sizeValue) => (
                      <th
                        key={sizeValue}
                        className="sticky top-0 z-10 border-b border-[#ffcf01]/30 bg-[#005596] px-2 py-2 text-center font-bold uppercase tracking-[0.08em] text-[#ffcf01]"
                      >
                        {sizeValue}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payTableRows.map(({ symbol, payouts }) => (
                    <tr key={symbol.id}>
                      <td className="sticky left-0 z-10 border-b border-r border-[#ffcf01]/20 bg-[#005596]/95 px-3 py-2 font-semibold uppercase tracking-[0.06em] text-[#ffcf01]">
                        {symbol.renderType === "asset" ? symbol.label : symbol.id}
                      </td>
                      {payouts.map(({ key, payout }) => (
                        <td key={key} className="border-b border-[#ffcf01]/20 px-2 py-2 text-center font-semibold text-white">
                          ${payout}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SlotsPage;
