import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ShopGrid } from '@/components/app/ShopGrid';

export default async function RewardsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: profile }, { data: items }, { data: inventory }] = await Promise.all([
    supabase.from('users').select('currency').eq('id', user.id).single(),
    supabase.from('shop_items').select('*').order('cost', { ascending: true }),
    supabase.from('user_inventory').select('item_id').eq('user_id', user.id),
  ]);

  const ownedIds = new Set((inventory ?? []).map((i) => i.item_id));

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rewards Shop</h1>
          <p className="text-text-secondary mt-1">Spend your hard-earned currency on cosmetics and badges.</p>
        </div>
        <div className="card flex items-center gap-2 px-4 py-2">
          <span className="text-xl">💰</span>
          <span className="font-bold font-mono text-brand-gold">{profile?.currency ?? 0}</span>
        </div>
      </div>
      <ShopGrid items={items ?? []} ownedIds={ownedIds} currency={profile?.currency ?? 0} />
    </div>
  );
}
