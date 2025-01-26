import { create } from 'zustand'

type CartItem = {
    product_id: number
    quantity: number
    name: string
    price: number
    stock_quantity?: number // Add if needed
}

type CartStore = {
    items: CartItem[]
    addItem: (product: Omit<CartItem, 'quantity'>) => void
    removeItem: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    clearCart: () => void
}

export const useCart = create<CartStore>((set) => ({
    items: [],
    addItem: (product) => set((state) => {
        const existingItem = state.items.find(item => item.product_id === product.product_id)
        return {
            items: existingItem
                ? state.items.map(item =>
                    item.product_id === product.product_id
                        ? {...item, quantity: item.quantity + 1}
                        : item
                )
                : [...state.items, { ...product, quantity: 1 }]
        }
    }),
    removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.product_id !== productId)
    })),
    updateQuantity: (productId, quantity) => {
        console.log('Updating quantity for:', productId, 'to:', quantity);
        set((state) => ({
            items: state.items.map(item =>
                item.product_id === productId
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            ).filter(item => item.quantity > 0)
        }))
    },
    clearCart: () => set({ items: [] })
}))