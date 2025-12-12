
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useCompare } from '@/contexts/CompareContextAstro';
import { GitCompare } from 'lucide-react';

interface CompareBadgeProps {
  className?: string;
}

const CompareBadge: React.FC<CompareBadgeProps> = ({ className = "" }) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const { compareItems } = useCompare();
  const count = isClient ? compareItems.length : 0;

  if (!isClient || count === 0) {
    return null;
  }

  return (
    <Badge variant="destructive" className={`min-w-5 h-5 flex items-center justify-center p-0 text-xs ${className}`}>
      {count}
    </Badge>
  );
};

export default CompareBadge;
