"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ProjectPhoto } from "./project-gallery";

const ProjectSelectionContext = createContext<{
  look: ProjectPhoto | null;
  setLook: (look: ProjectPhoto | null) => void;
} | null>(null);

export function ProjectSelectionProvider({ children }: { children: ReactNode }) {
  const [look, setLook] = useState<ProjectPhoto | null>(null);
  return <ProjectSelectionContext.Provider value={{ look, setLook }}>{children}</ProjectSelectionContext.Provider>;
}

export function useProjectSelection() {
  const context = useContext(ProjectSelectionContext);
  if (!context) throw new Error("Project selection requires ProjectSelectionProvider");
  return context;
}
