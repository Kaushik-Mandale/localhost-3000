import { PracticalProgram } from '../types/notebook';

export const IRIS_CSV_CONTENT = `Id,SepalLengthCm,SepalWidthCm,PetalLengthCm,PetalWidthCm,Species
1,5.1,3.5,1.4,0.2,Iris-setosa
2,4.9,3.0,1.4,0.2,Iris-setosa
3,4.7,3.2,1.3,0.2,Iris-setosa
4,4.6,3.1,1.5,0.2,Iris-setosa
5,5.0,3.6,1.4,0.2,Iris-setosa
6,5.4,3.9,1.7,0.4,Iris-setosa
7,4.6,3.4,1.4,0.3,Iris-setosa
8,5.0,3.4,1.5,0.2,Iris-setosa
9,4.4,2.9,1.4,0.2,Iris-setosa
10,4.9,3.1,1.5,0.1,Iris-setosa
51,7.0,3.2,4.7,1.4,Iris-versicolor
52,6.4,3.2,4.5,1.5,Iris-versicolor
53,6.9,3.1,4.9,1.5,Iris-versicolor
54,5.5,2.3,4.0,1.3,Iris-versicolor
55,6.5,2.8,4.6,1.5,Iris-versicolor
56,5.7,2.8,4.5,1.3,Iris-versicolor
57,6.3,3.3,4.7,1.6,Iris-versicolor
58,4.9,2.4,3.3,1.0,Iris-versicolor
59,6.6,2.9,4.6,1.3,Iris-versicolor
60,5.2,2.7,3.9,1.4,Iris-versicolor
101,6.3,3.3,6.0,2.5,Iris-virginica
102,5.8,2.7,5.1,1.9,Iris-virginica
103,7.1,3.0,5.9,2.1,Iris-virginica
104,6.3,2.9,5.6,1.8,Iris-virginica
105,6.5,3.0,5.8,2.2,Iris-virginica
106,7.6,3.0,6.6,2.1,Iris-virginica
107,4.9,2.5,4.5,1.7,Iris-virginica
108,7.3,2.9,6.3,1.8,Iris-virginica
109,6.7,2.5,5.8,1.8,Iris-virginica
110,6.5,3.2,5.1,2.0,Iris-virginica`;

// Clean initial blank notebook like native JupyterLab
export const INITIAL_PROGRAMS: PracticalProgram[] = [
  {
    id: "nb-untitled-1",
    practicalNumber: 1,
    title: "Untitled",
    filename: "Untitled.ipynb",
    description: "",
    dataset: "Iris.csv",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cells: [
      {
        id: "cell-init-1",
        type: "code",
        source: "",
        executionCount: null,
        outputs: []
      }
    ]
  }
];

export const DEFAULT_DIRECTORIES = [
  { id: 'dir-1', name: 'anaconda_projects', modified: '7mo ago' },
  { id: 'dir-2', name: 'anaconda3', modified: '7mo ago' },
  { id: 'dir-3', name: 'Contacts', modified: '10mo ago' },
  { id: 'dir-4', name: 'CrossDevice', modified: '2mo ago' },
  { id: 'dir-5', name: 'Desktop', modified: '19d ago' },
  { id: 'dir-6', name: 'Documents', modified: '27d ago' },
  { id: 'dir-7', name: 'Downloads', modified: '49m ago' },
  { id: 'dir-8', name: 'Favorites', modified: '10mo ago' },
  { id: 'dir-9', name: 'MLOps Project', modified: 'yesterday' },
  { id: 'dir-10', name: 'Music', modified: '10mo ago' },
  { id: 'dir-11', name: 'Pictures', modified: '4mo ago' },
  { id: 'dir-12', name: 'Videos', modified: 'last mo.' },
];
