import React, { useState, useEffect, useCallback } from 'react';
import { PracticalProgram, WorkspaceTab, KernelState } from './types/notebook';
import { ProgramStorageService } from './services/programStorage';
import { PythonKernelService } from './services/pythonKernel';
import { JupyterHeader } from './components/JupyterHeader';
import { LeftSidebar, SidebarTab } from './components/LeftSidebar';
import { NotebookTabs } from './components/NotebookTabs';
import { NotebookWorkspace } from './components/NotebookWorkspace';
import { AdminWorkspace } from './components/AdminWorkspace';
import { DatasetViewer } from './components/DatasetViewer';
import { StatusBar } from './components/StatusBar';
import { LoginModal } from './components/LoginModal';
import { ShortcutsModal } from './components/ShortcutsModal';

export const App: React.FC = () => {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('jupyter_theme_mode');
    return saved === 'dark';
  });

  // Programs & Datasets
  const [programs, setPrograms] = useState<PracticalProgram[]>(() =>
    ProgramStorageService.getPrograms()
  );
  const [datasets] = useState(ProgramStorageService.getAllDatasets());

  // Initial tab: clean blank Untitled.ipynb
  const initialProgram = programs[0] || {
    id: 'nb-untitled-1',
    practicalNumber: 1,
    title: 'Untitled',
    filename: 'Untitled.ipynb',
    description: '',
    cells: [{ id: 'c-1', type: 'code', source: '', executionCount: null, outputs: [] }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [tabs, setTabs] = useState<WorkspaceTab[]>([
    {
      id: `tab-${initialProgram.id}`,
      programId: initialProgram.id,
      title: initialProgram.filename,
      filename: initialProgram.filename,
      type: 'notebook',
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>(`tab-${initialProgram.id}`);

  // Sidebar
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('files');

  // Kernel state
  const [kernelState, setKernelState] = useState<KernelState>('idle');
  const [kernelMessage, setKernelMessage] = useState<string>('Idle');

  // Modals & Admin
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Status bar cell info
  const [activeCellIdx, setActiveCellIdx] = useState(0);
  const [totalCells, setTotalCells] = useState(1);

  // Apply dark theme class to root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('jupyter_theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('jupyter_theme_mode', 'light');
    }
  }, [isDark]);

  // Cloud Sync in background (quietly)
  useEffect(() => {
    ProgramStorageService.initCloudSync((remotePrograms) => {
      setPrograms(remotePrograms);
    });
  }, []);

  // Hook into Python kernel service status
  useEffect(() => {
    const kernel = PythonKernelService.getInstance();
    const unsubscribe = kernel.onStatusChange((status, msg) => {
      setKernelState(status);
      if (msg) setKernelMessage(msg);
    });
    return () => unsubscribe();
  }, []);

  // Active Tab
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const activeProgram = activeTab?.programId
    ? programs.find((p) => p.id === activeTab.programId)
    : programs[0];

  // Open Notebook in tab
  const handleOpenNotebook = useCallback((program: PracticalProgram) => {
    setTabs((prev) => {
      const existing = prev.find((t) => t.programId === program.id);
      if (existing) {
        setActiveTabId(existing.id);
        return prev;
      }
      const newTab: WorkspaceTab = {
        id: `tab-${program.id}`,
        programId: program.id,
        title: program.filename,
        filename: program.filename,
        type: 'notebook',
      };
      setActiveTabId(newTab.id);
      return [...prev, newTab];
    });
  }, []);

  // Open Dataset in tab
  const handleOpenDataset = useCallback((name: string) => {
    setTabs((prev) => {
      const existing = prev.find((t) => t.filename === name && t.type === 'dataset');
      if (existing) {
        setActiveTabId(existing.id);
        return prev;
      }
      const newTab: WorkspaceTab = {
        id: `tab-dataset-${name}`,
        title: name,
        filename: name,
        type: 'dataset',
      };
      setActiveTabId(newTab.id);
      return [...prev, newTab];
    });
  }, []);

  // Open Admin tab
  const handleOpenAdminTab = useCallback(() => {
    setTabs((prev) => {
      const existing = prev.find((t) => t.type === 'admin');
      if (existing) {
        setActiveTabId(existing.id);
        return prev;
      }
      const adminTab: WorkspaceTab = {
        id: 'tab-admin-manager',
        title: 'Program Manager',
        filename: 'Admin Management',
        type: 'admin',
      };
      setActiveTabId(adminTab.id);
      return [...prev, adminTab];
    });
  }, []);

  // Close tab
  const handleCloseTab = useCallback(
    (tabId: string) => {
      setTabs((prev) => {
        if (prev.length <= 1) return prev;
        const remaining = prev.filter((t) => t.id !== tabId);
        if (activeTabId === tabId) {
          setActiveTabId(remaining[remaining.length - 1].id);
        }
        return remaining;
      });
    },
    [activeTabId]
  );

  // Close All Tabs
  const handleCloseAllTabs = useCallback(() => {
    if (programs.length > 0) {
      const p = programs[0];
      setTabs([
        {
          id: `tab-${p.id}`,
          programId: p.id,
          title: p.filename,
          filename: p.filename,
          type: 'notebook',
        },
      ]);
      setActiveTabId(`tab-${p.id}`);
    }
  }, [programs]);

  // Create new blank notebook (Matching Image 2: creates Untitled.ipynb with 1 single blank code cell)
  const handleNewNotebook = useCallback(async () => {
    const existingUntitledCount = programs.filter((p) => p.filename.startsWith('Untitled')).length;
    const filename = existingUntitledCount === 0 ? 'Untitled.ipynb' : `Untitled${existingUntitledCount}.ipynb`;

    const newProg = await ProgramStorageService.addProgram({
      practicalNumber: programs.length + 1,
      title: filename.replace('.ipynb', ''),
      filename: filename,
      description: '',
      cells: [
        {
          id: `cell-${Date.now()}`,
          type: 'code',
          source: '',
          executionCount: null,
          outputs: [],
        },
      ],
    });

    setPrograms(ProgramStorageService.getPrograms());
    handleOpenNotebook(newProg);
  }, [handleOpenNotebook, programs]);

  // Create Folder
  const handleCreateFolder = useCallback(async (name: string) => {
    await ProgramStorageService.addFolder(name);
  }, []);

  // Save active notebook
  const handleSaveProgram = useCallback(async (updated: PracticalProgram) => {
    await ProgramStorageService.updateProgram(updated);
    setPrograms(ProgramStorageService.getPrograms());
    setTabs((prev) =>
      prev.map((t) => (t.programId === updated.id ? { ...t, isDirty: false } : t))
    );
  }, []);

  // Admin CRUD actions
  const handleAddProgram = useCallback(
    async (data: Omit<PracticalProgram, 'id' | 'createdAt' | 'updatedAt'>) => {
      const created = await ProgramStorageService.addProgram(data);
      const all = ProgramStorageService.getPrograms();
      setPrograms(all);
      handleOpenNotebook(created);
    },
    [handleOpenNotebook]
  );

  const handleUpdateProgram = useCallback(async (prog: PracticalProgram) => {
    await ProgramStorageService.updateProgram(prog);
    setPrograms(ProgramStorageService.getPrograms());
  }, []);

  const handleDeleteProgram = useCallback(
    async (id: string) => {
      await ProgramStorageService.deleteProgram(id);
      const all = ProgramStorageService.getPrograms();
      setPrograms(all);
      setTabs((prev) => {
        const remaining = prev.filter((t) => t.programId !== id);
        if (remaining.length === 0 && all.length > 0) {
          const first = all[0];
          return [
            {
              id: `tab-${first.id}`,
              programId: first.id,
              title: first.filename,
              filename: first.filename,
              type: 'notebook',
            },
          ];
        }
        return remaining;
      });
      if (all.length > 0) {
        setActiveTabId(`tab-${all[0].id}`);
      }
    },
    []
  );

  // Admin Auth Success
  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsLoginOpen(false);
    handleOpenAdminTab();
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setTabs((prev) => prev.filter((t) => t.type !== 'admin'));
    if (programs.length > 0) {
      handleOpenNotebook(programs[0]);
    }
  };

  const handleScrollToCell = (cellId: string) => {
    const el = document.getElementById(`cell-${cellId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
      {/* Top Application Header */}
      <JupyterHeader
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onSave={() => {
          if (activeProgram) handleSaveProgram(activeProgram);
        }}
        onNewNotebook={handleNewNotebook}
        onCloseActiveTab={() => handleCloseTab(activeTabId)}
        onCloseAllTabs={handleCloseAllTabs}
        onRunSelectedCell={() => {}}
        onRunAllCells={() => {}}
        onRestartKernel={() => PythonKernelService.getInstance().restartKernel()}
        onInterruptKernel={() => PythonKernelService.getInstance().interruptKernel()}
        onToggleSidebar={() => setSidebarTab(sidebarTab ? null : 'files')}
        onOpenAdmin={() => {
          if (isAdminAuthenticated) {
            handleOpenAdminTab();
          } else {
            setIsLoginOpen(true);
          }
        }}
        onShowShortcuts={() => setIsShortcutsOpen(true)}
        activeFilename={activeTab?.filename || 'Notebook'}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Left Vertical Sidebar */}
        <LeftSidebar
          activeTab={sidebarTab}
          onTabChange={setSidebarTab}
          onOpenSettingsLogin={() => {
            if (isAdminAuthenticated) {
              handleOpenAdminTab();
            } else {
              setIsLoginOpen(true);
            }
          }}
          programs={programs}
          datasets={datasets}
          activeFilename={activeTab?.filename || ''}
          onOpenNotebook={handleOpenNotebook}
          onOpenDataset={handleOpenDataset}
          onNewNotebook={handleNewNotebook}
          onCreateFolder={handleCreateFolder}
          onRefresh={() => setPrograms(ProgramStorageService.getPrograms())}
          kernelState={kernelState}
          activeNotebookCells={activeProgram?.cells}
          onScrollToCell={handleScrollToCell}
        />

        {/* Center Notebook Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-neutral-900">
          {/* Notebook Tab Bar */}
          <NotebookTabs
            tabs={tabs}
            activeTabId={activeTabId}
            onSelectTab={setActiveTabId}
            onCloseTab={handleCloseTab}
            onNewNotebook={handleNewNotebook}
          />

          {/* Active Workspace View */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab?.type === 'admin' ? (
              <AdminWorkspace
                programs={programs}
                onAddProgram={handleAddProgram}
                onUpdateProgram={handleUpdateProgram}
                onDeleteProgram={handleDeleteProgram}
                onOpenNotebook={handleOpenNotebook}
                onLogout={handleAdminLogout}
              />
            ) : activeTab?.type === 'dataset' ? (
              <DatasetViewer
                filename={activeTab.filename}
                csvContent={ProgramStorageService.getDatasetContent(activeTab.filename)}
              />
            ) : activeProgram ? (
              <NotebookWorkspace
                key={activeProgram.id}
                program={activeProgram}
                isDark={isDark}
                onSaveProgram={handleSaveProgram}
                onCellCountChange={(idx, total) => {
                  setActiveCellIdx(idx);
                  setTotalCells(total);
                }}
                kernelState={kernelState}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-neutral-400 text-sm">
                No active notebook. Click + to create one.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar
        activeFilename={activeTab?.filename || 'Untitled.ipynb'}
        kernelState={kernelState}
        kernelMessage={kernelMessage}
        isEditMode={true}
        activeCellIndex={activeCellIdx}
        totalCells={totalCells}
      />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
