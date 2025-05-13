import React, { useState, useEffect } from "react";
import { IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption } from "@ionic/react";

type Option = { value: string; label: string };
type Field = {
  name: string;
  label: string;
  type?: string;
  options?: Option[];
  required?: boolean;
};

export interface FormGenericoProps {
  fields: Field[];
  onSubmit: (data: any) => void | Promise<void>;
  onCancel?: () => void;
  initialValues?: any;
}

const FormGenerico: React.FC<FormGenericoProps> = ({
  fields,
  onSubmit,
  onCancel,
  initialValues = {},
}) => {
  const [form, setForm] = useState<any>(initialValues);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setForm(initialValues);
    }
    // No hagas nada si initialValues es undefined o vacío (modo crear)
  }, [initialValues]);

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
      {fields.map((field: Field) =>
        field.options ? (
          <IonItem key={field.name}>
            <IonLabel>{field.label}</IonLabel>
            <IonSelect
              name={field.name}
              value={form[field.name] || ""}
              onIonChange={e => setForm({ ...form, [field.name]: e.detail.value })}
              required={field.required}
            >
              {field.options.map((opt: Option) => (
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
      {onCancel && (
        <IonButton expand="block" color="medium" style={{ marginTop: 8 }} onClick={onCancel}>
          Cancelar
        </IonButton>
      )}
    </form>
  );
};

export default FormGenerico;