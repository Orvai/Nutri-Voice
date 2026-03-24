export const communityKeys = {
  root: () => ["community"] as const,
  stories: () => [...communityKeys.root(), "stories"] as const,
  feed: () => [...communityKeys.root(), "feed"] as const
};
