import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FileTrigger } from "@/components/ui/FileTrigger/FileTrigger";

const meta: Meta<typeof FileTrigger> = {
  component: FileTrigger,
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
type Story = StoryObj<typeof FileTrigger>;

export const Default: Story = {
  args: {
    onFileSelect: (files) => console.log("Selected:", files),
  },
};

export const WithDescription: Story = {
  args: {
    onFileSelect: (files) => console.log("Selected:", files),
    description: "Accepted: PDF, DOC, images",
  },
};

export const CustomLabel: Story = {
  args: {
    onFileSelect: (files) => console.log("Selected:", files),
    label: "Choose files to upload",
    description: "Max 10 MB per file",
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
