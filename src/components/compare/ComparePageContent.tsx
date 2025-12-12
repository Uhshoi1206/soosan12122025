import React from 'react';
import { useCompare } from '@/contexts/CompareContextAstro';
import CompareTable from './CompareTable';
import CompareEmptyState from './CompareEmptyState';

const ComparePageContent: React.FC = () => {
  const { compareItems } = useCompare();

  return (
    <div>
      {compareItems.length > 0 ? (
        <CompareTable trucks={compareItems} />
      ) : (
        <CompareEmptyState />
      )}
    </div>
  );
};

export default ComparePageContent;
