"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DialogTrigger } from "react-aria-components";

import { Button } from "@/components/ui/Button/Button";
import { Popover } from "@/components/ui/Popover/Popover";

function PopoverWithTrigger({
  placement,
  children,
}: {
  placement?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "8rem" }}>
      <DialogTrigger>
        <Button>Open Popover</Button>
        <Popover placement={placement}>{children}</Popover>
      </DialogTrigger>
    </div>
  );
}

const meta: Meta<typeof PopoverWithTrigger> = {
  component: PopoverWithTrigger,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PopoverWithTrigger>;

export const Default: Story = {
  args: {
    children: "Popover content goes here.",
  },
};

export const WithList: Story = {
  args: {
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "160px" }}>
        <button type="button">Edit</button>
        <button type="button">Duplicate</button>
        <button type="button">Archive</button>
        <button type="button">Delete</button>
      </div>
    ),
  },
};

export const PlacementTop: Story = {
  args: {
    placement: "top",
    children: "Placed above the trigger.",
  },
};
