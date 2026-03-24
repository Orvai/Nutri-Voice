export type StoryDto = {
  id: string;
  authorName: string;
  avatarUrl: string;
  isCoach: boolean;
  headline: string;
  seen: boolean;
};

export type FeedPostDto = {
  id: string;
  authorName: string;
  avatarUrl: string;
  isCoach: boolean;
  text: string;
  createdAtIso: string;
  likes: number;
  comments: number;
};

export type CommunityStateDto = {
  stories: StoryDto[];
  posts: FeedPostDto[];
};
