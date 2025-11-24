import React, { ReactNode } from 'react';

export enum ShellMode {
  BASH = 'BASH',
  POWERSHELL = 'POWERSHELL'
}

export enum ThemeMode {
  DARK = 'DARK',
  LIGHT = 'LIGHT'
}

export interface SectionData {
  id: string;
  bashCmd: string;
  psCmd: string;
  bashPath: string;
  psPath: string;
  title: string;
  content: ReactNode;
}