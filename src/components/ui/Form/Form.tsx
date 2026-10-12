"use client";

import clsx from "clsx";
import {
  FieldError as RACFieldError,
  Form as RACForm,
  Label as RACLabel,
  Text as RACText,
  type FieldErrorProps,
  type LabelProps,
  type FormProps as RACFormProps,
  type TextProps,
} from "react-aria-components";

import styles from "./Form.module.css";

export function Form({ className, ...props }: RACFormProps) {
  return <RACForm {...props} className={clsx(styles.form, className)} />;
}

export function Label({ className, ...props }: LabelProps) {
  return <RACLabel {...props} className={clsx(styles.label, className)} />;
}

export function Description({ className, ...props }: TextProps) {
  return <RACText slot="description" {...props} className={clsx(styles.description, className)} />;
}

export function FieldError({ className, ...props }: FieldErrorProps) {
  return <RACFieldError {...props} className={clsx(styles.fieldError, className)} />;
}
