import { useState, useMemo, useCallback } from 'react';
import { Publisher, CategoryType, PlatformType, FairEngineWeights, SupporterAction } from '../types';
import { useFairEngine } from './useFairEngine';

interface UseCorePlatformLogicProps {
  publishers: Publisher[];
  setPublishers: React.Dispatch<React.SetStateAction<Publisher[]>>;
  weights: FairEngineWeights;
  onRecordAction: (action: SupporterAction) => void;
}

export function useCorePlatformLogic({
  publishers,
  setPublishers,
  weights,
  onRecordAction,
}: UseCorePlatformLogicProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'FAIR' | 'VISITS_ASC' | 'VISITS_DESC' | 'NEWEST' | 'VERIFICATION'>('FAIR');
  const [activeOutboundPublisher, setActiveOutboundPublisher] = useState<Publisher | null>(null);
  const [selectedFairHistoryPublisher, setSelectedFairHistoryPublisher] = useState<Publisher | null>(null);

  const { calculateScore } = useFairEngine(publishers, weights);

  const processedPublishers = useMemo(() => {
    let list = publishers.map((p) => ({
      ...p,
      fairScore: calculateScore(p),
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

    if (selectedPlatform !== 'ALL') {
      list = list.filter((p) => p.platform === selectedPlatform);
    }

    if (sortBy === 'FAIR') {
      list.sort((a, b) => (b.fairScore || 0) - (a.fairScore || 0));
    } else if (sortBy === 'VISITS_ASC') {
      list.sort((a, b) => a.totalVisitsFromPlatform - b.totalVisitsFromPlatform);
    } else if (sortBy === 'VISITS_DESC') {
      list.sort((a, b) => b.totalVisitsFromPlatform - a.totalVisitsFromPlatform);
    } else if (sortBy === 'NEWEST') {
      list.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime());
    } else if (sortBy === 'VERIFICATION') {
      const tierRank = { PLATINUM: 3, GOLD: 2, BASIC: 1 };
      list.sort((a, b) => tierRank[b.verificationLevel] - tierRank[a.verificationLevel]);
    }

    return list;
  }, [publishers, searchQuery, selectedCategory, selectedPlatform, sortBy, calculateScore]);

  const handleConfirmOutbound = useCallback(() => {
    if (!activeOutboundPublisher) return;

    const updatedPublisher = {
      ...activeOutboundPublisher,
      totalVisitsFromPlatform: activeOutboundPublisher.totalVisitsFromPlatform + 1,
      lastImpressionTime: new Date().toISOString(),
    };

    setPublishers((prev) =>
      prev.map((p) => (p.id === activeOutboundPublisher.id ? updatedPublisher : p))
    );

    onRecordAction({
      id: `act-${Date.now()}`,
      publisherId: activeOutboundPublisher.id,
      publisherName: activeOutboundPublisher.name,
      platform: activeOutboundPublisher.platform,
      timestamp: new Date().toISOString(),
    });

    window.open(activeOutboundPublisher.externalUrl, '_blank', 'noopener,noreferrer');
    setActiveOutboundPublisher(null);
  }, [activeOutboundPublisher, setPublishers, onRecordAction]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPlatform,
    setSelectedPlatform,
    sortBy,
    setSortBy,
    activeOutboundPublisher,
    setActiveOutboundPublisher,
    selectedFairHistoryPublisher,
    setSelectedFairHistoryPublisher,
    processedPublishers,
    handleConfirmOutbound,
  };
}
