import React, { createContext, useState, useContext, useEffect } from 'react';
import { Truck } from '@/models/TruckTypes';
import { toast } from '@/components/ui/use-toast';

interface CompareContextType {
  compareItems: Truck[];
  addToCompare: (truck: Truck) => void;
  removeFromCompare: (truckId: string) => void;
  clearCompare: () => void;
  isInCompare: (truckId: string) => boolean;
  generateCompareUrl: () => string;
  loadTrucksFromUrl: (trucks: Truck[]) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE_ITEMS = 3;
const STORAGE_KEY = 'xetaiviet_compare_items';

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<Truck[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedItems = localStorage.getItem(STORAGE_KEY);
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        setCompareItems(parsedItems);
        console.log('Loaded compare items from localStorage:', parsedItems);
      } catch (error) {
        console.error('Error parsing stored compare items', error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(compareItems));
    console.log('Saved compare items to localStorage:', compareItems);
  }, [compareItems, isLoaded]);

  const addToCompare = (truck: Truck) => {
    console.log('addToCompare called with:', truck);

    if (compareItems.length >= MAX_COMPARE_ITEMS) {
      toast({
        title: "Đã đạt giới hạn so sánh",
        description: `Bạn chỉ có thể so sánh tối đa ${MAX_COMPARE_ITEMS} xe cùng lúc.`,
        variant: "destructive"
      });
      return;
    }

    if (compareItems.some(item => item.id === truck.id)) {
      toast({
        title: "Xe đã có trong danh sách",
        description: "Xe này đã được thêm vào danh sách so sánh.",
        variant: "destructive"
      });
      return;
    }

    setCompareItems(prev => {
      const newItems = [...prev, truck];
      console.log('New compare items:', newItems);
      return newItems;
    });
    toast({
      title: "Đã thêm vào so sánh",
      description: `${truck.name} đã được thêm vào danh sách so sánh.`,
    });
  };

  const removeFromCompare = (truckId: string) => {
    setCompareItems(prev => prev.filter(item => item.id !== truckId));
    toast({
      title: "Đã xóa khỏi danh sách",
      description: "Xe đã được xóa khỏi danh sách so sánh.",
    });
  };

  const clearCompare = () => {
    setCompareItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isInCompare = (truckId: string) => {
    return compareItems.some(item => item.id === truckId);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentUrl = window.location.pathname + window.location.search;

    let newUrl = '/so-sanh-xe';
    if (compareItems.length > 0) {
      const ids = compareItems.map(item => item.id).join(',');
      newUrl = `/so-sanh-xe?ids=${encodeURIComponent(ids)}`;
    }

    if (currentUrl.startsWith('/so-sanh-xe') && currentUrl !== newUrl) {
      window.history.replaceState({}, '', newUrl);
    }
  }, [compareItems]);

  const generateCompareUrl = () => {
    if (compareItems.length === 0) {
      return '/so-sanh-xe';
    }
    const ids = compareItems.map(item => item.id).join(',');
    return `/so-sanh-xe?ids=${encodeURIComponent(ids)}`;
  };

  const loadTrucksFromUrl = (trucks: Truck[]) => {
    setCompareItems(trucks);
  };

  return (
    <CompareContext.Provider value={{
      compareItems,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      generateCompareUrl,
      loadTrucksFromUrl
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    return {
      compareItems: [],
      addToCompare: () => {},
      removeFromCompare: () => {},
      clearCompare: () => {},
      isInCompare: () => false,
      generateCompareUrl: () => '/so-sanh-xe',
      loadTrucksFromUrl: () => {}
    };
  }
  return context;
};
