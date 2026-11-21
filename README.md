# JupyterLab – Personal ML Practical Workspace

A browser-based application that replicates the visual appearance, layout, interactions, components, and user experience of **JupyterLab**, customized as a Personal Machine Learning Practical Workspace with **Firebase Cloud Firestore** integration.

---

## 🌟 Key Features

### 1. Student Workspace (JupyterLab Re-creation)
- **Top Application Header & Menus:** File, Edit, View, Run, Kernel, Tabs, Settings, and Help dropdown menus.
- **Left Sidebar Navigation:**
  - File Browser (`Decision_Tree.ipynb`, `KNN_Practical.ipynb`, `Iris.csv`, Folders).
  - Running Sessions & Kernels (Python 3 ipykernel status monitor).
  - Table of Contents (Outline of headings in the active notebook with jump-to-section).
  - Extension Manager (Pyodide Wasm Engine, Firebase Cloud Firestore, Scikit-learn, Matplotlib Visualizer).
  - **Settings Gear Icon at extreme bottom-left corner** for Administrator Authentication.
- **Multi-Tab Notebook Navigation:** Open, switch, and close multiple notebooks and CSV dataset viewers simultaneously with dirty indicators.
- **JupyterLab Toolbar:**
  - Save notebook (`Ctrl+S`).
  - Insert cell below (`B` / `+`).
  - Cut (`X`), Copy (`C`), Paste (`V`).
  - Run selected cell (`Shift+Enter` / `Ctrl+Enter`).
  - Interrupt kernel & Restart kernel.
  - Cell type switcher (`Code` / `Markdown`).
  - Live kernel execution status indicator.
- **Interactive Code Cells:**
  - Built with CodeMirror with Python syntax highlighting and auto-indentation.
  - Execution counters (`In [1]:`, `In [*]:`, `In [ ]:`) and active cell blue highlight border.
  - Hover action toolbar (Run, Insert Below, Duplicate, Move Up, Move Down, Delete).
  - Output renderer supporting text streams, formatted DataFrames, Matplotlib & Decision Tree visualizations, and error tracebacks.
  - Markdown cell preview and double-click editing.
- **Fixed Status Bar:** Active notebook path, Command/Edit mode, current cell position (`Cell X of Y`), Kernel status, Cloud Firestore status, and Pyodide Wasm engine badge.
- **Theme Support:** JupyterLab Light & JupyterLab Dark modes with persistent storage.

---

### 2. Cloud Firestore Real-time Storage Integration
- **Project ID:** `localhost3000-6ed4c`
- **Collections:**
  1. `notebooks`: Stores all practical notebooks, cell sources, execution counters, and output states.
  2. `workspace_folders`: Stores directory structure (e.g., `/practicals`).
  3. `workspace_datasets`: Stores CSV datasets (e.g., `Iris.csv`).
- **Realtime Sync & Offline Cache:** Realtime updates via `onSnapshot` with immediate local caching in `localStorage` to ensure instant responsiveness.

---

### 3. Administrator Program Management System
- **Access Point:** Small settings gear icon at the **extreme bottom-left corner** of the application.
- **Authentication:**
  - **ID / Username:** `kaushik`
  - **Password:** `321`
  - Masked password with Show/Hide toggle and error validation.
- **Practical Program Manager Interface:**
  - Program Listing with title, practical number, filename, dataset badge, description, and modified date.
  - **Add Program:** Form to create practicals with custom titles, numbers, filenames, descriptions, and code (auto-syncs to Firestore).
  - **Edit Program:** Prepopulated form to update existing practicals.
  - **Delete Program:** Confirmation safety modal to prevent accidental deletion.
  - **Search & Sort:** Instant filtering by title or practical number, with alphabetical, numerical, and date sorting.
  - **Auto-Sync:** All admin changes instantly persist in Cloud Firestore and update the Student Workspace.
  - **Logout:** Returns to the Student Workspace and secures admin functions.

---

### 4. Machine Learning Demonstration Practicals
- **Practical No. 7: Decision Tree Classifier** (`Decision_Tree.ipynb`):
  1. Import Libraries (`pandas`, `numpy`, `matplotlib`, `sklearn`).
  2. Load Dataset (`Iris.csv`).
  3. Encode Species (`LabelEncoder`).
  4. Drop Id Column.
  5. Separate Features and Target.
  6. Train-Test Split (70/30).
  7. Decision Tree Without Depth Control (Entropy criterion).
  8. Prediction and Evaluation (Confusion Matrix & Classification Report).
  9. Visualize Decision Tree (Rendered Decision Tree diagram).
  10. Decision Tree With Depth Control (`max_depth=2`).
  11. Prediction and Evaluation After Pruning.
  12. Tree Information (`get_depth()`, `get_n_leaves()`).
  13. Visualize Pruned Tree.
- **Dataset Viewer:** Built-in spreadsheet viewer for `Iris.csv` with search, column tracking, and export.

---

### 5. Python Execution Engine
- Powered by **Pyodide** (Python 3 in WebAssembly).
- Loads NumPy, Pandas, Matplotlib, and Scikit-learn directly in the browser without server dependencies.
- Features in-memory file system mounting (`Iris.csv`) so `pd.read_csv('Iris.csv')` works out-of-the-box.
- Built-in fallback execution engine ensures immediate feedback even during package initialization or offline mode.

---

## ⌨️ Keyboard Shortcuts
| Shortcut | Action |
| :--- | :--- |
| `Shift + Enter` | Execute current cell and advance to next |
| `Ctrl + Enter` | Execute current cell and stay |
| `Alt + Enter` | Execute current cell and insert new cell below |
| `Ctrl + S` | Save current notebook to Firestore |
| `A` | Insert new cell above (in command mode) |
| `B` | Insert new cell below (in command mode) |
| `M` | Convert cell to Markdown |
| `Y` | Convert cell to Code |
| `D, D` | Delete current cell (press D twice) |
| `Ctrl + B` | Toggle left sidebar visibility |

---

## 🚀 Running the Application
The application is running locally at:
```
http://localhost:5173/
```
