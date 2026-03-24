import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusView } from "@/components/ui/StatusView";
import { NeonButton } from "@/components/ui/NeonButton";
import { StoriesStrip } from "@/components/community/StoriesStrip";
import { FeedPostCard } from "@/components/community/FeedPostCard";
import { PostComposer } from "@/components/community/PostComposer";
import { CoachHelpFallback } from "@/components/shared/CoachHelpFallback";
import { useCommunityFeed } from "@/hooks/community/useCommunityFeed";
import { useCreateCommunityPost } from "@/hooks/community/useCreateCommunityPost";
import { colors } from "@/constants/colors";

export default function CommunityScreen() {
  const [composerOpen, setComposerOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useCommunityFeed();
  const { createPost, isCreating, error } = useCreateCommunityPost();

  if (isLoading) {
    return (
      <Screen>
        <StatusView type="loading" title="טוען קהילה" />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <CoachHelpFallback onRetry={() => void refetch()} />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen>
        <StatusView
          type="empty"
          title="עדיין אין פעילות קהילתית"
          message="אפשר לפרסם עדכון קצר ראשון"
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="קהילה" />

      <StoriesStrip stories={data.stories} />

      <NeonButton label="פרסם עדכון" onPress={() => setComposerOpen(true)} variant="secondary" />

      <SectionHeader title="פיד" />

      {data.posts.length === 0 ? (
        <StatusView
          type="empty"
          title="אין פוסטים כרגע"
          message="הקהילה קלה וממוקדת. אפשר לשתף עדכון קצר."
        />
      ) : (
        data.posts.map((post) => <FeedPostCard key={post.id} post={post} />)
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PostComposer
        visible={composerOpen}
        onClose={() => setComposerOpen(false)}
        loading={isCreating}
        error={error}
        onSubmit={async (text) => {
          await createPost(text);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    textAlign: "right",
    fontSize: 13
  }
});
