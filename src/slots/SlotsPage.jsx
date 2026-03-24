import React from "react";
import { motion } from "motion/react";
import { FaCircleQuestion, FaClock, FaGear } from "react-icons/fa6";
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
  createSpinStartGrid,
  createRandomSymbolId,
  evaluateSpinOutcome,
  runWildPrioritySelfTest,
} from "./slotEngine";

const BET_OPTIONS = [1, 2, 5, 20, 100];
const DEFAULT_BANKROLL = 1000;
const BASE_WIN_ANIMATION_MS = 620;
const BASE_DROP_ANIMATION_MS = 620;
const BASE_SPIN_CLEAR_MS = 380;
const BASE_NEW_BOARD_DROP_MS = 680;
const BASE_COLUMN_STAGGER_MS = 90;
const BASE_ROW_ACCORDION_MS = 70;
const BASE_POST_WIN_GRAVITY_DELAY_MS = 90;
const AUDIO_SOURCE = "/slots/bgmusic/bg-music-default.mp3";
const WIN_AUDIO_SOURCE = "/slots/bgmusic/win_music.mp3";
const POP_AUDIO_SOURCE = "/slots/bgmusic/pop.mp3";
const BIG_WIN_MIN_MULTIPLIER = 4;
const SPIN_START_TARGET_HIT_RATE = 0.62;
const SLOTS_SESSION_STORAGE_KEY = "slots.session.v1";
const MAX_WIN_HISTORY_ENTRIES = 80;
const WIN_HISTORY_ROWS_PER_PAGE = 15;
const POP_MULTI_CLUSTER_DELAY_MS = 120;
const WIN_HOLD_MS = 500;
const NORMAL_TILE_BG = "rgba(0, 85, 150, 0.9)";
const FLASH_TILE_BG = "rgba(46, 168, 226, 0.98)";
const HELP_AUTO_OPEN_MIN_WIDTH = 1000;
const HELP_AUTO_OPEN_MIN_HEIGHT = 820;
const roundCurrency = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const formatCurrency = (value) => roundCurrency(value).toFixed(2);

const readSlotsSessionState = () => {
  try {
    const rawSession = window.sessionStorage.getItem(SLOTS_SESSION_STORAGE_KEY);
    if (!rawSession) {
      return null;
    }

    const parsedSession = JSON.parse(rawSession);
    return parsedSession && typeof parsedSession === "object" ? parsedSession : null;
  } catch {
    return null;
  }
};

const writeSlotsSessionState = (state) => {
  try {
    window.sessionStorage.setItem(SLOTS_SESSION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore session storage failures so gameplay still works.
  }
};

const isValidGridCell = (cell) => {
  return Boolean(
    cell
    && typeof cell.id === "number"
    && typeof cell.symbolId === "string"
    && typeof cell.isNew === "boolean"
    && typeof cell.dropRows === "number"
    && typeof cell.version === "number"
  );
};

const isValidPersistedGrid = (gridValue) => {
  return Array.isArray(gridValue)
    && gridValue.length === GRID_ROWS
    && gridValue.every((row) => Array.isArray(row)
      && row.length === GRID_COLUMNS
      && row.every(isValidGridCell));
};

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

const getWinTierByMultiplier = (multiplier) => {
  if (multiplier >= 100) {
    return { title: "BIG CSS IS WATCHING YOU", accentClass: "text-[#ffcf01]" };
  }

  if (multiplier >= 40) {
    return { title: "EPIC WIN", accentClass: "text-[#ffcf01]" };
  }

  if (multiplier >= 20) {
    return { title: "SUPER WIN", accentClass: "text-[#ffcf01]" };
  }

  if (multiplier >= 10) {
    return { title: "MEGA WIN", accentClass: "text-[#ffcf01]" };
  }

  return { title: "BIG WIN", accentClass: "text-[#ffcf01]" };
};

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
  const persistedSessionRef = React.useRef(readSlotsSessionState());
  const persistedSession = persistedSessionRef.current;

  const nextCellIdRef = React.useRef(
    Number.isFinite(persistedSession?.nextCellId) ? persistedSession.nextCellId : 1
  );
  const gridRef = React.useRef(null);
  const [grid, setGrid] = React.useState(() => createCellGridFromSymbols({
    symbolGrid: createRandomGrid(),
    nextCellIdRef,
  }));
  const [rowStepPx, setRowStepPx] = React.useState(58);
  const [cellSizePx, setCellSizePx] = React.useState(48);
  const [bankroll, setBankroll] = React.useState(
    Number.isFinite(persistedSession?.bankroll) ? persistedSession.bankroll : DEFAULT_BANKROLL
  );
  const [selectedBet, setSelectedBet] = React.useState(
    BET_OPTIONS.includes(persistedSession?.selectedBet) ? persistedSession.selectedBet : 1
  );
  const [spinSpeed, setSpinSpeed] = React.useState(
    persistedSession?.spinSpeed === "fast" ? "fast" : "normal"
  );
  const [isMusicOn, setIsMusicOn] = React.useState(
    typeof persistedSession?.isMusicOn === "boolean" ? persistedSession.isMusicOn : true
  );
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isPayTableOpen, setIsPayTableOpen] = React.useState(false);
  const [isHowToOpen, setIsHowToOpen] = React.useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [historySortMode, setHistorySortMode] = React.useState("chrono");
  const [historyPage, setHistoryPage] = React.useState(1);
  const [isCascading, setIsCascading] = React.useState(false);
  const [isBoardClearing, setIsBoardClearing] = React.useState(false);
  const [winningKeys, setWinningKeys] = React.useState(() => new Set());
  const [lastSpin, setLastSpin] = React.useState(() => {
    const clusters = Array.isArray(persistedSession?.lastSpin?.clusters)
      ? persistedSession.lastSpin.clusters
      : [];
    const totalPayout = Number.isFinite(persistedSession?.lastSpin?.totalPayout)
      ? persistedSession.lastSpin.totalPayout
      : 0;

    return { clusters, totalPayout };
  });
  const [winHistory, setWinHistory] = React.useState(() => {
    return Array.isArray(persistedSession?.winHistory) ? persistedSession.winHistory : [];
  });
  const [winPopup, setWinPopup] = React.useState({
    isOpen: false,
    title: "",
    accentClass: "text-[#ffcf01]",
    upgradeCount: 0,
    bet: 1,
    displayAmount: 0,
    targetAmount: 0,
    multiplier: 0,
    isCounting: false,
  });
  const audioRef = React.useRef(null);
  const winAudioRef = React.useRef(null);
  const popAudioRef = React.useRef(null);
  const needsInteractionToPlayRef = React.useRef(false);
  const winCountAnimationFrameRef = React.useRef(null);
  const winFadeAnimationFrameRef = React.useRef(null);
  const popTimeoutsRef = React.useRef([]);

  React.useEffect(() => {
    if (isValidPersistedGrid(persistedSession?.grid)) {
      setGrid(persistedSession.grid);
    }
  }, [persistedSession]);

  React.useEffect(() => {
    if (!isPayTableOpen) {
      return;
    }

    const hasSpaceForOpenHelp = window.innerWidth >= HELP_AUTO_OPEN_MIN_WIDTH
      || window.innerHeight >= HELP_AUTO_OPEN_MIN_HEIGHT;

    setIsHowToOpen(hasSpaceForOpenHelp);
  }, [isPayTableOpen]);

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
      const measuredCellSize = Math.min(firstCellRect.height, firstCellRect.width);

      if (Number.isFinite(measuredStep) && measuredStep > 0) {
        setRowStepPx(measuredStep);
      }

      if (Number.isFinite(measuredCellSize) && measuredCellSize > 0) {
        setCellSizePx(measuredCellSize);
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

  const textSymbolFontPx = React.useMemo(() => {
    return Math.max(10, Math.round(cellSizePx * 0.6));
  }, [cellSizePx]);

  const sortedWinHistory = React.useMemo(() => {
    const copiedHistory = [...winHistory];

    if (historySortMode === "highest") {
      copiedHistory.sort((left, right) => {
        if (right.multiplier !== left.multiplier) {
          return right.multiplier - left.multiplier;
        }

        return new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime();
      });
      return copiedHistory;
    }

    copiedHistory.sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime());
    return copiedHistory;
  }, [historySortMode, winHistory]);

  const historyTotalPages = Math.max(1, Math.ceil(sortedWinHistory.length / WIN_HISTORY_ROWS_PER_PAGE));

  const pagedWinHistory = React.useMemo(() => {
    const startIndex = (historyPage - 1) * WIN_HISTORY_ROWS_PER_PAGE;
    return sortedWinHistory.slice(startIndex, startIndex + WIN_HISTORY_ROWS_PER_PAGE);
  }, [historyPage, sortedWinHistory]);

  React.useEffect(() => {
    setHistoryPage(1);
  }, [historySortMode]);

  React.useEffect(() => {
    setHistoryPage((currentPage) => Math.min(currentPage, historyTotalPages));
  }, [historyTotalPages]);

  React.useEffect(() => {
    writeSlotsSessionState({
      nextCellId: nextCellIdRef.current,
      grid,
      bankroll,
      selectedBet,
      spinSpeed,
      isMusicOn,
      lastSpin,
      winHistory,
    });
  }, [grid, bankroll, selectedBet, spinSpeed, isMusicOn, lastSpin, winHistory]);

  const timing = React.useMemo(() => {
    const speedMultiplier = spinSpeed === "fast" ? 0.42 : 1;
    const columnStaggerMs = Math.max(26, Math.round(BASE_COLUMN_STAGGER_MS * speedMultiplier));
    const rowAccordionMs = Math.max(20, Math.round(BASE_ROW_ACCORDION_MS * speedMultiplier));
    const maxDropStaggerMs = getMaxDropStaggerMs(columnStaggerMs, rowAccordionMs);
    const spinClearMs = Math.max(160, Math.round(BASE_SPIN_CLEAR_MS * speedMultiplier));
    const clearTotalMs = spinClearMs + maxDropStaggerMs;
    const preScaleFlashMs = Math.max(180, Math.round(280 * speedMultiplier));
    const holdMs = WIN_HOLD_MS;
    const implodeMs = Math.max(500, Math.round(560 * speedMultiplier));
    const winAnimationMs = preScaleFlashMs + holdMs + implodeMs;

    return {
      winAnimationMs,
      dropAnimationMs: Math.max(220, Math.round(BASE_DROP_ANIMATION_MS * speedMultiplier)),
      spinClearMs,
      newBoardDropMs: Math.max(260, Math.round(BASE_NEW_BOARD_DROP_MS * speedMultiplier)),
      postWinGravityDelayMs: Math.max(30, Math.round(BASE_POST_WIN_GRAVITY_DELAY_MS * speedMultiplier)),
      preScaleFlashMs,
      holdMs,
      preImplodeMs: preScaleFlashMs + holdMs,
      implodeMs,
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

    if (isMusicOn) {
      audio.play().catch(() => {
        needsInteractionToPlayRef.current = true;
        console.info("[MUSIC] Autoplay blocked by browser policy. Music will start on next user interaction.");
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
      needsInteractionToPlayRef.current = false;
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [isMusicOn]);

  React.useEffect(() => {
    const winAudio = new Audio(WIN_AUDIO_SOURCE);
    winAudio.loop = true;
    winAudio.volume = 0.6;
    winAudio.preload = "auto";
    winAudio.load();
    winAudioRef.current = winAudio;

    return () => {
      if (winFadeAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(winFadeAnimationFrameRef.current);
        winFadeAnimationFrameRef.current = null;
      }

      winAudio.pause();
      winAudioRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const popAudio = new Audio(POP_AUDIO_SOURCE);
    popAudio.preload = "auto";
    popAudio.volume = 0.42;
    popAudio.load();
    popAudioRef.current = popAudio;

    return () => {
      for (const timeoutId of popTimeoutsRef.current) {
        window.clearTimeout(timeoutId);
      }
      popTimeoutsRef.current = [];

      popAudio.pause();
      popAudioRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const tryStartMusicFromInteraction = () => {
      if (!isMusicOn) {
        return;
      }

      const currentAudio = audioRef.current;
      if (!currentAudio) {
        return;
      }

      if (!needsInteractionToPlayRef.current && !currentAudio.paused) {
        return;
      }

      currentAudio.play().then(() => {
        needsInteractionToPlayRef.current = false;
      }).catch(() => {
        needsInteractionToPlayRef.current = true;
      });
    };

    const interactionEvents = ["pointerdown", "touchstart", "keydown"];
    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, tryStartMusicFromInteraction, { passive: true });
    });

    return () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, tryStartMusicFromInteraction);
      });
    };
  }, [isMusicOn]);

  React.useEffect(() => {
    if (!winPopup.isOpen || !winPopup.isCounting) {
      return undefined;
    }

    const baseDurationMs = 1600 + (winPopup.multiplier * 24);
    const animationDurationMs = Math.min(18000, Math.max(6500, Math.round(baseDurationMs * 3.6)));
    const targetAmount = winPopup.targetAmount;
    const currentBet = Math.max(1, winPopup.bet || 1);
    const startedAt = performance.now();

    const step = (now) => {
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / animationDurationMs);
      const easedProgress = progress ** 2;
      const nextValue = roundCurrency(targetAmount * easedProgress);

      setWinPopup((currentValue) => {
        if (!currentValue.isOpen) {
          return currentValue;
        }

        const liveMultiplier = nextValue / currentBet;
        const liveTier = getWinTierByMultiplier(liveMultiplier);
        const didTierUpgrade = liveTier.title !== currentValue.title;

        return {
          ...currentValue,
          title: liveTier.title,
          accentClass: liveTier.accentClass,
          upgradeCount: didTierUpgrade ? currentValue.upgradeCount + 1 : currentValue.upgradeCount,
          displayAmount: nextValue,
          isCounting: progress < 1,
        };
      });

      if (progress < 1) {
        winCountAnimationFrameRef.current = window.requestAnimationFrame(step);
      }
    };

    winCountAnimationFrameRef.current = window.requestAnimationFrame(step);

    return () => {
      if (winCountAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(winCountAnimationFrameRef.current);
        winCountAnimationFrameRef.current = null;
      }
    };
  }, [winPopup.bet, winPopup.isOpen, winPopup.isCounting, winPopup.multiplier, winPopup.targetAmount]);

  React.useEffect(() => {
    return () => {
      if (winCountAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(winCountAnimationFrameRef.current);
      }
    };
  }, []);

  const playWinMusic = React.useCallback(() => {
    if (!isMusicOn) {
      return;
    }

    const winAudio = winAudioRef.current;
    if (!winAudio) {
      return;
    }

    if (winFadeAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(winFadeAnimationFrameRef.current);
      winFadeAnimationFrameRef.current = null;
    }

    winAudio.volume = 0.6;
    winAudio.currentTime = 0;
    winAudio.play().catch(() => {
      console.info("[WIN MUSIC] Playback was blocked by browser policy until user interaction.");
    });
  }, [isMusicOn]);

  const fadeOutWinMusic = React.useCallback((durationMs = 850) => {
    const winAudio = winAudioRef.current;
    if (!winAudio || winAudio.paused) {
      return;
    }

    if (winFadeAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(winFadeAnimationFrameRef.current);
      winFadeAnimationFrameRef.current = null;
    }

    const startVolume = winAudio.volume;
    const startedAt = performance.now();

    const step = (now) => {
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / durationMs);
      const nextVolume = Math.max(0, startVolume * (1 - progress));
      winAudio.volume = nextVolume;

      if (progress < 1) {
        winFadeAnimationFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      winAudio.pause();
      winAudio.currentTime = 0;
      winAudio.volume = 0.6;
      winFadeAnimationFrameRef.current = null;
    };

    winFadeAnimationFrameRef.current = window.requestAnimationFrame(step);
  }, []);

  const playClusterImplodeSfx = React.useCallback((clusterCount) => {
    if (!isMusicOn || clusterCount <= 0) {
      return;
    }

    const sourceAudio = popAudioRef.current;
    if (!sourceAudio) {
      return;
    }

    const firePop = () => {
      const popInstance = sourceAudio.cloneNode();
      popInstance.volume = sourceAudio.volume;
      popInstance.play().catch(() => {
        console.info("[POP SFX] Playback blocked by browser policy until user interaction.");
      });
    };

    firePop();

    if (clusterCount > 1) {
      const timeoutId = window.setTimeout(() => {
        firePop();
        popTimeoutsRef.current = popTimeoutsRef.current.filter((id) => id !== timeoutId);
      }, POP_MULTI_CLUSTER_DELAY_MS);

      popTimeoutsRef.current.push(timeoutId);
    }
  }, [isMusicOn]);

  React.useEffect(() => {
    if (winPopup.isOpen && !winPopup.isCounting) {
      fadeOutWinMusic();
    }
  }, [fadeOutWinMusic, winPopup.isCounting, winPopup.isOpen]);

  const openWinPopup = React.useCallback(({ payout, bet }) => {
    const multiplier = payout / bet;
    const tier = getWinTierByMultiplier(multiplier);

    playWinMusic();

    setWinPopup({
      isOpen: true,
      title: tier.title,
      accentClass: tier.accentClass,
      upgradeCount: 0,
      bet,
      displayAmount: 0,
      targetAmount: roundCurrency(payout),
      multiplier,
      isCounting: true,
    });
  }, [playWinMusic]);

  const handleSkipWinCount = React.useCallback(() => {
    if (winCountAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(winCountAnimationFrameRef.current);
      winCountAnimationFrameRef.current = null;
    }

    setWinPopup((currentValue) => ({
      ...currentValue,
      displayAmount: currentValue.targetAmount,
      isCounting: false,
    }));
  }, []);

  const handleCloseWinPopup = React.useCallback(() => {
    if (winCountAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(winCountAnimationFrameRef.current);
      winCountAnimationFrameRef.current = null;
    }

    setWinPopup({
      isOpen: false,
      title: "",
      accentClass: "text-[#ffcf01]",
      upgradeCount: 0,
      bet: 1,
      displayAmount: 0,
      targetAmount: 0,
      multiplier: 0,
      isCounting: false,
    });
  }, []);

  const handleToggleMusic = () => {
    const audio = audioRef.current;

    setIsMusicOn((currentValue) => {
      const nextValue = !currentValue;

      if (audio) {
        if (nextValue) {
          audio.play().catch(() => {
            needsInteractionToPlayRef.current = true;
            console.info("[MUSIC] Playback was blocked by browser policy until user interaction.");
          });
        } else {
          audio.pause();
          audio.currentTime = 0;
          needsInteractionToPlayRef.current = false;
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
    if (isCascading || winPopup.isOpen) {
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
      symbolGrid: createSpinStartGrid({ targetHitRate: SPIN_START_TARGET_HIT_RATE }),
      nextCellIdRef,
    });
    let combinedClusters = [];
    let combinedPayout = 0;

    setIsBoardClearing(true);
    setBankroll((currentBankroll) => roundCurrency(currentBankroll - selectedBet));
    if (isMusicOn && audioRef.current?.paused) {
      audioRef.current.play().catch(() => {
        needsInteractionToPlayRef.current = true;
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
      await wait(timing.preImplodeMs);
      playClusterImplodeSfx(outcome.clusters.length);
      await wait(timing.implodeMs);
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

    if (combinedPayout > 0) {
      const winRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        multiplier: roundCurrency(combinedPayout / selectedBet),
        payout: roundCurrency(combinedPayout),
        bet: selectedBet,
      };

      setWinHistory((currentHistory) => [winRecord, ...currentHistory].slice(0, MAX_WIN_HISTORY_ENTRIES));
    }

    setIsCascading(false);

    if (combinedPayout >= (selectedBet * BIG_WIN_MIN_MULTIPLIER)) {
      openWinPopup({ payout: combinedPayout, bet: selectedBet });
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#033b5e] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,207,1,0.28),transparent_44%),radial-gradient(circle_at_86%_16%,rgba(0,85,150,0.42),transparent_52%),linear-gradient(180deg,#033b5e_0%,#005596_100%)]" />

      <main className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center px-3 py-2 sm:px-6">
        <div className="absolute right-2 top-2 z-30 flex items-center gap-2 sm:right-4 sm:top-4">
          <button
            type="button"
            aria-label="Open win history"
            onClick={() => setIsHistoryOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ffcf01]/65 bg-[#005596]/85 text-[#ffcf01] shadow-[0_10px_22px_rgba(3,59,94,0.45)] transition hover:scale-105 hover:bg-[#0a6cb6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcf01] focus-visible:ring-offset-2 focus-visible:ring-offset-[#033b5e]"
          >
            <FaClock className="h-4 w-4" />
          </button>

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

        <div className="mb-2 rounded-xl border border-[#ffcf01]/55 bg-[#ffcf01]/18 px-3 py-1 shadow-[0_10px_20px_rgba(3,59,94,0.35)] sm:mb-3 sm:px-4 sm:py-1.5">
          <img
            src="/slots/assets/GAMELOGO.svg"
            alt="Slot game logo"
            className="h-10 w-auto [filter:drop-shadow(0_0_10px_rgba(255,207,1,0.55))] sm:h-14"
            draggable="false"
          />
        </div>

        <section className="mx-auto w-fit rounded-2xl border border-[#ffcf01]/45 bg-[#033b5e]/65 p-2 shadow-[0_14px_32px_rgba(3,59,94,0.45)] backdrop-blur-sm sm:p-3">
          <div className="relative w-[min(86vw,76vh)] max-w-[86vw] overflow-hidden rounded-xl sm:w-[min(88vw,78vh)] sm:max-w-[88vw]">
            <div ref={gridRef} className="grid aspect-[7/6] w-full grid-cols-7 grid-rows-6 gap-1 sm:gap-1.5">
            {grid.map((row, rowIndex) => row.map((cell, columnIndex) => {
                const symbol = symbolsById[cell.symbolId];
              const isTextSymbol = symbol.renderType === "text";
                const key = toPositionKey(rowIndex, columnIndex);
                const isWinning = winningKeys.has(key);
                const dropDelayMs = cell.isNew
                  ? getSpinDelay(rowIndex, columnIndex)
                  : getCascadeDelay(columnIndex, cell.dropRows);
                const preScaleProgress = timing.preScaleFlashMs / timing.winAnimationMs;
                const holdProgress = timing.preImplodeMs / timing.winAnimationMs;

              return (
                <motion.div
                  key={`${cell.id}-${cell.version}`}
                  initial={cell.dropRows > 0 ? { y: -(rowStepPx * cell.dropRows), opacity: 1 } : false}
                  animate={isBoardClearing
                    ? { y: 84, opacity: 0 }
                    : isWinning
                      ? {
                        scale: [1, 1.085, 1.085, 0],
                        opacity: [1, 1, 1, 0],
                        backgroundColor: [NORMAL_TILE_BG, FLASH_TILE_BG, FLASH_TILE_BG, NORMAL_TILE_BG],
                      }
                      : { y: 0, opacity: 1 }}
                  transition={isBoardClearing
                    ? {
                      duration: timing.spinClearMs / 1000,
                      delay: getSpinDelay(rowIndex, columnIndex) / 1000,
                      ease: SMOOTH_EASE_IN,
                    }
                    : isWinning
                      ? {
                        duration: timing.winAnimationMs / 1000,
                        ease: SMOOTH_EASE_IN_OUT,
                        times: [0, preScaleProgress, holdProgress, 1],
                      }
                      : {
                        duration: cell.isNew ? timing.newBoardDropMs / 1000 : timing.dropAnimationMs / 1000,
                        delay: dropDelayMs / 1000,
                        ease: SMOOTH_EASE_OUT,
                      }}
                  style={{ willChange: "transform, opacity" }}
                  className="relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-md border border-[#ffcf01]/40 bg-[#005596]/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                >
                  {isTextSymbol ? (
                    <span
                      className="select-none font-black tracking-wide text-[#ffcf01] [text-shadow:0_2px_8px_rgba(0,0,0,0.35)]"
                      style={{ fontSize: `${textSymbolFontPx}px`, lineHeight: 1 }}
                    >
                      {symbol.label}
                    </span>
                  ) : (
                    <>
                      <img
                        src={symbol.assetPath}
                        alt={symbol.label}
                        className="h-[74%] w-[74%] object-contain"
                        draggable="false"
                      />
                      {cell.symbolId === "WILD" ? (
                        <span className="pointer-events-none absolute bottom-[8%] rounded-sm bg-[#033b5e]/78 px-1 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-[#ffcf01]">
                          Wild
                        </span>
                      ) : null}
                    </>
                  )}
                </motion.div>
              );
              }))}
            </div>
          </div>
        </section>

        <div className="mt-2 w-full max-w-4xl sm:mt-3">
          <div className="flex w-full flex-nowrap items-center justify-between gap-2 rounded-xl border border-[#ffcf01]/35 bg-[#005596]/35 px-2 py-2">
            <div className="min-w-0 flex-1">
              <div className="inline-flex max-w-full items-center rounded-full border border-[#ffcf01]/50 bg-[#005596]/95 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#ffcf01] sm:px-4 sm:text-sm">
                Bankroll: ${formatCurrency(bankroll)}
              </div>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={handleSpin}
                disabled={isCascading || winPopup.isOpen}
                className={`inline-flex h-11 min-w-[120px] items-center justify-center rounded-full border-2 border-[#ffcf01] bg-[#005596] px-6 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#ffcf01] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcf01] focus-visible:ring-offset-2 focus-visible:ring-offset-[#033b5e] ${
                  (isCascading || winPopup.isOpen)
                    ? "cursor-not-allowed opacity-45"
                    : "hover:-translate-y-0.5 hover:bg-[#0a6cb6]"
                }`}
                aria-label={isCascading ? "Spinning" : "Spin"}
              >
                {isCascading ? (
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#ffcf01] border-t-transparent" />
                ) : "Spin"}
              </button>
            </div>

            <div className="flex min-w-0 flex-1 justify-end">
              <div className="hidden items-center gap-1 rounded-full border border-[#ffcf01]/45 bg-[#005596]/75 p-1 sm:flex">
                {BET_OPTIONS.map((betOption) => {
                  const isActive = betOption === selectedBet;

                  return (
                    <button
                      key={betOption}
                      type="button"
                      onClick={() => setSelectedBet(betOption)}
                      disabled={isCascading || winPopup.isOpen}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] transition sm:px-4 sm:text-sm ${
                        isActive
                          ? "bg-[#ffcf01] text-[#033b5e] shadow-[0_0_0_1px_rgba(255,255,255,0.25)]"
                          : "bg-[#005596] text-[#ffcf01] hover:bg-[#0a6cb6]"
                      } ${(isCascading || winPopup.isOpen) ? "cursor-not-allowed opacity-45 hover:bg-[#005596]" : ""}`}
                    >
                      ${betOption}
                    </button>
                  );
                })}
              </div>

              <label className="sm:hidden">
                <span className="sr-only">Select bet</span>
                <select
                  value={selectedBet}
                  onChange={(event) => setSelectedBet(Number(event.target.value))}
                  disabled={isCascading || winPopup.isOpen}
                  className="h-11 rounded-full border border-[#ffcf01]/55 bg-[#005596] px-4 text-sm font-bold uppercase tracking-[0.08em] text-[#ffcf01]"
                >
                  {BET_OPTIONS.map((betOption) => (
                    <option key={betOption} value={betOption}>
                      ${betOption}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-2 w-full text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#b8dbd9] sm:text-xs">
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
          <div className="flex h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-[#ffcf01]/55 bg-[#005596] p-4 shadow-[0_26px_42px_rgba(3,59,94,0.55)]">
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

            <details
              open={isHowToOpen}
              onToggle={(event) => setIsHowToOpen(event.currentTarget.open)}
              className="mb-3 rounded-lg border border-[#ffcf01]/30 bg-[#033b5e]/45 p-3"
            >
              <summary className="cursor-pointer list-none text-xs font-bold uppercase tracking-[0.1em] text-[#ffcf01] sm:text-sm">
                How The Game Works
              </summary>
              <p className="mt-2 text-[11px] leading-relaxed text-[#b8dbd9] sm:text-xs">
                Spin to generate a 7x6 board. Any orthogonally connected cluster of 5 or more matching symbols wins.
                Winning symbols disappear, remaining symbols drop, and new symbols tumble in from above until no more wins remain.
                WILD substitutes for adjacent symbols and prioritizes the highest-value valid cluster.
              </p>

              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                <div className="rounded-md border border-[#ffcf01]/25 bg-[#005596]/55 px-2.5 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#ffcf01]">Current Features</p>
                  <p className="mt-1 text-[11px] text-[#b8dbd9]">Cluster pays, cascades, WILD substitution, win counter, and selectable bet sizes.</p>
                </div>
                <div className="rounded-md border border-dashed border-[#ffcf01]/35 bg-[#005596]/35 px-2.5 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#ffcf01]">Coming Soon</p>
                  <p className="mt-1 text-[11px] text-[#b8dbd9]">Free Spins (placeholder)</p>
                </div>
                <div className="rounded-md border border-dashed border-[#ffcf01]/35 bg-[#005596]/35 px-2.5 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#ffcf01]">Roadmap</p>
                  <p className="mt-1 text-[11px] text-[#b8dbd9]">Bonus modes and additional features (placeholder)</p>
                </div>
              </div>
            </details>

            <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-[#ffcf01]/25 bg-[#033b5e]/40">
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

      {isHistoryOpen ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#033b5e]/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl border border-[#ffcf01]/55 bg-[#005596] p-4 shadow-[0_26px_42px_rgba(3,59,94,0.55)]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-[#ffcf01]">Win History</h2>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#b8dbd9] sm:text-xs">
                  Stored in current browser session
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={historySortMode}
                  onChange={(event) => setHistorySortMode(event.target.value)}
                  className="rounded-full border border-[#ffcf01]/65 bg-[#005596] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#ffcf01]"
                >
                  <option value="chrono">Chrono</option>
                  <option value="highest">Highest Win</option>
                </select>
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(false)}
                  className="rounded-full border border-[#ffcf01]/70 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#ffcf01] transition hover:bg-[#0a6cb6]"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-[62vh] overflow-auto rounded-lg border border-[#ffcf01]/25 bg-[#033b5e]/40">
              {sortedWinHistory.length === 0 ? (
                <p className="px-3 py-5 text-center text-xs font-semibold uppercase tracking-[0.08em] text-[#b8dbd9]">
                  No recorded wins yet.
                </p>
              ) : (
                <table className="min-w-full border-separate border-spacing-0 text-left text-[11px] sm:text-xs">
                  <thead>
                    <tr>
                      <th className="sticky top-0 z-10 border-b border-[#ffcf01]/30 bg-[#005596] px-3 py-2 font-bold uppercase tracking-[0.08em] text-[#ffcf01]">Time</th>
                      <th className="sticky top-0 z-10 border-b border-[#ffcf01]/30 bg-[#005596] px-3 py-2 text-center font-bold uppercase tracking-[0.08em] text-[#ffcf01]">Multiplier</th>
                      <th className="sticky top-0 z-10 border-b border-[#ffcf01]/30 bg-[#005596] px-3 py-2 text-center font-bold uppercase tracking-[0.08em] text-[#ffcf01]">Bet</th>
                      <th className="sticky top-0 z-10 border-b border-[#ffcf01]/30 bg-[#005596] px-3 py-2 text-center font-bold uppercase tracking-[0.08em] text-[#ffcf01]">Payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedWinHistory.map((entry) => (
                      <tr key={entry.id}>
                        <td className="border-b border-[#ffcf01]/20 px-3 py-2 font-semibold text-white">
                          {new Date(entry.timestamp).toLocaleString()}
                        </td>
                        <td className="border-b border-[#ffcf01]/20 px-3 py-2 text-center font-bold text-[#ffcf01]">
                          {Number(entry.multiplier).toFixed(2)}x
                        </td>
                        <td className="border-b border-[#ffcf01]/20 px-3 py-2 text-center font-semibold text-white">
                          ${formatCurrency(Number(entry.bet) || 0)}
                        </td>
                        <td className="border-b border-[#ffcf01]/20 px-3 py-2 text-center font-semibold text-white">
                          ${formatCurrency(Number(entry.payout) || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {sortedWinHistory.length > 0 ? (
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#b8dbd9] sm:text-xs">
                  Page {historyPage} of {historyTotalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHistoryPage((currentPage) => Math.max(1, currentPage - 1))}
                    disabled={historyPage <= 1}
                    className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
                      historyPage <= 1
                        ? "cursor-not-allowed border-[#ffcf01]/35 text-[#ffcf01]/45"
                        : "border-[#ffcf01]/70 text-[#ffcf01] hover:bg-[#0a6cb6]"
                    }`}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryPage((currentPage) => Math.min(historyTotalPages, currentPage + 1))}
                    disabled={historyPage >= historyTotalPages}
                    className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
                      historyPage >= historyTotalPages
                        ? "cursor-not-allowed border-[#ffcf01]/35 text-[#ffcf01]/45"
                        : "border-[#ffcf01]/70 text-[#ffcf01] hover:bg-[#0a6cb6]"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {winPopup.isOpen ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#033b5e]/82 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#ffcf01]/65 bg-[#005596] p-5 text-center shadow-[0_30px_48px_rgba(3,59,94,0.6)]">
            {!winPopup.isCounting ? (
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b8dbd9]">
                Win Multiplier: {winPopup.multiplier.toFixed(2)}x
              </p>
            ) : null}
            <motion.h2
              key={`win-tier-${winPopup.upgradeCount}`}
              initial={{ scale: Math.min(1.18, 1 + (winPopup.upgradeCount * 0.02)) * 0.96, opacity: 0.9 }}
              animate={{
                scale: [
                  Math.min(1.18, 1 + (winPopup.upgradeCount * 0.02)) * 0.96,
                  Math.min(1.18, 1 + (winPopup.upgradeCount * 0.02)) * 1.05,
                  Math.min(1.18, 1 + (winPopup.upgradeCount * 0.02)),
                ],
                opacity: [0.9, 1, 1],
              }}
              transition={{ duration: 0.55, times: [0, 0.45, 1], ease: SMOOTH_EASE_IN_OUT }}
              className={`mt-2 text-2xl font-black uppercase tracking-[0.1em] sm:text-3xl ${winPopup.accentClass}`}
            >
              {winPopup.title}
            </motion.h2>
            <p className="mt-3 text-[clamp(1.5rem,5.5vw,2.8rem)] font-black tracking-wide text-white">
              ${formatCurrency(winPopup.displayAmount)}
            </p>

            {winPopup.isCounting ? (
              <button
                type="button"
                onClick={handleSkipWinCount}
                className="mt-3 rounded-full border border-[#ffcf01]/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#ffcf01] transition hover:bg-[#0a6cb6]"
              >
                Skip
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCloseWinPopup}
                className="mt-3 rounded-full border-2 border-[#ffcf01] bg-[#ffcf01] px-5 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#033b5e] transition hover:-translate-y-0.5"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SlotsPage;
