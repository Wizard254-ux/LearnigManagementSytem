// src/context/LecturerContext.js
import React, { createContext, useState } from "react";

export const LecturerContext = createContext();

export const LecturerProvider = ({ children }) => {
  // Dummy data for lecturers
  const [lecturers, setLecturers] = useState([
    {
      id: 1,
      name: "John Doe",
      staffNumber: "12345",
      department: "CIT",
      units: ["Unit 1", "Unit 2"],
      isActive: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      staffNumber: "67890",
      department: "Engineering",
      units: [],
      isActive: true,
    },
  ]);

  // Dummy data for documents
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "Timetable",
      department: "All",
      file: "timetable.pdf",
    },
  ]);

  // Add a new lecturer
  const addLecturer = (lecturer) => {
    setLecturers([...lecturers, { ...lecturer, id: Date.now(), isActive: true }]);
  };

  // Assign units to a lecturer
  const assignUnits = (id, units) => {
    setLecturers(
      lecturers.map((lecturer) =>
        lecturer.id === id ? { ...lecturer, units } : lecturer
      )
    );
  };

  // Inactivate a lecturer
  const inactivateLecturer = (id) => {
    setLecturers(
      lecturers.map((lecturer) =>
        lecturer.id === id ? { ...lecturer, isActive: false } : lecturer
      )
    );
  };

  // Update lecturer details
  const updateLecturer = (id, updatedData) => {
    setLecturers(
      lecturers.map((lecturer) =>
        lecturer.id === id ? { ...lecturer, ...updatedData } : lecturer
      )
    );
  };

  // Post a document
  const postDocument = (document) => {
    setDocuments([...documents, { ...document, id: Date.now() }]);
  };

  return (
    <LecturerContext.Provider
      value={{
        lecturers,
        documents,
        addLecturer,
        assignUnits,
        inactivateLecturer,
        updateLecturer,
        postDocument,
      }}
    >
      {children}
    </LecturerContext.Provider>
  );
};