// FALLBACK — open positions are managed by admins at /admin/positions (Supabase table `positions`).
// This list is only used before Supabase is connected; leave it empty so no outdated vacancy is shown.

export type Position = {
  title: string;
  level: string;
  deadline: string;
  text: string;
  requirements: string[];
};

export const positions: Position[] = [];
