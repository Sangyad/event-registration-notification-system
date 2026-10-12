"use client";

import clsx from "clsx";
import {
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
  TabPanels as RACTabPanels,
  Tabs as RACTabs,
  type TabListProps,
  type TabPanelProps,
  type TabPanelsProps,
  type TabProps,
  type TabsProps,
} from "react-aria-components";

import styles from "./Tabs.module.css";

export function Tabs({ className, ...props }: TabsProps) {
  return <RACTabs className={clsx(styles.tabs, className)} {...props} />;
}

export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  return <RACTabList className={clsx(styles.tabList, className)} {...props} />;
}

export function Tab({ className, ...props }: TabProps) {
  return <RACTab className={clsx(styles.tab, className)} {...props} />;
}

export function TabPanels<T extends object>({ className, ...props }: TabPanelsProps<T>) {
  return <RACTabPanels className={clsx(styles.tabPanels, className)} {...props} />;
}

export function TabPanel({ className, ...props }: TabPanelProps) {
  return <RACTabPanel className={clsx(styles.tabPanel, className)} {...props} />;
}
