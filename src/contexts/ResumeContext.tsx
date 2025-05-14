// @ts-nocheck
"use client";

import type { GenerateResumeContentOutput } from '@/ai/flows/generate-resume-content';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ResumeState {
  resumeData: GenerateResumeContentOutput | null;
  isLoading: boolean;
  error: string | null;
  setResumeData: (data: GenerateResumeContentOutput | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const ResumeContext = createContext<ResumeState | undefined>(undefined);

const RESUME_STORAGE_KEY = 'resumeBoostData';

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeDataState] = useState<GenerateResumeContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load from localStorage on mount
    try {
      const storedData = localStorage.getItem(RESUME_STORAGE_KEY);
      if (storedData) {
        setResumeDataState(JSON.parse(storedData));
      }
    } catch (e) {
      console.error("Failed to load resume data from localStorage", e);
      localStorage.removeItem(RESUME_STORAGE_KEY);
    }
  }, []);

  const setResumeData = (data: GenerateResumeContentOutput | null) => {
    setResumeDataState(data);
    if (data) {
      try {
        localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error("Failed to save resume data to localStorage", e);
      }
    } else {
      localStorage.removeItem(RESUME_STORAGE_KEY);
    }
  };
  
  return (
    <ResumeContext.Provider value={{ resumeData, isLoading, error, setResumeData, setIsLoading, setError }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = (): ResumeState => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
