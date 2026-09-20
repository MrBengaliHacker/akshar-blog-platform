import * as React from "react";

import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export const Form = FormProvider;

const FormFieldContext = React.createContext<{
  name: string;
} | null>(null);

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}

export function FormLabel(
  props: React.LabelHTMLAttributes<HTMLLabelElement>,
) {
  return <label {...props} />;
}

export function FormControl(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return <div {...props} />;
}

export function FormMessage() {
  const fieldContext = React.useContext(FormFieldContext);

  const {
    formState: { errors },
  } = useFormContext();

  if (!fieldContext) return null;

  const error = errors[fieldContext.name];

  if (!error) return null;

  return (
    <p className="text-sm text-red-500">
      {String(error.message ?? "")}
    </p>
  );
}