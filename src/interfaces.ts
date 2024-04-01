type P = {
  disconnect?: () => void
}
export interface MainAction {
  name?: string;
  icon?: string;
  value?: number;
  class?: string;
  bind?: (p: P) => Promise<void> | void | undefined;
}
