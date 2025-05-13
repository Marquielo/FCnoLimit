import React from "react";
import { IonButton } from "@ionic/react";

// Tipado de props para mayor claridad y control
interface Section {
  key: string;
  label: string;
}

interface SidebarSectionsProps {
  sections: Section[];
  selected: string;
  onSelect: (key: string) => void;
}

const SidebarSections: React.FC<SidebarSectionsProps> = ({ sections, selected, onSelect }) => (
  <aside className="admin-sidebar">
    {sections.map(sec => (
      <IonButton
        key={sec.key}
        expand="block"
        color={selected === sec.key ? "primary" : "medium"}
        onClick={() => onSelect(sec.key)}
        style={{ marginBottom: 12 }}
      >
        {sec.label}
      </IonButton>
    ))}
  </aside>
);

export default SidebarSections;