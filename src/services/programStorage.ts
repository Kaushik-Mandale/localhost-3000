import { PracticalProgram } from '../types/notebook';
import { INITIAL_PROGRAMS, IRIS_CSV_CONTENT } from '../data/initialPrograms';
import { FirestoreService, WorkspaceFolder, WorkspaceDataset } from './firestoreService';

const STORAGE_KEY = 'jupyter_ml_programs_v2';
const FOLDERS_KEY = 'jupyter_ml_folders_v2';
const DATASETS_KEY = 'jupyter_ml_datasets_v2';

export class ProgramStorageService {
  private static cachedPrograms: PracticalProgram[] | null = null;
  private static cachedFolders: WorkspaceFolder[] | null = null;
  private static cachedDatasets: WorkspaceDataset[] | null = null;
  private static listeners: ((programs: PracticalProgram[]) => void)[] = [];

  public static initCloudSync(onUpdate?: (programs: PracticalProgram[]) => void) {
    if (onUpdate) {
      this.listeners.push(onUpdate);
    }

    FirestoreService.initializeDefaults().catch(() => {});

    FirestoreService.subscribeToPrograms((remotePrograms) => {
      if (remotePrograms && remotePrograms.length > 0) {
        this.cachedPrograms = remotePrograms;
        this.saveToLocal(remotePrograms);
        this.listeners.forEach((l) => l(remotePrograms));
      }
    });
  }

  public static getPrograms(): PracticalProgram[] {
    if (this.cachedPrograms) {
      return this.cachedPrograms;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.cachedPrograms = parsed;
          return this.cachedPrograms!;
        }
      }
    } catch {}

    this.saveToLocal(INITIAL_PROGRAMS);
    this.cachedPrograms = INITIAL_PROGRAMS;
    return INITIAL_PROGRAMS;
  }

  private static saveToLocal(programs: PracticalProgram[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
    } catch {}
  }

  public static getProgramById(id: string): PracticalProgram | undefined {
    const list = this.getPrograms();
    return list.find((p) => p.id === id);
  }

  public static async addProgram(
    data: Omit<PracticalProgram, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PracticalProgram> {
    const list = this.getPrograms();
    const newProg: PracticalProgram = {
      ...data,
      id: `nb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.push(newProg);
    this.cachedPrograms = list;
    this.saveToLocal(list);

    FirestoreService.saveProgram(newProg).catch(() => {});

    return newProg;
  }

  public static async updateProgram(updated: PracticalProgram): Promise<void> {
    const list = this.getPrograms();
    const index = list.findIndex((p) => p.id === updated.id);
    if (index !== -1) {
      const refreshed = {
        ...updated,
        updatedAt: new Date().toISOString(),
      };
      list[index] = refreshed;
      this.cachedPrograms = list;
      this.saveToLocal(list);

      FirestoreService.saveProgram(refreshed).catch(() => {});
    }
  }

  public static async deleteProgram(id: string): Promise<void> {
    const list = this.getPrograms().filter((p) => p.id !== id);
    this.cachedPrograms = list;
    this.saveToLocal(list);

    FirestoreService.deleteProgram(id).catch(() => {});
  }

  // --- Folders ---

  public static getFolders(): WorkspaceFolder[] {
    if (this.cachedFolders) return this.cachedFolders;
    try {
      const stored = localStorage.getItem(FOLDERS_KEY);
      if (stored) {
        this.cachedFolders = JSON.parse(stored);
        return this.cachedFolders!;
      }
    } catch {}
    return [];
  }

  public static async addFolder(name: string): Promise<WorkspaceFolder> {
    const folders = this.getFolders();
    const newFolder: WorkspaceFolder = {
      id: `folder-${Date.now()}`,
      name: name.trim(),
      path: `/${name.trim().toLowerCase()}`,
      createdAt: new Date().toISOString(),
    };
    folders.push(newFolder);
    this.cachedFolders = folders;
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));

    FirestoreService.saveFolder(newFolder).catch(() => {});
    return newFolder;
  }

  // --- Datasets ---

  public static getDatasetContent(name: string): string {
    if (name === 'Iris.csv') {
      return IRIS_CSV_CONTENT;
    }
    try {
      const datasets = JSON.parse(localStorage.getItem(DATASETS_KEY) || '{}');
      return datasets[name] || '';
    } catch {
      return '';
    }
  }

  public static async saveDataset(name: string, content: string): Promise<void> {
    try {
      const datasets = JSON.parse(localStorage.getItem(DATASETS_KEY) || '{}');
      datasets[name] = content;
      localStorage.setItem(DATASETS_KEY, JSON.stringify(datasets));

      FirestoreService.saveDataset({
        name,
        size: `${(content.length / 1024).toFixed(1)} KB`,
        modified: 'now',
        content,
      }).catch(() => {});
    } catch {}
  }

  public static getAllDatasets(): { name: string; size: string; modified: string }[] {
    return [
      { name: 'Iris.csv', size: '1.2 KB', modified: 'now' },
    ];
  }
}
