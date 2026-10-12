import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/ui/Button/Button";
import { Form, Label } from "@/components/ui/Form/Form";
import { Select, SelectItem } from "@/components/ui/Select/Select";
import { TextField } from "@/components/ui/TextField/TextField";

const meta: Meta<typeof Form> = {
  component: Form,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
  render: () => (
    <Form>
      <TextField label="Name" name="name" isRequired placeholder="Enter your full name" />
      <TextField
        label="Email"
        name="email"
        type="email"
        isRequired
        placeholder="Enter your email"
      />
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit">Submit</Button>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
      </div>
    </Form>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Form>
      <TextField
        label="Name"
        name="name"
        isRequired
        placeholder="Enter your full name"
        description="Your legal full name."
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        isRequired
        placeholder="you@example.com"
        description="We'll never share your email."
      />
      <Button type="submit">Submit</Button>
    </Form>
  ),
};

export const WithServerErrors: Story = {
  render: () => (
    <Form
      validationErrors={{
        username: "This username is not available.",
      }}
    >
      <TextField
        label="Username"
        name="username"
        isRequired
        placeholder="Choose a username"
        defaultValue="admin"
      />
      <TextField label="Email" name="email" type="email" isRequired placeholder="you@example.com" />
      <Button type="submit">Submit</Button>
    </Form>
  ),
};

export const WithLabelAndSelect: Story = {
  render: () => (
    <Form>
      <TextField label="Name" name="name" isRequired placeholder="Enter your full name" />
      <div>
        <Label>Case Type</Label>
        <Select name="caseType" isRequired>
          <SelectItem id="civil">Civil</SelectItem>
          <SelectItem id="criminal">Criminal</SelectItem>
          <SelectItem id="family">Family</SelectItem>
        </Select>
      </div>
      <Button type="submit">Submit</Button>
    </Form>
  ),
};

export const SubmitAction: Story = {
  render: () => (
    <Form
      action={(formData) => {
        console.log("submit", Object.fromEntries(formData));
      }}
    >
      <TextField label="Name" name="name" isRequired placeholder="Enter your full name" />
      <TextField label="Email" name="email" type="email" isRequired placeholder="you@example.com" />
      <Button type="submit">Submit</Button>
    </Form>
  ),
};
