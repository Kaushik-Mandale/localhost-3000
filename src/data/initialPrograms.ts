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

export const INITIAL_PROGRAMS: PracticalProgram[] = [
  {
    id: "prac-7",
    practicalNumber: 7,
    title: "Decision Tree Classifier",
    filename: "Decision_Tree.ipynb",
    description: "Implement and visualize a Decision Tree Classifier using Scikit-learn.",
    dataset: "Iris.csv",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cells: [
      {
        id: "c1",
        type: "markdown",
        source: "# Practical No. 7: Decision Tree Classifier\n**Objective:** Implement and visualize a Decision Tree Classifier on the Iris dataset.",
        executionCount: null,
        outputs: []
      },
      {
        id: "c2",
        type: "code",
        source: `# 1. Import Libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
print("Libraries imported successfully.")`,
        executionCount: 1,
        outputs: [
          {
            id: "out-1",
            outputType: "stream",
            text: "Libraries imported successfully.\n"
          }
        ]
      },
      {
        id: "c3",
        type: "code",
        source: `# 2. Load Dataset
df = pd.read_csv('Iris.csv')
print("Dataset Shape:", df.shape)
df.head()`,
        executionCount: 2,
        outputs: [
          {
            id: "out-2",
            outputType: "stream",
            text: "Dataset Shape: (30, 6)\n"
          },
          {
            id: "out-2-df",
            outputType: "dataframe",
            text: "   Id  SepalLengthCm  SepalWidthCm  PetalLengthCm  PetalWidthCm      Species\n0   1            5.1           3.5            1.4           0.2  Iris-setosa\n1   2            4.9           3.0            1.4           0.2  Iris-setosa\n2   3            4.7           3.2            1.3           0.2  Iris-setosa\n3   4            4.6           3.1            1.5           0.2  Iris-setosa\n4   5            5.0           3.6            1.4           0.2  Iris-setosa",
            html: `<table class="dataframe-table"><thead><tr><th></th><th>Id</th><th>SepalLengthCm</th><th>SepalWidthCm</th><th>PetalLengthCm</th><th>PetalWidthCm</th><th>Species</th></tr></thead><tbody><tr><th>0</th><td>1</td><td>5.1</td><td>3.5</td><td>1.4</td><td>0.2</td><td>Iris-setosa</td></tr><tr><th>1</th><td>2</td><td>4.9</td><td>3.0</td><td>1.4</td><td>0.2</td><td>Iris-setosa</td></tr><tr><th>2</th><td>3</td><td>4.7</td><td>3.2</td><td>1.3</td><td>0.2</td><td>Iris-setosa</td></tr><tr><th>3</th><td>4</td><td>4.6</td><td>3.1</td><td>1.5</td><td>0.2</td><td>Iris-setosa</td></tr><tr><th>4</th><td>5</td><td>5.0</td><td>3.6</td><td>1.4</td><td>0.2</td><td>Iris-setosa</td></tr></tbody></table>`
          }
        ]
      },
      {
        id: "c4",
        type: "code",
        source: `# 3. Encode Species
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
df['Species_Encoded'] = le.fit_transform(df['Species'])
print("Unique Species:", list(le.classes_))
df[['Species', 'Species_Encoded']].drop_duplicates()`,
        executionCount: 3,
        outputs: [
          {
            id: "out-3",
            outputType: "stream",
            text: "Unique Species: ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica']\n"
          },
          {
            id: "out-3-df",
            outputType: "dataframe",
            html: `<table class="dataframe-table"><thead><tr><th></th><th>Species</th><th>Species_Encoded</th></tr></thead><tbody><tr><th>0</th><td>Iris-setosa</td><td>0</td></tr><tr><th>10</th><td>Iris-versicolor</td><td>1</td></tr><tr><th>20</th><td>Iris-virginica</td><td>2</td></tr></tbody></table>`
          }
        ]
      },
      {
        id: "c5",
        type: "code",
        source: `# 4. Drop Id Column
if 'Id' in df.columns:
    df.drop('Id', axis=1, inplace=True)
print("Columns after dropping Id:", list(df.columns))`,
        executionCount: 4,
        outputs: [
          {
            id: "out-4",
            outputType: "stream",
            text: "Columns after dropping Id: ['SepalLengthCm', 'SepalWidthCm', 'PetalLengthCm', 'PetalWidthCm', 'Species', 'Species_Encoded']\n"
          }
        ]
      },
      {
        id: "c6",
        type: "code",
        source: `# 5. Separate Features and Target
X = df[['SepalLengthCm', 'SepalWidthCm', 'PetalLengthCm', 'PetalWidthCm']]
y = df['Species_Encoded']
print("Feature matrix shape:", X.shape)
print("Target vector shape:", y.shape)`,
        executionCount: 5,
        outputs: [
          {
            id: "out-5",
            outputType: "stream",
            text: "Feature matrix shape: (30, 4)\nTarget vector shape: (30,)\n"
          }
        ]
      },
      {
        id: "c7",
        type: "code",
        source: `# 6. Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)
print("Training set count:", len(X_train))
print("Testing set count:", len(X_test))`,
        executionCount: 6,
        outputs: [
          {
            id: "out-6",
            outputType: "stream",
            text: "Training set count: 21\nTesting set count: 9\n"
          }
        ]
      },
      {
        id: "c8",
        type: "code",
        source: `# 7. Decision Tree Without Depth Control
dt_full = DecisionTreeClassifier(criterion='entropy', random_state=42)
dt_full.fit(X_train, y_train)
print("Full Tree Trained.")`,
        executionCount: 7,
        outputs: [
          {
            id: "out-7",
            outputType: "stream",
            text: "Full Tree Trained.\n"
          }
        ]
      },
      {
        id: "c9",
        type: "code",
        source: `# 8. Prediction and Evaluation
y_pred = dt_full.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Accuracy Score: {acc * 100:.2f}%\n")
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred, target_names=le.classes_))`,
        executionCount: 8,
        outputs: [
          {
            id: "out-8",
            outputType: "stream",
            text: `Accuracy Score: 100.00%

Confusion Matrix:
 [[3 0 0]
 [0 3 0]
 [0 0 3]]

Classification Report:
                  precision    recall  f1-score   support

    Iris-setosa       1.00      1.00      1.00         3
Iris-versicolor       1.00      1.00      1.00         3
 Iris-virginica       1.00      1.00      1.00         3

       accuracy                           1.00         9
      macro avg       1.00      1.00      1.00         9
   weighted avg       1.00      1.00      1.00         9
`
          }
        ]
      },
      {
        id: "c10",
        type: "code",
        source: `# 9. Visualize Decision Tree
plt.figure(figsize=(10, 6), dpi=100)
plot_tree(
    dt_full,
    feature_names=list(X.columns),
    class_names=list(le.classes_),
    filled=True,
    rounded=True
)
plt.title("Decision Tree Classifier (Unpruned)")
plt.show()`,
        executionCount: 9,
        outputs: [
          {
            id: "out-9-svg",
            outputType: "image",
            text: "<visual tree representation rendered>"
          }
        ]
      },
      {
        id: "c11",
        type: "code",
        source: `# 10. Decision Tree With Depth Control
dt_pruned = DecisionTreeClassifier(criterion='entropy', max_depth=2, random_state=42)
dt_pruned.fit(X_train, y_train)
print("Pruned Tree (max_depth=2) trained.")`,
        executionCount: 10,
        outputs: [
          {
            id: "out-10",
            outputType: "stream",
            text: "Pruned Tree (max_depth=2) trained.\n"
          }
        ]
      },
      {
        id: "c12",
        type: "code",
        source: `# 11. Prediction and Evaluation After Pruning
y_pruned_pred = dt_pruned.predict(X_test)
print(f"Pruned Tree Accuracy: {accuracy_score(y_test, y_pruned_pred) * 100:.2f}%")`,
        executionCount: 11,
        outputs: [
          {
            id: "out-11",
            outputType: "stream",
            text: "Pruned Tree Accuracy: 100.00%\n"
          }
        ]
      },
      {
        id: "c13",
        type: "code",
        source: `# 12. Tree Information
print(f"Depth of unpruned tree: {dt_full.get_depth()}")
print(f"Number of leaves in unpruned tree: {dt_full.get_n_leaves()}")
print(f"Depth of pruned tree: {dt_pruned.get_depth()}")
print(f"Number of leaves in pruned tree: {dt_pruned.get_n_leaves()}")`,
        executionCount: 12,
        outputs: [
          {
            id: "out-12",
            outputType: "stream",
            text: `Depth of unpruned tree: 3
Number of leaves in unpruned tree: 4
Depth of pruned tree: 2
Number of leaves in pruned tree: 3
`
          }
        ]
      },
      {
        id: "c14",
        type: "code",
        source: `# 13. Visualize Pruned Tree
plt.figure(figsize=(8, 5), dpi=100)
plot_tree(
    dt_pruned,
    feature_names=list(X.columns),
    class_names=list(le.classes_),
    filled=True,
    rounded=True
)
plt.title("Pruned Decision Tree (max_depth=2)")
plt.show()`,
        executionCount: 13,
        outputs: [
          {
            id: "out-13-svg",
            outputType: "image",
            text: "<visual tree representation rendered>"
          }
        ]
      }
    ]
  },
  {
    id: "prac-8",
    practicalNumber: 8,
    title: "K-Nearest Neighbors (KNN)",
    filename: "KNN_Practical.ipynb",
    description: "Classification of flower species using KNN algorithm with optimal K evaluation.",
    dataset: "Iris.csv",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cells: [
      {
        id: "knn-1",
        type: "markdown",
        source: "# Practical No. 8: K-Nearest Neighbors Classifier\n**Objective:** Train and test KNN classifier on Iris dataset with different values of K.",
        executionCount: null,
        outputs: []
      },
      {
        id: "knn-2",
        type: "code",
        source: `import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

df = pd.read_csv('Iris.csv')
X = df[['SepalLengthCm', 'SepalWidthCm', 'PetalLengthCm', 'PetalWidthCm']]
y = df['Species']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)

y_pred = knn.predict(X_test)
print(f"KNN (k=3) Test Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")`,
        executionCount: 1,
        outputs: [
          {
            id: "knn-out-1",
            outputType: "stream",
            text: "KNN (k=3) Test Accuracy: 100.00%\n"
          }
        ]
      }
    ]
  }
];
