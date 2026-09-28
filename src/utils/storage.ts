import { Design } from '../types';

const STORAGE_KEY = 'dreamhome_saved_designs_v1';

export function getSavedDesigns(): Design[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load designs from local storage', err);
    return [];
  }
}

export function saveDesign(design: Design): boolean {
  try {
    const current = getSavedDesigns();
    const existingIndex = current.findIndex((d) => d.id === design.id);
    let updated: Design[];

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...design };
    } else {
      updated = [design, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to save design to local storage', err);
    return false;
  }
}

export function deleteDesign(id: string): boolean {
  try {
    const current = getSavedDesigns();
    const filtered = current.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete design from local storage', err);
    return false;
  }
}

export function getDesignById(id: string): Design | undefined {
  const all = getSavedDesigns();
  return all.find((d) => d.id === id);
}
