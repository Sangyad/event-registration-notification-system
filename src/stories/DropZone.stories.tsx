import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DropZone } from "@/components/ui/DropZone/DropZone";

const meta: Meta<typeof DropZone> = {
  component: DropZone,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    acceptedFileTypes: { control: "object" },
    allowsMultiple: { control: "boolean" },
    acceptDirectory: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DropZone>;

export const Default: Story = {
  args: {
    onFileSelect: (files) => console.log("Selected:", files),
  },
};

export const WithDescription: Story = {
  args: {
    onFileSelect: (files) => console.log("Selected:", files),
    description: "Supported: PDF, DOC, XLS, images, TXT, CSV",
  },
};

export const CustomLabel: Story = {
  args: {
    onFileSelect: (files) => console.log("Selected:", files),
    label: "Drop your documents here",
    description: "Max file size: 10 MB",
  },
};

export const MultipleFiles: Story = {
  args: {
    onFileSelect: (files) => console.log("Selected:", files),
    allowsMultiple: true,
    description: "You can select multiple files",
  },
};

export const Disabled: Story = {
  args: {
    onFileSelect: (files) => console.log("Selected:", files),
    isDisabled: true,
    description: "File upload is currently disabled",
  },
};

export const PDFOnly: Story = {
  args: {
    onFileSelect: (files) => console.log("Selected:", files),
    acceptedFileTypes: [".pdf"],
    description: "Only PDF files are accepted",
  },
};
