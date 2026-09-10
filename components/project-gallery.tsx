"use client";

import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useProjectSelection } from "./project-selection";

export type ProjectPhoto = {
  image: string;
  alt: string;
  width?: number;
  height?: number;
};

export function ProjectGallery({ projects }: { projects: ProjectPhoto[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const { setLook } = useProjectSelection();

  function chooseLook(project: ProjectPhoto) {
    setSelected(null);
    setLook({ ...project });
  }

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowRight") setSelected((selected + 1) % projects.length);
      if (event.key === "ArrowLeft") setSelected((selected - 1 + projects.length) % projects.length);
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [selected, projects.length]);

  function move(direction: number) {
    if (selected === null) return;
    setSelected((selected + direction + projects.length) % projects.length);
  }

  return (
    <>
      <div className="project-grid">
        {projects.map((project, index) => (
          <figure className="project-card" key={`${project.image}-${index}`}>
            <button
              className="project-open"
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`View photo ${index + 1}`}
            >
              <span className="project-media">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  quality={90}
                  sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                />
              </span>
            </button>
            <figcaption className="project-caption">
              <button className="project-look" type="button" onClick={() => chooseLook(project)} aria-label={`Get this look: ${project.alt}`}>
                Get this look <ArrowRight size={16} />
              </button>
            </figcaption>
          </figure>
        ))}
      </div>

      {selected !== null && projects[selected] && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${selected + 1}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close photo">
            <X size={24} />
          </button>
          <button className="lightbox-arrow previous" onClick={() => move(-1)} aria-label="Previous photo">
            <ChevronLeft size={28} />
          </button>
          <div className="lightbox-content">
            <div className="lightbox-image">
              <Image
                src={projects[selected].image}
                alt={projects[selected].alt}
                fill
                quality={100}
                sizes="95vw"
                priority
              />
            </div>
            <button className="button button-gold lightbox-look" type="button" onClick={() => chooseLook(projects[selected])}>
              Get this look <ArrowRight size={16} />
            </button>
          </div>
          <button className="lightbox-arrow next" onClick={() => move(1)} aria-label="Next photo">
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </>
  );
}
