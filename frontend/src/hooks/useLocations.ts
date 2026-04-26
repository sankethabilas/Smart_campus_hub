import { useState, useEffect } from 'react';
import { assetService } from '../services/assetService';

let cachedLocations: Record<number, string> | null = null;
let fetchPromise: Promise<void> | null = null;

export const useLocations = () => {
  const [locations, setLocations] = useState<Record<number, string>>(cachedLocations || {});

  useEffect(() => {
    if (cachedLocations) {
      setLocations(cachedLocations);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = assetService.fetchLocations().then((locs) => {
        const map: Record<number, string> = {};
        locs.forEach(l => { map[l.id] = l.name; });
        cachedLocations = map;
        setLocations(map);
      }).catch(err => {
        console.error('Failed to fetch locations', err);
        fetchPromise = null; 
      });
    } else {
      fetchPromise.then(() => {
        if (cachedLocations) {
          setLocations({ ...cachedLocations });
        }
      });
    }
  }, []);

  return locations;
};
