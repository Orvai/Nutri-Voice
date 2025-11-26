import React from 'react';
import { View, Pressable } from 'react-native';
import Input from '../../components/ui/Input';
import Spacer from '../../components/ui/Spacer';
import Chip from '../../components/ui/Chip';

export default function FilterBar({
  search,
  setSearch,
  showFlaggedOnly,
  setShowFlaggedOnly,
  filterActivity,
  setFilterActivity,
  filterDeviation,
  setFilterDeviation,
  filterWeight,
  setFilterWeight
}: any) {

  return (
    <View>

      {/* Search */}
      <Input
        placeholder="חפש בשם או מספר"
        value={search}
        onChangeText={setSearch}
      />

      <Spacer size={12} />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>

        {/* פעילות */}
        <Pressable onPress={() =>
          setFilterActivity(filterActivity ? null : "high")
        }>
          <Chip
            label="פעילות"
            tone={filterActivity ? "success" : "default"}
          />
        </Pressable>

        {/* חריגה */}
        <Pressable onPress={() =>
          setFilterDeviation(filterDeviation ? null : "low")
        }>
          <Chip
            label="חריגה"
            tone={filterDeviation ? "warning" : "default"}
          />
        </Pressable>

        {/* שינוי משקל */}
        <Pressable onPress={() =>
          setFilterWeight(filterWeight ? null : "up")
        }>
          <Chip
            label="משקל"
            tone={filterWeight ? "danger" : "default"}
          />
        </Pressable>

        {/* מסומנים בלבד */}
        <Pressable onPress={() =>
          setShowFlaggedOnly(!showFlaggedOnly)
        }>
          <Chip
            label={showFlaggedOnly ? "מסומנים ✔" : "מסומנים בלבד"}
            tone={showFlaggedOnly ? "warning" : "default"}
          />
        </Pressable>

      </View>

    </View>
  );
}
