import type { Item, Claim, LocationStat } from '../data/mockData';
import { initialItems, initialLocations } from '../data/mockData';

const API_BASE_URL = 'http://localhost:5000/api';

// Local storage fallback helpers
const getStoredItems = (): Item[] => {
  const data = localStorage.getItem('retrace_items');
  if (data) {
    try { return JSON.parse(data); } catch { return initialItems; }
  }
  localStorage.setItem('retrace_items', JSON.stringify(initialItems));
  return initialItems;
};

const saveStoredItems = (items: Item[]) => {
  localStorage.setItem('retrace_items', JSON.stringify(items));
};

const getStoredClaims = (): Claim[] => {
  const data = localStorage.getItem('retrace_claims');
  if (data) {
    try { return JSON.parse(data); } catch { return []; }
  }
  const defaultClaims: Claim[] = [
    {
      id: 'claim-101',
      itemId: 'item-102',
      userId: 'u1',
      userBeliefReason: 'The Swissgear backpack matched all my lost item details exactly and has my turtle keychain.',
      uniqueFeatureAnswer: 'Blue turtle keychain with minor zipper scratch',
      lastSeenLocationAnswer: 'Left on chair in CSE Block Lab 4',
      status: 'pending',
      createdAt: new Date().toISOString(),
      itemName: 'Black College Backpack',
      itemCategory: 'Bags',
      itemLocation: 'CSE Block',
      itemImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
      userName: 'Alex Vance',
      userEmail: 'student@campus.edu'
    }
  ];
  localStorage.setItem('retrace_claims', JSON.stringify(defaultClaims));
  return defaultClaims;
};

// Transparency Transparent Match Algorithm for Client Fallback
export function calculateLocalMatchScore(lostItem: Partial<Item>, journeyPoints: any[], foundItem: Item) {
  let categoryScore = 0;
  let locationScore = 0;
  let dateScore = 0;
  let timeScore = 0;
  let descriptionScore = 0;

  // 1. Category Match (25 pts)
  if (lostItem.category && foundItem.category &&
      lostItem.category.toLowerCase() === foundItem.category.toLowerCase()) {
    categoryScore = 25;
  } else if (lostItem.category && foundItem.category &&
            (lostItem.category.toLowerCase().includes(foundItem.category.toLowerCase()) ||
             foundItem.category.toLowerCase().includes(lostItem.category.toLowerCase()))) {
    categoryScore = 15;
  }

  // 2. Location Match (30 pts)
  const journeyLocs = (journeyPoints || []).map(p => p.location.toLowerCase());
  const foundLoc = (foundItem.location || '').toLowerCase();
  const lostLoc = (lostItem.location || '').toLowerCase();

  if (foundLoc && journeyLocs.includes(foundLoc)) {
    locationScore = 30;
  } else if (foundLoc && lostLoc && foundLoc === lostLoc) {
    locationScore = 30;
  } else if (foundLoc && journeyLocs.some(l => l.includes(foundLoc) || foundLoc.includes(l))) {
    locationScore = 20;
  }

  // 3. Date Match (15 pts)
  if (lostItem.date && foundItem.date) {
    if (lostItem.date === foundItem.date) {
      dateScore = 15;
    } else {
      const d1 = new Date(lostItem.date).getTime();
      const d2 = new Date(foundItem.date).getTime();
      const diffDays = Math.abs((d1 - d2) / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) dateScore = 10;
      else if (diffDays <= 3) dateScore = 5;
    }
  }

  // 4. Time Match (15 pts)
  if (lostItem.time && foundItem.time) {
    if (lostItem.time.toLowerCase() === foundItem.time.toLowerCase()) timeScore = 15;
    else timeScore = 10;
  } else {
    timeScore = 8;
  }

  // 5. Description Match (15 pts)
  const lostText = `${lostItem.name || ''} ${lostItem.color || ''} ${lostItem.brand || ''} ${lostItem.description || ''} ${lostItem.uniqueFeatures || ''}`.toLowerCase();
  const foundText = `${foundItem.name || ''} ${foundItem.color || ''} ${foundItem.brand || ''} ${foundItem.description || ''} ${foundItem.uniqueFeatures || ''}`.toLowerCase();
  
  const tokens = lostText.split(/\W+/).filter(w => w.length > 2);
  let matchesCount = 0;
  tokens.forEach(t => { if (foundText.includes(t)) matchesCount++; });

  if (tokens.length > 0) {
    const ratio = matchesCount / tokens.length;
    if (ratio >= 0.5) descriptionScore = 15;
    else if (ratio >= 0.25) descriptionScore = 10;
    else if (matchesCount >= 1) descriptionScore = 5;
  }

  const score = categoryScore + locationScore + dateScore + timeScore + descriptionScore;
  return {
    score,
    metrics: { categoryScore, locationScore, dateScore, timeScore, descriptionScore }
  };
}

export const api = {
  async getItems(params?: { type?: string; category?: string; location?: string; date?: string; query?: string }) {
    try {
      const queryParams = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE_URL}/items?${queryParams}`);
      if (res.ok) {
        const json = await res.json();
        return json.data as Item[];
      }
    } catch {
      console.warn('Backend API unavailable, using local state');
    }

    let items = getStoredItems();
    if (params) {
      if (params.type && params.type !== 'all') {
        items = items.filter(i => i.type === params.type);
      }
      if (params.category && params.category !== 'all') {
        items = items.filter(i => i.category === params.category);
      }
      if (params.location && params.location !== 'all') {
        items = items.filter(i => i.location === params.location);
      }
      if (params.query) {
        const q = params.query.toLowerCase();
        items = items.filter(i =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          (i.brand && i.brand.toLowerCase().includes(q))
        );
      }
    }
    return items;
  },

  async getItemById(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/items/${id}`);
      if (res.ok) {
        const json = await res.json();
        return json.data as Item;
      }
    } catch {}
    const items = getStoredItems();
    return items.find(i => i.id === id || i.reportId === id) || items[0];
  },

  async reportLost(itemData: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/items/lost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch {}

    const items = getStoredItems();
    const reportId = `RET-L-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newItem: Item = {
      id: `item-${Date.now()}`,
      reportId,
      userId: 'u1',
      type: 'lost',
      name: itemData.name,
      category: itemData.category,
      brand: itemData.brand || '',
      color: itemData.color || '',
      description: itemData.description || '',
      uniqueFeatures: itemData.uniqueFeatures || '',
      date: itemData.date,
      time: itemData.time || '',
      location: itemData.location,
      status: 'active',
      image: itemData.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
      contactName: itemData.contactName || 'Alex Vance',
      contactEmail: itemData.contactEmail || 'student@campus.edu',
      contactPhone: itemData.contactPhone || '',
      createdAt: new Date().toISOString()
    };
    saveStoredItems([newItem, ...items]);
    return { success: true, message: 'Lost item reported', data: newItem };
  },

  async reportFound(itemData: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/items/found`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch {}

    const items = getStoredItems();
    const reportId = `RET-F-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newItem: Item = {
      id: `item-${Date.now()}`,
      reportId,
      userId: 'u2',
      type: 'found',
      name: itemData.name,
      category: itemData.category,
      brand: itemData.brand || '',
      color: itemData.color || '',
      description: itemData.description || '',
      date: itemData.date,
      time: itemData.time || '',
      location: itemData.location,
      storageLocation: itemData.storageLocation || 'Security Office',
      status: 'active',
      image: itemData.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
      contactName: itemData.finderName || 'Campus Staff',
      contactEmail: itemData.contactInformation || 'security@campus.edu',
      createdAt: new Date().toISOString()
    };
    saveStoredItems([newItem, ...items]);
    return { success: true, message: 'Found item reported', data: newItem };
  },

  async analyzeRetrace(lostItem: Partial<Item>, journeyPoints: any[]) {
    try {
      const res = await fetch(`${API_BASE_URL}/retrace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lostItem, journeyPoints })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}

    // Fallback analyze
    const lossZones = journeyPoints.map((point, index) => {
      const seqFactor = 0.5 + ((index + 1) / Math.max(journeyPoints.length, 1)) * 0.5;
      let conf = Math.round((seqFactor * (0.6 + Math.random() * 0.3)) * 100);
      const locLower = point.location.toLowerCase();
      if (locLower.includes('cse block')) conf = 91;
      else if (locLower.includes('library')) conf = 74;
      else if (locLower.includes('canteen')) conf = 52;
      else if (locLower.includes('sports')) conf = 24;

      return {
        location: point.location,
        confidence: Math.min(conf, 98),
        arrivalTime: point.arrivalTime,
        departureTime: point.departureTime,
        notes: point.notes
      };
    }).sort((a, b) => b.confidence - a.confidence);

    const items = getStoredItems().filter(i => i.type === 'found');
    const topMatches = items.map(found => {
      const { score, metrics } = calculateLocalMatchScore(lostItem, journeyPoints, found);
      return {
        foundItem: found,
        matchConfidence: score,
        metrics
      };
    }).filter(m => m.matchConfidence > 30).sort((a, b) => b.matchConfidence - a.matchConfidence);

    return {
      lossZones,
      topMatches,
      disclaimer: 'Match confidence is an indication based on available report data and does not guarantee where the item was lost.'
    };
  },

  async submitClaim(claimData: { itemId: string; userId?: string; userBeliefReason: string; uniqueFeatureAnswer: string; lastSeenLocationAnswer: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimData)
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch {}

    const claims = getStoredClaims();
    const items = getStoredItems();
    const item = items.find(i => i.id === claimData.itemId);

    const newClaim: Claim = {
      id: `claim-${Date.now()}`,
      itemId: claimData.itemId,
      userId: claimData.userId || 'u1',
      userBeliefReason: claimData.userBeliefReason,
      uniqueFeatureAnswer: claimData.uniqueFeatureAnswer,
      lastSeenLocationAnswer: claimData.lastSeenLocationAnswer,
      status: 'pending',
      createdAt: new Date().toISOString(),
      itemName: item?.name || 'Item Claim',
      itemCategory: item?.category || 'General',
      itemLocation: item?.location || 'Campus',
      itemImage: item?.image || '',
      userName: 'Alex Vance',
      userEmail: 'student@campus.edu'
    };

    localStorage.setItem('retrace_claims', JSON.stringify([newClaim, ...claims]));

    // Update item status in local storage
    const updatedItems = items.map(i => i.id === claimData.itemId ? { ...i, status: 'claimed' as const } : i);
    saveStoredItems(updatedItems);

    return { success: true, message: 'Claim submitted', data: newClaim };
  },

  async getClaims() {
    try {
      const res = await fetch(`${API_BASE_URL}/claims`);
      if (res.ok) {
        const json = await res.json();
        return json.data as Claim[];
      }
    } catch {}
    return getStoredClaims();
  },

  async updateClaimStatus(claimId: string, status: 'approved' | 'rejected') {
    try {
      const res = await fetch(`${API_BASE_URL}/claims/${claimId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch {}

    const claims = getStoredClaims().map(c => c.id === claimId ? { ...c, status } : c);
    localStorage.setItem('retrace_claims', JSON.stringify(claims));

    if (status === 'approved') {
      const claim = claims.find(c => c.id === claimId);
      if (claim) {
        const items = getStoredItems().map(i => i.id === claim.itemId ? { ...i, status: 'recovered' as const } : i);
        saveStoredItems(items);
      }
    }
    return { success: true, message: `Claim ${status}` };
  },

  async getLocations() {
    try {
      const res = await fetch(`${API_BASE_URL}/locations`);
      if (res.ok) {
        const json = await res.json();
        return json.data as LocationStat[];
      }
    } catch {}
    return initialLocations;
  },

  async getDashboard() {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}

    const items = getStoredItems();
    const claims = getStoredClaims();
    const total = items.length;
    const foundCount = items.filter(i => i.type === 'found').length;
    const lostCount = items.filter(i => i.type === 'lost').length;
    const recoveredCount = items.filter(i => i.status === 'recovered').length;
    const pendingClaimsCount = claims.filter(c => c.status === 'pending').length;

    return {
      stats: {
        totalReports: 1248 + total - 12,
        foundCount: 846 + foundCount - 6,
        recoveredCount: 672 + recoveredCount - 2,
        recoveryRate: 89,
        lostCount: 402 + lostCount - 6,
        pendingClaimsCount
      }
    };
  }
};
