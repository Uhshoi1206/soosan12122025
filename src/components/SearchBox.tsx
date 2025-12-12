import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchBoxProps {
  onClose?: () => void;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onClose,
  placeholder = "Tìm kiếm xe tải, mooc, đầu kéo..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();

    if (trimmedTerm) {
      window.location.href = `/search?q=${encodeURIComponent(trimmedTerm)}`;
      if (onClose) onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pr-8"
            autoFocus
          />
          <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={!searchTerm.trim()}
        >
          Tìm
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Nhấn Enter hoặc click "Tìm" để xem kết quả
      </p>
    </form>
  );
};

export default SearchBox;
