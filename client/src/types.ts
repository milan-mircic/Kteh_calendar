export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  purpose: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startAt: string;
  endAt: string;
  userId: string;
  createdAt: string;
}
