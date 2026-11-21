import { PracticalProgram } from '../types/notebook';
import { INITIAL_PROGRAMS, IRIS_CSV_CONTENT } from '../data/initialPrograms';
import { FirestoreService, WorkspaceFolder, WorkspaceDataset } from './firestoreService';

const STORAGE_KEY = 'jupyter_ml_programs_v1';
const FOLDERS_KEY = 'jupyter_ml_folders_v1';
const DATASETS_KEY = 'jupyter_ml_datasets_v1';

export class ProgramStorageService {
  private static cachedPrograms: PracticalProgram[] | null = null;
  private static cachedFolders: WorkspaceFolder[] | null = null;
  private static cachedDatasets: WorkspaceDataset[] | null = null;
  private static listeners: ((programs: PracticalProgram[]) => void)[] = [];
  private static syncStatusListeners: ((status: 'synced' | 'syncing' | 'offline') => void)[] = [];
  private static currentSyncStatus: 'synced' | 'syncing' | 'offline' = 'synced';

  public static onSyncStatusChange(cb: (status: 'synced' | 'syncing' | 'offline') => void) {
    this.syncStatusListeners.push(cb);
    cb(this.currentSyncStatus);
    return () => {
      this.syncStatusListeners = this.syncStatusListeners.filter((l) => l !== cb);
    };
  }

  private static setSyncStatus(status: 'synced' | 'syncing' | 'offline') {
    this.currentSyncStatus = status;
    this.syncStatusListeners.forEach((cb) => cb(status));
  }

  /**
   * Initializes Firestore sync listener. When changes happen on Firestore,
   * it updates local cache and notifies all listeners.
   */
  public static initCloudSync(onUpdate?: (programs: PracticalProgram[]) => void) {
    if (onUpdate) {
      this.listeners.push(onUpdate);
    }

    // Initialize defaults in Firestore if needed
    FirestoreService.initializeDefaults().catch(console.warn);

    // Subscribe to Firestore notebooks collection
    this.setSyncStatus('syncing');
    FirestoreService.subscribeToPrograms(
      (remotePrograms) => {
        if (remotePrograms && remotePrograms.length > 0) {
          this.cachedPrograms = remotePrograms;
          this.saveToLocal(remotePrograms);
          this.setSyncStatus('synced');
          this.listeners.forEach((l) => l(remotePrograms));
        }
      },
      () => {
        this.setSyncStatus('offline');
      }
    );
  }

  public static getPrograms(): PracticalProgram[] {
    if (this.cachedPrograms) {
      return this.cachedPrograms;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.cachedPrograms = JSON.parse(stored);
        return this.cachedPrograms!;
      }
    } catch (e) {
      console.error('Error loading programs from localStorage', e);
    }
    // Fallback to initial
    this.saveToLocal(INITIAL_PROGRAMS);
    this.cachedPrograms = INITIAL_PROGRAMS;
    return INITIAL_PROGRAMS;
  }

  private static saveToLocal(programs: PracticalProgram[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
    } catch (e) {
      console.error('Error saving programs to localStorage', e);
    }
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
      id: `prog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.push(newProg);
    this.cachedPrograms = list;
    this.saveToLocal(list);

    // Sync to Firestore
    this.setSyncStatus('syncing');
    FirestoreService.saveProgram(newProg)
      .then(() => this.setSyncStatus('synced'))
      .catch((err) => {
        console.warn('Firestore write warning (saved locally):', err);
        this.setSyncStatus('offline');
      });

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

      // Sync to Firestore
      this.setSyncStatus('syncing');
      FirestoreService.saveProgram(refreshed)
        .then(() => this.setSyncStatus('synced'))
        .catch((err) => {
          console.warn('Firestore update warning (saved locally):', err);
          this.setSyncStatus('offline');
        });
    }
  }

  public static async deleteProgram(id: string): Promise<void> {
    const list = this.getPrograms().filter((p) => p.id !== id);
    this.cachedPrograms = list;
    this.saveToLocal(list);

    // Sync to Firestore
    this.setSyncStatus('syncing');
    FirestoreService.deleteProgram(id)
      .then(() => this.setSyncStatus('synced'))
      .catch((err) => {
        console.warn('Firestore delete warning:', err);
        this.setSyncStatus('offline');
      });
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
    const defaultFolders = [{ id: 'f-1', name: 'practicals', path: '/practicals', createdAt: new Date().toISOString() }];
    this.cachedFolders = defaultFolders;
    return defaultFolders;
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

    // Sync to Firestore
    FirestoreService.saveFolder(newFolder).catch(console.warn);
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

      // Sync to Firestore
      FirestoreService.saveDataset({
        name,
        size: `${(content.length / 1024).toFixed(1)} KB`,
        modified: 'Just now',
        content,
      }).catch(console.warn);
    } catch (e) {
      console.error('Error saving dataset', e);
    }
  }

  public static getAllDatasets(): { name: string; size: string; modified: string }[] {
    return [
      { name: 'Iris.csv', size: '1.2 KB', modified: '2 hours ago' },
    ];
  }
}
