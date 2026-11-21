export type CellType = 'code' | 'markdown';

export interface CellOutput {
  id: string;
  outputType: 'stream' | 'execute_result' | 'display_data' | 'error' | 'image' | 'dataframe';
  text?: string;
  html?: string;
  imageSrc?: string;
  ename?: string;
  evalue?: string;
  traceback?: string[];
  executionCount?: number | null;
}

export interface NotebookCell {
  id: string;
  type: CellType;
  source: string;
  executionCount: number | null;
  outputs: CellOutput[];
  isCollapsed?: boolean;
}

export interface PracticalProgram {
  id: string;
  practicalNumber: number;
  title: string;
  filename: string;
  description: string;
  dataset?: string;
  cells: NotebookCell[];
  createdAt: string;
  updatedAt: string;
}

export type TabType = 'notebook' | 'dataset' | 'admin';

export interface WorkspaceTab {
  id: string;
  programId?: string;
  title: string;
  filename: string;
  type: TabType;
  isDirty?: boolean;
}

export type KernelState = 'idle' | 'busy' | 'initializing' | 'ready' | 'error';
