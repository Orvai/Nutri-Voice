import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import ScrollArea from '../../src/components/ui/ScrollArea';
import Spacer from '../../src/components/ui/Spacer';
import ClientCard from '../../src/components/clients/ClientCard';
import FilterBar from '../../src/components/clients/FilterBar';

// Mock Data
const CLIENTS = [
  {
    id: '1',
    fullName: 'דניאל כהן',
    phone: '050-1234567',
    activityScore: 85,
    dietDeviationKcal: 120,
    weeklyWeightChangeKg: -0.7,
    isFlagged: false,
  },
  {
    id: '2',
    fullName: 'שירה לוי',
    phone: '052-9876543',
    activityScore: 40,
    dietDeviationKcal: 550,
    weeklyWeightChangeKg: 0.9,
    isFlagged: true,
  },
  {
    id: '3',
    fullName: 'אופק ישראלי',
    phone: '054-1122334',
    activityScore: 65,
    dietDeviationKcal: 320,
    weeklyWeightChangeKg: 0,
    isFlagged: false,
  },
];

export default function ClientsScreen() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [filterActivity, setFilterActivity] = useState(null);
  const [filterDeviation, setFilterDeviation] = useState(null);
  const [filterWeight, setFilterWeight] = useState(null);

  const filtered = useMemo(() => {
    return CLIENTS.filter(client => {

      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !client.fullName.toLowerCase().includes(q) &&
          !client.phone.includes(q)
        ) return false;
      }

      // Flagged
      if (showFlaggedOnly && !client.isFlagged) return false;

      // Activity filter
      if (filterActivity) {
        if (filterActivity === "high" && client.activityScore < 70) return false;
      }

      // Deviation filter
      if (filterDeviation) {
        if (filterDeviation === "low" && client.dietDeviationKcal > 200) return false;
      }

      // Weight filter
      if (filterWeight) {
        if (filterWeight === "up" && client.weeklyWeightChangeKg <= 0) return false;
      }

      return true;
    });
  }, [search, showFlaggedOnly, filterActivity, filterDeviation, filterWeight]);


  return (
    <ScrollArea style={{ padding: 16 }}>
      
      <FilterBar
        search={search}
        setSearch={setSearch}
        showFlaggedOnly={showFlaggedOnly}
        setShowFlaggedOnly={setShowFlaggedOnly}
        filterActivity={filterActivity}
        setFilterActivity={setFilterActivity}
        filterDeviation={filterDeviation}
        setFilterDeviation={setFilterDeviation}
        filterWeight={filterWeight}
        setFilterWeight={setFilterWeight}
      />

      <Spacer size={16} />

      {filtered.map(client => (
        <View key={client.id} style={{ marginBottom: 16 }}>
          <ClientCard
            {...client}
            onPress={() =>
              router.push({
                pathname: '/(clients)/[id]',
                params: { id: String(client.id) },
              })
            }
          />
        </View>
      ))}

      <Spacer size={60} />

    </ScrollArea>
  );
}
