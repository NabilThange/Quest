'use client';

import { useState } from 'react';
import { purchaseItem } from '@/app/actions/shop';
import type { ShopItem } from '@/types';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';

interface ShopGridProps {
  items: ShopItem[];
  ownedIds: Set<string>;
  currency: number;
}

export function ShopGrid({ items, ownedIds, currency }: ShopGridProps) {
  const [buying, setBuying] = useState<string | null>(null);
  const [localOwned, setLocalOwned] = useState<Set<string>>(ownedIds);
  const [localCurrency, setLocalCurrency] = useState(currency);

  async function handleBuy(item: ShopItem) {
    if (buying) return;
    if (localCurrency < item.cost) { toast.error('Not enough currency!'); return; }
    if (localOwned.has(item.id)) { toast.error('Already owned!'); return; }

    setBuying(item.id);
    // Optimistic update
    setLocalOwned((prev) => new Set([...prev, item.id]));
    setLocalCurrency((prev) => prev - item.cost);

    const result = await purchaseItem(item.id);
    if (result.error) {
      toast.error(result.error);
      // Revert
      setLocalOwned((prev) => { const s = new Set(prev); s.delete(item.id); return s; });
      setLocalCurrency((prev) => prev + item.cost);
    } else {
      toast.success(`${item.icon ?? '📦'} ${item.name} unlocked!`);
    }
    setBuying(null);
  }

  const typeLabels: Record<string, string> = { badge: 'Badges', theme: 'Themes', cosmetic: 'Cosmetics' };
  const grouped = items.reduce<Record<string, ShopItem[]>>((acc, item) => {
    (acc[item.type] = acc[item.type] ?? []).push(item);
    return acc;
  }, {});

  function renderItemIcon(item: ShopItem) {
    const assetMap: Record<string, string> = {
      'Cyber Warrior Badge': '/assets/items/sword.png',
      'Shadow Rogue Badge': '/assets/items/bow.png',
      'Arcane Scholar Badge': '/assets/items/blue_orb.png',
      'Iron Will Badge': '/assets/items/shield.png',
      'Gold Frame': '/assets/items/key.png',
      'Dragon Aura': '/assets/items/red_orb.png',
    };
    const src = (item.icon && item.icon.startsWith('/')) ? item.icon : assetMap[item.name];
    if (src) {
      return (
        <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-card border border-border p-2">
          <img
            src={src}
            alt=""
            className="max-h-full max-w-full pixel-art object-contain"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      );
    }
    return <div className="text-4xl">{item.icon ?? '📦'}</div>;
  }

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([type, groupItems]) => (
        <section key={type} aria-label={typeLabels[type] ?? type}>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">{typeLabels[type] ?? type}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {groupItems.map((item) => {
              const owned = localOwned.has(item.id);
              const canAfford = localCurrency >= item.cost;
              return (
                <div
                  key={item.id}
                  className={cn(
                    'card flex flex-col items-center text-center gap-3 transition-all',
                    owned && 'border-green-400/30 bg-green-400/5',
                    !owned && !canAfford && 'opacity-60'
                  )}
                >
                  {renderItemIcon(item)}
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    {item.description && <p className="text-xs text-text-muted mt-0.5">{item.description}</p>}
                  </div>
                  <div className="mt-auto w-full">
                    {owned ? (
                      <div className="flex items-center justify-center gap-1.5 text-green-400 text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Owned
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={buying === item.id || !canAfford}
                        className={cn(
                          'w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-medium transition-all',
                          canAfford
                            ? 'bg-brand-gold/10 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/20'
                            : 'bg-bg-elevated border border-border text-text-muted cursor-not-allowed'
                        )}
                        aria-label={`Buy ${item.name} for ${item.cost} currency`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {buying === item.id ? (
                          'Buying...'
                        ) : (
                          <span className="flex items-center gap-1">
                            <img src="/assets/items/coin.png" alt="" className="w-3.5 h-3.5 pixel-art" style={{ imageRendering: 'pixelated' }} />
                            {item.cost}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
