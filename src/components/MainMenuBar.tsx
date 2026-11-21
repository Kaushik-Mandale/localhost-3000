import React, { useState, useRef, useEffect } from 'react';

interface MenuAction {
  label: string;
  shortcut?: string;
  onClick: () => void;
  divider?: boolean;
}

interface MenuDef {
  title: string;
  items: MenuAction[];
}

interface Props {
  onSave: () => void;
  onNewNotebook: () => void;
  onCloseActiveTab: () => void;
  onCloseAllTabs: () => void;
  onRunSelectedCell: () => void;
  onRunAllCells: () => void;
  onRestartKernel: () => void;
  onInterruptKernel: () => void;
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  onOpenAdmin: () => void;
  onShowShortcuts: () => void;
  isDark: boolean;
}

export const MainMenuBar: React.FC<Props> = ({
  onSave,
  onNewNotebook,
  onCloseActiveTab,
  onCloseAllTabs,
  onRunSelectedCell,
  onRunAllCells,
  onRestartKernel,
  onInterruptKernel,
  onToggleSidebar,
  onToggleTheme,
  onOpenAdmin,
  onShowShortcuts,
  isDark,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menus: MenuDef[] = [
    {
      title: 'File',
      items: [
        { label: 'New Notebook', shortcut: 'Ctrl+N', onClick: onNewNotebook },
        { label: 'Save Notebook', shortcut: 'Ctrl+S', onClick: onSave },
        { label: 'Save All', onClick: onSave, divider: true },
        { label: 'Close Active Tab', shortcut: 'Ctrl+W', onClick: onCloseActiveTab },
        { label: 'Close All Tabs', onClick: onCloseAllTabs },
      ],
    },
    {
      title: 'Edit',
      items: [
        { label: 'Undo Cell Action', shortcut: 'Ctrl+Z', onClick: () => {} },
        { label: 'Redo Cell Action', shortcut: 'Ctrl+Y', onClick: () => {}, divider: true },
        { label: 'Cut Cell', shortcut: 'X', onClick: () => {} },
        { label: 'Copy Cell', shortcut: 'C', onClick: () => {} },
        { label: 'Paste Cell Below', shortcut: 'V', onClick: () => {}, divider: true },
        { label: 'Delete Selected Cell', shortcut: 'D, D', onClick: () => {} },
      ],
    },
    {
      title: 'View',
      items: [
        { label: 'Toggle Left Sidebar', shortcut: 'Ctrl+B', onClick: onToggleSidebar },
        { label: 'Toggle Line Numbers', onClick: () => {} },
        { label: 'Toggle Theme (Light / Dark)', onClick: onToggleTheme },
      ],
    },
    {
      title: 'Run',
      items: [
        { label: 'Run Selected Cell', shortcut: 'Shift+Enter', onClick: onRunSelectedCell },
        { label: 'Run Cell and Do Not Advance', shortcut: 'Ctrl+Enter', onClick: onRunSelectedCell },
        { label: 'Run All Cells', onClick: onRunAllCells, divider: true },
        { label: 'Restart Kernel and Run All', onClick: onRunAllCells },
      ],
    },
    {
      title: 'Kernel',
      items: [
        { label: 'Interrupt Kernel', shortcut: 'I, I', onClick: onInterruptKernel },
        { label: 'Restart Kernel...', shortcut: '0, 0', onClick: onRestartKernel, divider: true },
        { label: 'Shut Down Kernel', onClick: onRestartKernel },
      ],
    },
    {
      title: 'Tabs',
      items: [
        { label: 'Activate Next Tab', shortcut: 'Ctrl+]', onClick: () => {} },
        { label: 'Activate Previous Tab', shortcut: 'Ctrl+[', onClick: () => {} },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          label: isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme',
          onClick: onToggleTheme,
          divider: true,
        },
        { label: 'Practical Program Manager (Admin)', onClick: onOpenAdmin },
      ],
    },
    {
      title: 'Help',
      items: [
        { label: 'Notebook Keyboard Shortcuts', shortcut: 'H', onClick: onShowShortcuts },
        { label: 'ML Practical Syllabus', onClick: () => alert('ML Practical Workspace - Autonomous Learning') },
        { label: 'About ML Practical Workspace', onClick: () => alert('Jupyter-style ML Practical Workspace v1.0') },
      ],
    },
  ];

  return (
    <div ref={containerRef} className="flex items-center space-x-1 select-none text-xs">
      {menus.map((menu) => {
        const isOpen = openMenu === menu.title;
        return (
          <div key={menu.title} className="relative">
            <button
              onClick={() => setOpenMenu(isOpen ? null : menu.title)}
              onMouseEnter={() => {
                if (openMenu !== null) setOpenMenu(menu.title);
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                isOpen
                  ? 'bg-neutral-200 dark:bg-neutral-700 font-medium text-neutral-900 dark:text-neutral-100'
                  : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {menu.title}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute left-0 top-full mt-0.5 w-60 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded shadow-lg z-50 py-1 text-xs text-neutral-800 dark:text-neutral-200">
                {menu.items.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <button
                      onClick={() => {
                        item.onClick();
                        setOpenMenu(null);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-blue-600 hover:text-white transition-colors text-left"
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span className="text-[10px] text-neutral-400 group-hover:text-neutral-200 ml-3">
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                    {item.divider && (
                      <div className="border-t border-neutral-200 dark:border-neutral-700 my-1" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
