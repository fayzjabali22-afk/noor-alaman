import { useState, useMemo } from 'react';
import { Publisher, CategoryType, PlatformType } from '../types';

interface UseSupporterFiltersOptions {
  publishers: Publisher[];
  calculateScore: (p: Publisher) => number;
  calculateTrust: (p: Publisher) => number;
}

export function useSupporterFilters({
  publishers,
  calculateScore,
  calculateTrust,
}: UseSupporterFiltersOptions) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'ALL'>('ALL');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'FAIR' | 'VISITS_ASC' | 'VERIFICATION'>('FAIR');
  const [showDormantChannels, setShowDormantChannels] = useState(false);

  const dormantCount = useMemo(
    () => publishers.filter((p) => p.status === 'DORMANT_CHANNEL').length,
    [publishers]
  );

  const processedPublishers = useMemo(() => {
    let list = publishers.map((p) => ({
      ...p,
      fairScore: calculateScore(p),
      calculatedTrust: calculateTrust(p),
    }));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'ALL') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedRegion !== 'ALL') {
      list = list.filter((p) => p.location.includes(selectedRegion));
    }

    if (selectedPlatform !== 'ALL') {
      list = list.filter((p) => p.platform === selectedPlatform);
    }

    if (selectedStage !== 'ALL') {
      list = list.filter((p) => p.lifecycleStage === selectedStage);
    }

    if (!showDormantChannels && !searchQuery.trim()) {
      list = list.filter((p) => p.status !== 'DORMANT_CHANNEL');
    }

    if (sortBy === 'FAIR') {
      list.sort((a, b) => (b.fairScore || 0) - (a.fairScore || 0));
    } else if (sortBy === 'VISITS_ASC') {
      list.sort((a, b) => a.totalVisitsFromPlatform - b.totalVisitsFromPlatform);
    } else if (sortBy === 'VERIFICATION') {
      const tierRank: Record<string, number> = { PLATINUM: 3, GOLD: 2, BASIC: 1 };
      list.sort((a, b) => (tierRank[b.verificationLevel] || 0) - (tierRank[a.verificationLevel] || 0));
    }

    return list;
  }, [
    publishers,
    searchQuery,
    selectedCategory,
    selectedRegion,
    selectedPlatform,
    selectedStage,
    showDormantChannels,
    sortBy,
    calculateScore,
    calculateTrust,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedRegion('ALL');
    setSelectedPlatform('ALL');
    setSelectedStage('ALL');
    setSortBy('FAIR');
    setShowDormantChannels(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedRegion,
    setSelectedRegion,
    selectedPlatform,
    setSelectedPlatform,
    selectedStage,
    setSelectedStage,
    sortBy,
    setSortBy,
    showDormantChannels,
    setShowDormantChannels,
    dormantCount,
    processedPublishers,
    resetFilters,
  };
}
