// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CartPage from './pages/CartPage'
import ProductDetail from './pages/ProductDetail'
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from './components/navbar'
import OrdersPage from './pages/Orders'

function App() {
    return (
        <Router>
            <Navbar />
            <main className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/orders" element={<OrdersPage />} />
                </Routes>
            </main>
            <Toaster />
        </Router>
    )
}

export default App