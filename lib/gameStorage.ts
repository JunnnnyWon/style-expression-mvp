import { GameState, INITIAL_GAME_STATE } from "@/data/members";

const STORAGE_KEY = "style-expression-mvp-state";

export function saveGame(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.error("Failed to save game state");
  }
}

export function loadGame(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    console.error("Failed to load game state");
    return null;
  }
}

export function resetGame(): GameState {
  if (typeof window === "undefined") return { ...INITIAL_GAME_STATE, members: INITIAL_GAME_STATE.members.map(m => ({ ...m, stats: { ...m.stats } })) };
  localStorage.removeItem(STORAGE_KEY);
  return getFreshState();
}

export function getFreshState(): GameState {
  return {
    selectedMissionId: null,
    members: INITIAL_GAME_STATE.members.map(m => ({ ...m, stats: { ...m.stats } })),
    group: { ...INITIAL_GAME_STATE.group },
    chatHistory: [],
    endingId: null,
  };
}
