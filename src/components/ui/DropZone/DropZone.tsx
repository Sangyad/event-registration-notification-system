"use client";

import clsx from "clsx";
import { useCallback } from "react";
import {
  FileTrigger,
  isFileDropItem,
  Pressable,
  DropZone as RACDropZone,
  Text,
  type DropZoneProps as RACDropZoneProps,
} from "react-aria-components";
import { FaUpload } from "react-icons/fa6";

import styles from "./DropZone.module.css";

export interface DropZoneProps {
  onFileSelect: (files: File[]) => void;
  acceptedFileTypes?: readonly string[];
  allowsMultiple?: boolean;
  acceptDirectory?: boolean;
  isDisabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export function DropZone({
  onFileSelect,
  acceptedFileTypes,
  allowsMultiple,
  acceptDirectory,
  isDisabled,
  label = "Drag & drop files here or click to browse",
  description,
  className,
}: DropZoneProps) {
  const handleDrop = useCallback<NonNullable<RACDropZoneProps["onDrop"]>>(
    async (event) => {
      const files: File[] = [];
      for (const item of event.items) {
        if (isFileDropItem(item)) {
          files.push(await item.getFile());
        }
      }
      if (files.length > 0) {
        onFileSelect(files);
      }
    },
    [onFileSelect],
  );

  const handleSelect = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      onFileSelect(Array.from(fileList));
    },
    [onFileSelect],
  );

  return (
    <RACDropZone
      isDisabled={isDisabled}
      getDropOperation={() => "copy"}
      onDrop={handleDrop}
      className={clsx(styles.dropZone, className)}
    >
      <FileTrigger
        acceptedFileTypes={acceptedFileTypes}
        allowsMultiple={allowsMultiple}
        acceptDirectory={acceptDirectory}
        onSelect={handleSelect}
      >
        <Pressable>
          <div className={styles.content} role="button">
            <FaUpload className={styles.icon} aria-hidden="true" />
            <Text slot="label" className={styles.label}>
              {label}
            </Text>
            {description && <p className={styles.description}>{description}</p>}
          </div>
        </Pressable>
      </FileTrigger>
    </RACDropZone>
  );
}
