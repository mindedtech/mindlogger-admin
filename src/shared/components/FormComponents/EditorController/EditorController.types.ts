import { ChangeEvent } from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';

export type EditorProps = {
  customChange?: (value?: string, event?: ChangeEvent<HTMLTextAreaElement>) => void;
  preview?: 'live' | 'edit' | 'preview';
  hasRequiredState?: boolean;
  requiredStateMessage?: string;
};

export type EditorControllerProps<T extends FieldValues> = EditorProps & UseControllerProps<T>;
