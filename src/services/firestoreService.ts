import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { PracticalProgram } from '../types/notebook';
import { INITIAL_PROGRAMS, IRIS_CSV_CONTENT } from '../data/initialPrograms';

export interface WorkspaceFolder {
  id: string;
  name: string;
  path: string;
  createdAt: string;
}

export interface WorkspaceDataset {
  name: string;
  size: string;
  modified: string;
  content: string;
}

const NOTEBOOKS_COLL = 'notebooks';
const FOLDERS_COLL = 'workspace_folders';
const DATASETS_COLL = 'workspace_datasets';

export class FirestoreService {
  private static isInitialized = false;

  public static async initializeDefaults(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      const snap = await getDocs(collection(db, NOTEBOOKS_COLL));
      if (snap.empty) {
        for (const prog of INITIAL_PROGRAMS) {
          await this.saveProgram(prog);
        }
      }

      // Check datasets
      const dsSnap = await getDocs(collection(db, DATASETS_COLL));
      if (dsSnap.empty) {
        await this.saveDataset({
          name: 'Iris.csv',
          size: '1.2 KB',
          modified: 'now',
          content: IRIS_CSV_CONTENT,
        });
      }
    } catch (err) {
      // Quiet background fallback
    }
  }

  // --- Notebooks ---

  public static async getPrograms(): Promise<PracticalProgram[]> {
    try {
      const q = query(collection(db, NOTEBOOKS_COLL), orderBy('practicalNumber', 'asc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as PracticalProgram);
      }
    } catch (e) {
      // Silent fallback to local cache
    }
    return [];
  }

  public static subscribeToPrograms(
    onData: (programs: PracticalProgram[]) => void,
    onError?: (err: any) => void
  ): () => void {
    try {
      const q = query(collection(db, NOTEBOOKS_COLL), orderBy('practicalNumber', 'asc'));
      return onSnapshot(
        q,
        (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map((d) => d.data() as PracticalProgram);
            onData(list);
          }
        },
        (error) => {
          if (onError) onError(error);
        }
      );
    } catch {
      return () => {};
    }
  }

  public static async saveProgram(prog: PracticalProgram): Promise<void> {
    try {
      const docRef = doc(db, NOTEBOOKS_COLL, prog.id);
      await setDoc(docRef, {
        ...prog,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      // Silent error handling
    }
  }

  public static async deleteProgram(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, NOTEBOOKS_COLL, id));
    } catch (e) {
      // Silent error handling
    }
  }

  // --- Folders ---

  public static async getFolders(): Promise<WorkspaceFolder[]> {
    try {
      const snap = await getDocs(collection(db, FOLDERS_COLL));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as WorkspaceFolder);
      }
    } catch {
      // Fallback
    }
    return [];
  }

  public static subscribeToFolders(onData: (folders: WorkspaceFolder[]) => void): () => void {
    try {
      return onSnapshot(collection(db, FOLDERS_COLL), (snap) => {
        if (!snap.empty) {
          onData(snap.docs.map((d) => d.data() as WorkspaceFolder));
        }
      });
    } catch {
      return () => {};
    }
  }

  public static async saveFolder(folder: WorkspaceFolder): Promise<void> {
    try {
      await setDoc(doc(db, FOLDERS_COLL, folder.id), folder, { merge: true });
    } catch {
      // Silent
    }
  }

  public static async deleteFolder(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, FOLDERS_COLL, id));
    } catch {
      // Silent
    }
  }

  // --- Datasets ---

  public static async getDatasets(): Promise<WorkspaceDataset[]> {
    try {
      const snap = await getDocs(collection(db, DATASETS_COLL));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as WorkspaceDataset);
      }
    } catch {
      // Silent
    }
    return [
      {
        name: 'Iris.csv',
        size: '1.2 KB',
        modified: 'now',
        content: IRIS_CSV_CONTENT,
      },
    ];
  }

  public static async saveDataset(dataset: WorkspaceDataset): Promise<void> {
    try {
      await setDoc(doc(db, DATASETS_COLL, dataset.name.replace(/\./g, '_')), dataset, { merge: true });
    } catch {
      // Silent
    }
  }
}
