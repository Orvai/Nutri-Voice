import { getMockState, updateMockState } from "@/data/mocks/mockStore";
import { mockRequest } from "@/data/mocks/mockRequest";
import type { CommunityStateDto, FeedPostDto } from "@/types/community/community.dto";
import { generateId } from "@/utils/format";

export async function getCommunityState(): Promise<CommunityStateDto> {
  return mockRequest("community", () => getMockState().community);
}

export async function createCommunityPost(text: string): Promise<FeedPostDto> {
  return mockRequest("community", () => {
    const trimmed = text.trim();
    if (!trimmed) {
      throw new Error("הפוסט לא יכול להיות ריק");
    }

    const state = getMockState();
    const user = state.auth.users[0];

    const post: FeedPostDto = {
      id: generateId("post"),
      authorName: user.firstName,
      avatarUrl: user.avatarUrl ?? "",
      isCoach: false,
      text: trimmed,
      createdAtIso: new Date().toISOString(),
      likes: 0,
      comments: 0
    };

    updateMockState((draft) => {
      draft.community.posts.unshift(post);
    });

    return post;
  });
}
