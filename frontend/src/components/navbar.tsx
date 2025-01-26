// components/navbar.tsx
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useCart } from '../hooks/use-cart'

export function Navbar() {
    const { items } = useCart()
    return (
        <nav className="bg-gray-100 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Shoe Shop</Link>
                <div className="flex gap-4">
                    <Link to="/cart">
                        <Button variant="outline">
                            Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
                        </Button>
                    </Link>
                    <Link to="/orders">
                        <Button variant="secondary">
                            Orders
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}