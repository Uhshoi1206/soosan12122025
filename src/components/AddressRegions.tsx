
import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import type { Branch } from '@/types/siteSettings';

interface AddressRegionsProps {
  regions: Branch[];
}

const AddressRegions: React.FC<AddressRegionsProps> = ({ regions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {regions.map((region, index) => (
        <div key={index} className="space-y-3">
          <h3 className="font-heading text-lg font-bold text-primary-100 mb-3">{region.regionName}</h3>
          <div className="space-y-4">
            {region.addresses.map((address, addressIndex) => (
              <div key={addressIndex} className="pb-3 border-b border-gray-800">
                <h4 className="font-medium text-white mb-1">{address.province}</h4>
                <div className="flex items-start space-x-2 mb-1">
                  <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  {address.mapUrl ? (
                    <a
                      href={address.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 text-sm hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {address.address}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-gray-300 text-sm">{address.address}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressRegions;
