-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 26, 2025 at 09:26 PM
-- Server version: 8.0.30
-- PHP Version: 8.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shopping_cart`
--

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `name`, `description`, `price`, `stock_quantity`) VALUES
(1, 'Running Shoes', 'Lightweight running shoes', 99.99, 47),
(2, 'Casual Sneakers', 'Everyday casual sneakers', 79.99, 20),
(3, 'Hiking Boots', 'Waterproof hiking boots', 149.99, 16),
(4, 'Air Max 270', 'Nike casual sneakers with visible Air unit', 129.99, 14),
(5, 'Classic Leather', 'Reebok retro-inspired sneakers', 89.95, 0),
(6, 'Gel-Kayano 30', 'ASICS premium stability running shoes', 159.99, 7),
(7, 'Chuck Taylor All Star', 'Converse classic canvas sneakers', 59.99, 25),
(8, 'Timberland Premium', 'Waterproof leather boots', 199.99, 0),
(9, 'Adidas UltraBoost', 'Responsive running shoes with Boost midsole', 179.99, 12),
(10, 'Birkenstock Arizona', 'Comfort leather sandals', 99.95, 18),
(11, 'Vans Old Skool', 'Skateboarding shoes with iconic stripe', 74.99, 7),
(12, 'New Balance 574', 'Retro running-inspired lifestyle shoe', 89.99, 0),
(13, 'Salomon XA Pro 3D', 'Trail running shoes with quicklace system', 139.99, 0),
(14, 'Crocs Classic Clog', 'Lightweight comfort clogs', 49.99, 42),
(15, 'Dr. Martens 1460', 'Classic 8-eye leather boots', 159.99, 5),
(16, 'Hoka Clifton 9', 'Max-cushioned running shoes', 149.99, 8),
(17, 'Puma Suede Classic', '70s-inspired basketball sneakers', 79.99, 0),
(18, 'On Cloud 5', 'Lightweight running shoes with cloud elements', 149.99, 6),
(19, 'Gucci Ace', 'Luxury sneakers with embroidered bee', 599.99, 2),
(20, 'Merrell Moab 3', 'Hiking shoes with Vibram outsole', 129.99, 9),
(21, 'Yeezy Boost 350', 'Limited edition sneakers', 299.99, 0),
(22, 'Skechers Arch Fit', 'Podiatrist-certified arch support', 109.99, 14),
(23, 'Under Armour Curry 10', 'Basketball shoes with Flow cushioning', 169.99, 4);

-- --------------------------------------------------------

--
-- Table structure for table `salesorder`
--

CREATE TABLE `salesorder` (
  `order_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `salesorder`
--

INSERT INTO `salesorder` (`order_id`, `total_amount`, `created_at`) VALUES
(1, 349.97, '2025-01-24 19:23:00'),
(2, 319.96, '2025-01-24 19:30:40'),
(3, 99.99, '2025-01-24 21:29:19'),
(4, 389.96, '2025-01-24 21:29:37'),
(5, 299.98, '2025-01-24 21:29:52'),
(6, 1099.90, '2025-01-26 20:14:54');

-- --------------------------------------------------------

--
-- Table structure for table `salesorderitem`
--

CREATE TABLE `salesorderitem` (
  `order_item_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `salesorderitem`
--

INSERT INTO `salesorderitem` (`order_item_id`, `order_id`, `product_id`, `quantity`) VALUES
(1, 1, 1, 2),
(2, 1, 3, 1),
(3, 2, 2, 4),
(4, 3, 1, 1),
(5, 4, 2, 3),
(6, 4, 3, 1),
(7, 5, 3, 2),
(8, 6, 2, 3),
(9, 6, 6, 1),
(10, 6, 4, 1),
(11, 6, 12, 3),
(12, 6, 16, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `salesorder`
--
ALTER TABLE `salesorder`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `salesorderitem`
--
ALTER TABLE `salesorderitem`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `salesorder`
--
ALTER TABLE `salesorder`
  MODIFY `order_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `salesorderitem`
--
ALTER TABLE `salesorderitem`
  MODIFY `order_item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `salesorderitem`
--
ALTER TABLE `salesorderitem`
  ADD CONSTRAINT `salesorderitem_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `salesorder` (`order_id`),
  ADD CONSTRAINT `salesorderitem_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
