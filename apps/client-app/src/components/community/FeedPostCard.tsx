import { Image, StyleSheet, Text, View } from "react-native";
import type { CommunityPost } from "@/types/community/community.ui";
import { NeonCard } from "@/components/ui/NeonCard";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type FeedPostCardProps = {
  post: CommunityPost;
};

export function FeedPostCard({ post }: FeedPostCardProps) {
  return (
    <NeonCard>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.copy}>
            <Text style={styles.author}>{post.authorName}</Text>
            <Text style={styles.time}>{post.createdAtLabel}</Text>
          </View>
          <Image source={{ uri: post.avatarUrl }} style={styles.avatar} />
        </View>

        <Text style={styles.text}>{post.text}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>{post.comments} תגובות</Text>
          <Text style={styles.metaText}>{post.likes} לייקים</Text>
        </View>
      </View>
    </NeonCard>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between"
  },
  copy: {
    alignItems: "flex-end",
    gap: 2
  },
  author: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700"
  },
  time: {
    color: colors.textMuted,
    fontSize: 11
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border
  },
  text: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "right",
    lineHeight: 21
  },
  meta: {
    flexDirection: "row-reverse",
    justifyContent: "space-between"
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 12
  }
});
