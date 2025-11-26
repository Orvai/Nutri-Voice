import { ScrollView, ScrollViewProps } from 'react-native';

export default function ScrollArea(props: ScrollViewProps) {
  return <ScrollView showsVerticalScrollIndicator={false} {...props} />;
}