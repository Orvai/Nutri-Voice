import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Story } from "@/types/community/community.ui";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type StoriesStripProps = {
  stories: Story[];
};

export function StoriesStrip({ stories }: StoriesStripProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>סטוריז</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {stories.map((story) => (
          <View key={story.id} style={styles.story}>
            <Image
              source={{ uri: story.avatarUrl }}
              style={[styles.avatar, story.isCoach ? styles.coachAvatar : null]}
            />
            <Text style={styles.name}>{story.authorName}</Text>
            <Text style={styles.headline} numberOfLines={1}>
              {story.headline}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right"
  },
  list: {
    flexDirection: "row-reverse",
    gap: spacing.sm,
    paddingHorizontal: spacing.xs
  },
  story: {
    width: 92,
    alignItems: "center",
    gap: 4
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border
  },
  coachAvatar: {
    borderColor: colors.neon,
    borderWidth: 2
  },
  name: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700"
  },
  headline: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: "center"
  }
});
