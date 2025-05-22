import React, { useState } from "react";
import { IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption } from "@ionic/react";

type Field = {
  name: string;
  label: string;
  type?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
};

interface FormGenericoProps {
  fields: Field[];
  onSubmit: (data: any) => void;
}

const FormGenerico: React.FC<FormGenericoProps> = ({ fields, onSubmit }) => {
  const [form, setForm] = useState<any>({});

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      {fields.map(field =>
        field.options ? (
          <IonItem key={field.name}>
            <IonLabel>{field.label}</IonLabel>
            <IonSelect
              name={field.name}
              value={form[field.name] || ""}
              onIonChange={e => setForm({ ...form, [field.name]: e.detail.value })}
              required={field.required}
            >
              {field.options.map(opt => (
                <IonSelectOption key={opt.value} value={opt.value}>
                  {opt.label}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        ) : (
          <IonItem key={field.name}>
            <IonLabel position="floating">{field.label}</IonLabel>
            <IonInput
              name={field.name}
              type={field.type as import('@ionic/core').TextFieldTypes || "text"}
              value={form[field.name] || ""}
              onIonChange={handleChange}
              required={field.required}
            />
          </IonItem>
        )
      )}
      <IonButton expand="block" type="submit" color="primary" style={{ marginTop: 16 }}>
        Guardar
      </IonButton>
    </form>
  );
};

export default FormGenerico;