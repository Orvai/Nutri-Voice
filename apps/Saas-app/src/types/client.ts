export type ClientInfo = {
  age?: number | null;
  gender?: string | null;
  height?: number | null;
  city?: string | null;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  avatar?: string | null;
  email?: string;
  info?: ClientInfo | null;
};
