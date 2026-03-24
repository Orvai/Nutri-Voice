export type Story = {
  id: string;
  authorName: string;
  avatarUrl: string;
  isCoach: boolean;
  headline: string;
  seen: boolean;
};

export type CommunityPost = {
  id: string;
  authorName: string;
  avatarUrl: string;
  isCoach: boolean;
  text: string;
  createdAtLabel: string;
  likes: number;
  comments: number;
};

export type CommunityState = {
  stories: Story[];
  posts: CommunityPost[];
};
