import { type MouseEvent, useEffect, useRef, useState } from "react";

export type SectionNavItem = {
  href: string;
  id: string;
  label: string;
};

type PageSectionNavProps = {
  ariaLabel?: string;
  sections: readonly SectionNavItem[];
};

function getHashSectionId(sections: readonly SectionNavItem[]) {
  const id = window.location.hash.replace("#", "");

  return sections.some((item) => item.id === id) ? id : null;
}

function getActivationLine(
  sectionElements: HTMLElement[],
  navElement: HTMLElement | null,
) {
  const headerBottom =
    navElement?.closest("header")?.getBoundingClientRect().bottom ?? 0;
  const scrollMarginTop = Number.parseFloat(
    window.getComputedStyle(sectionElements[0]).scrollMarginTop,
  );

  return Math.max(
    headerBottom,
    Number.isFinite(scrollMarginTop) ? scrollMarginTop : 0,
  );
}

function scrollToSection(
  sectionElement: HTMLElement,
  navElement: HTMLElement | null,
) {
  const activationLine = getActivationLine([sectionElement], navElement);

  window.scrollTo({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    top:
      window.scrollY +
      sectionElement.getBoundingClientRect().top -
      activationLine,
  });
}

function getCurrentSectionId(
  sections: readonly SectionNavItem[],
  sectionElements: HTMLElement[],
  navElement: HTMLElement | null,
) {
  const activationLine = getActivationLine(sectionElements, navElement);
  let currentSectionId = sections[0]?.id ?? "";

  for (const section of sectionElements) {
    if (section.getBoundingClientRect().top <= activationLine + 1) {
      currentSectionId = section.id;
    }
  }

  return currentSectionId;
}

export function PageSectionNav({
  ariaLabel = "Page sections",
  sections,
}: PageSectionNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const requestedSectionRef = useRef<string | null>(null);
  const releaseRequestedSectionTimeoutRef = useRef<number | null>(null);
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const sectionElements = sections
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    if (sectionElements.length === 0) {
      return;
    }

    const updateActiveSection = () => {
      if (requestedSectionRef.current) {
        return;
      }

      setActiveSection((currentSection) => {
        const nextSection = getCurrentSectionId(
          sections,
          sectionElements,
          navRef.current,
        );

        return nextSection === currentSection ? currentSection : nextSection;
      });
    };

    const updateActiveSectionFromHash = () => {
      const hashSectionId = getHashSectionId(sections);

      if (hashSectionId) {
        requestedSectionRef.current = hashSectionId;
        setActiveSection(hashSectionId);
        releaseRequestedSectionTimeoutRef.current = window.setTimeout(() => {
          if (requestedSectionRef.current === hashSectionId) {
            requestedSectionRef.current = null;
            releaseRequestedSectionTimeoutRef.current = null;
            updateActiveSection();
          }
        }, 500);
        return;
      }

      updateActiveSection();
    };

    updateActiveSectionFromHash();

    window.addEventListener("hashchange", updateActiveSectionFromHash);
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      if (releaseRequestedSectionTimeoutRef.current !== null) {
        window.clearTimeout(releaseRequestedSectionTimeoutRef.current);
      }

      window.removeEventListener("hashchange", updateActiveSectionFromHash);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [sections]);

  const handleLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    item: SectionNavItem,
  ) => {
    const sectionElement = document.getElementById(item.id);

    if (!sectionElement) {
      return;
    }

    event.preventDefault();

    if (releaseRequestedSectionTimeoutRef.current !== null) {
      window.clearTimeout(releaseRequestedSectionTimeoutRef.current);
    }

    requestedSectionRef.current = item.id;
    setActiveSection(item.id);
    window.history.pushState(null, "", item.href);
    scrollToSection(sectionElement, navRef.current);

    releaseRequestedSectionTimeoutRef.current = window.setTimeout(() => {
      requestedSectionRef.current = null;
      releaseRequestedSectionTimeoutRef.current = null;
    }, 650);
  };

  return (
    <nav
      aria-label={ariaLabel}
      className="border-t border-primary/10 py-2"
      ref={navRef}
    >
      <div className="flex gap-px overflow-x-auto border border-primary/10 bg-background/70 p-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
        {sections.map((item) => {
          const isActive = item.id === activeSection;

          return (
            <a
              aria-current={isActive ? "location" : undefined}
              className={`shrink-0 border px-3 py-2 font-display text-base uppercase leading-none outline-none transition sm:text-lg ${
                isActive
                  ? "border-primary bg-primary text-background"
                  : "menu-link border-transparent text-foreground hover:border-foreground/30 hover:bg-foreground/5 hover:text-loud-foreground focus-visible:border-foreground/30 focus-visible:bg-foreground/5 focus-visible:text-loud-foreground"
              }`}
              href={item.href}
              key={item.id}
              onClick={(event) => handleLinkClick(event, item)}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
