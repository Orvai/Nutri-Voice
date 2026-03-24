import type { CommunityStateDto } from "@/types/community/community.dto";
import type { CommunityState } from "@/types/community/community.ui";
import { formatRelativeMinutes } from "@/utils/format";

export const mapCommunityStateToUI = (dto: CommunityStateDto): CommunityState => ({
  stories: dto.stories,
  posts: dto.posts.map((post) => ({
    id: post.id,
    authorName: post.authorName,
    avatarUrl: post.avatarUrl,
    isCoach: post.isCoach,
    text: post.text,
    createdAtLabel: formatRelativeMinutes(post.createdAtIso),
    likes: post.likes,
    comments: post.comments
  }))
});
