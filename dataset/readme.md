# Dataset Annotation Tool

A specialized React-based internal tool designed for efficient dataset collection and annotation. This tool allows contributors to generate English-to-Pangasinan translation pairs and save them in bulk to Firebase Firestore.

---

## :document: Overview

The application streamlines the data entry process by allowing users to draft multiple entries locally before committing them to the database. This reduces API calls and ensures that only completed, reviewed batches are stored.

### :star: Core Features
* **User Attribution:** Dropdown selection for contributors (Jelian, Nathan, Jeliane, Shaira, Raven).
* **Dynamic Entry Management:** Add or remove translation pairs dynamically using a local state array.
* **Smart Defaults:** Automatically populates instructions for Pangasinan translation tasks to speed up workflow.
* **Firebase Integration:** Utilizes Firestore for persistent storage with structured document schema.
* **Batch Operations:** Implements a "Save to DB" logic that prevents partial data entry and ensures data integrity.

---

## :hammer_and_wrench: Tech Stack

* **Framework:** React (Functional Components & Hooks)
* **Styling:** Tailwind CSS (Responsive & Clean UI)
* **Database:** Firebase Firestore
* **State Management:** React `useState`

---

## :open_file_folder: Project Structure & Logic

### 1. State Management
The tool utilizes two primary state variables to manage data before the final save:
* `selectedUser`: A string identifying the current annotator.
* `entries`: An array of objects. Each object follows the schema:
    ```javascript
    {
      id: string,
      instruction: string,
      input: string,
      output: string
    }
    ```

### 2. Database Schema
When the **Save to DB** button is clicked, a new document is created in the `translations` collection with the following structure:

| Field | Type | Description |
| :--- | :--- | :--- |
| `annotator` | String | The name selected from the dropdown. |
| `data` | Array | The complete list of translation entries. |
| `timestamp` | Timestamp | Server-generated time of the save operation. |

---

## :gear: Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    cd dataset-annotation-tool
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    Create a `.env` file in the root directory and add your Firebase credentials:
    ```env
    REACT_APP_FIREBASE_API_KEY=your_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    ```

4.  **Run the application:**
    ```bash
    npm start
    ```

---

## :bulb: Usage Guide

1.  **Select Identity:** Choose your name from the dropdown at the top of the page.
2.  **Input Data:** Fill in the *English* (Input) and *Pangasinan* (Output) fields. The *Instruction* field is pre-filled but can be edited if necessary.
3.  **Manage List:** Use the **"Add"** button to create a new row or the **"Delete"** button to remove specific entries.
4.  **Finalize:** Once all entries for the session are ready, click **"Save to DB"**. A success notification will confirm the data has been sent to Firestore.

> :warning: **Note:** Refreshing the page before clicking "Save to DB" will clear all current entries as they are held in local state.
