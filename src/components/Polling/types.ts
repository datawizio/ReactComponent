export interface PollingProps {
  questions: PollingQuestion[];
  onSubmit: (payload: PollingPayload) => void;
  onPollingHide?: () => void;
  onPollingShow?: () => void;
  cancelGenerateId?: boolean;
}

export interface StepProps {
  step: PollingStep;
  onSubmit: (value?: number | string | null, polled?: boolean) => void;
}

export interface PollingQuestion {
  question_key: string;
  polling_template: number;
  feedback_type: string;
}

export interface PollingStep extends PollingQuestion {
  id: string;
  mark?: number | null;
  comment?: string;
}

export interface PollingPayload {
  polling_template: number;
  polled: boolean;
  mark?: number | null;
  comment?: string;
}
