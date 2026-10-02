import { createPublicClient } from '@/utils/supabase/public'
import { buildPriceBoard } from './board'

/** Latest approved material prices (for guides and the prices page). Never throws. */
export async function getPriceBoard() {
    try {
        const supabase = createPublicClient()
        const { data } = await supabase
            .from('material_prices')
            .select('item_key, city, price_min, price_max, source_name, source_url, effective_date, created_at')
            .eq('status', 'published')
            .order('effective_date', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(1000)
        return buildPriceBoard(data || [])
    } catch {
        return { board: {}, lastUpdated: null }
    }
}

/** Full published history for one city (for the prices page chart/table) */
export async function getPriceHistory(city = 'Lagos', days = 400) {
    try {
        const supabase = createPublicClient()
        const since = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10)
        const { data } = await supabase
            .from('material_prices')
            .select('item_key, city, price_min, price_max, effective_date')
            .eq('status', 'published')
            .eq('city', city)
            .gte('effective_date', since)
            .order('effective_date', { ascending: true })
        return data || []
    } catch {
        return []
    }
}
