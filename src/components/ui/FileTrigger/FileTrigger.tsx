"use client";

import clsx from "clsx";
import { useCallback } from "react";
import { Pressable, FileTrigger as RACFileTrigger } from "react-aria-components";
import { FaUpload } from "react-icons/fa6";

import styles from "./FileTrigger.module.css";

export interface FileTriggerProps {
  onFileSelect: (files: File[]) => void;
  acceptedFileTypes?: readonly string[];
  allowsMultiple?: boolean;
  acceptDirectory?: boolean;
  isDisabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export function FileTrigger({
  onFileSelect,
  acceptedFileTypes,
  allowsMultiple,
  acceptDirectory,
  isDisabled,
  label = "Click to browse files",
  description,
  className,
}: FileTriggerProps) {
  const handleSelect = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      onFileSelect(Array.from(fileList));
    },
    [onFileSelect],
  );

  return (
    <RACFileTrigger
      acceptedFileTypes={acceptedFileTypes}
      allowsMultiple={allowsMultiple}
      acceptDirectory={acceptDirectory}
      onSelect={handleSelect}
    >
      <Pressable>
        <div
          className={clsx(styles.trigger, isDisabled && styles.disabled, className)}
          role="button"
          aria-disabled={isDisabled}
        >
          <FaUpload className={styles.icon} aria-hidden="true" />
          <span className={styles.label}>{label}</span>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </Pressable>
    </RACFileTrigger>
  );
}
