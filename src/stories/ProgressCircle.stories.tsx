import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";

const meta: Meta<typeof ProgressCircle> = {
  component: ProgressCircle,
  tags: ["autodocs"],
  argTypes: {
    "aria-label": { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof ProgressCircle>;

export const Default: Story = {};

export const Labeled: Story = {
  args: {
    "aria-label": "Loading...",
  },
};
