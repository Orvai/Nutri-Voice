import { View, Image } from 'react-native';
import { colors } from '../../styles/colors';
import Text from './Text';
import { useState } from 'react';
import { styles } from './styles/Avatar.styles';

interface AvatarProps {
  name: string;
  size?: number;
  image?: string | null;
}

export default function Avatar({ name, size = 40, image }: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  // תמונת fallback בטוחה
  const fallbackImage = `https://i.pravatar.cc/300?u=${encodeURIComponent(
    name || 'user'
  )}`;

  const [currentImage, setCurrentImage] = useState(image || fallbackImage);

  const isImageValid = currentImage && typeof currentImage === 'string';

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {isImageValid ? (
        <Image
          source={{ uri: currentImage }}
          style={[
            styles.image,
            {
              borderRadius: size / 2,
            },
          ]}
          onError={() => setCurrentImage(null)}
        />
      ) : (
        <View style={styles.fallback}>
          <Text weight="bold" color={colors.white}>
            {initials}
          </Text>
        </View>
      )}
    </View>
  );
}