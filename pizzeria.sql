-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 08, 2026 at 11:10 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pizzeria`
--

-- --------------------------------------------------------

--
-- Table structure for table `detalle_ventas`
--

CREATE TABLE `detalle_ventas` (
  `id_detalle` int NOT NULL,
  `id_venta` int NOT NULL,
  `tamano` varchar(20) NOT NULL,
  `ingredientes` varchar(100) NOT NULL,
  `num_pizzas` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `detalle_ventas`
--

INSERT INTO `detalle_ventas` (`id_detalle`, `id_venta`, `tamano`, `ingredientes`, `num_pizzas`, `subtotal`) VALUES
(1, 1, 'Mediana', 'Piña, Champiñones', 2, 200.00),
(2, 1, 'Chica', 'Queso', 1, 40.00),
(3, 1, 'Chica', 'Queso', 1, 40.00),
(4, 1, 'Chica', 'Jamón', 1, 50.00),
(5, 2, 'Chica', 'Queso', 1, 40.00),
(6, 2, 'Chica', 'Queso', 1, 40.00),
(7, 2, 'Chica', 'Queso', 1, 40.00),
(8, 3, 'Chica', 'Queso', 1, 40.00),
(9, 4, 'Chica', 'Queso', 1, 40.00),
(10, 5, 'Grande', 'Piña, Champiñones', 2, 280.00),
(11, 6, 'Chica', 'Queso', 1, 40.00),
(12, 6, 'Chica', 'Queso', 1, 40.00),
(13, 7, 'Chica', 'Queso', 1, 40.00),
(14, 7, 'Chica', 'Queso', 1, 40.00),
(15, 7, 'Chica', 'Queso', 2, 80.00),
(16, 7, 'Chica', 'Queso', 1, 40.00),
(17, 8, 'Mediana', 'Jamón, Piña', 3, 300.00),
(18, 9, 'Chica', 'Queso', 1, 40.00),
(19, 9, 'Chica', 'Piña', 2, 100.00),
(20, 9, 'Chica', 'Queso', 1, 40.00),
(21, 9, 'Grande', 'Champiñones', 3, 390.00),
(22, 10, 'Grande', 'Jamón, Champiñones', 3, 420.00),
(23, 11, 'Chica', 'Queso', 1, 40.00),
(24, 12, 'Mediana', 'Jamón', 2, 180.00),
(25, 13, 'Mediana', 'Jamón, Piña', 2, 200.00);

-- --------------------------------------------------------

--
-- Table structure for table `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` int NOT NULL,
  `nombre_cliente` varchar(100) NOT NULL,
  `direccion` varchar(150) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `fecha_pedido` date NOT NULL,
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ventas`
--

INSERT INTO `ventas` (`id_venta`, `nombre_cliente`, `direccion`, `telefono`, `fecha_pedido`, `total`) VALUES
(1, 'Jose', '10 de mayo', '4771234567', '2026-11-08', 330.00),
(2, 'Jose', '10 de mayo', '4771234567', '2026-11-08', 120.00),
(3, 'Jose', '10 de mayo', '4771234567', '2026-11-08', 40.00),
(4, 'Jose', '10 de mayo', '4771234567', '2026-11-08', 40.00),
(5, 'Jose', '10 de mayo', '4771234567', '2026-11-08', 280.00),
(6, 'Jose', '10 de mayo', '4771234567', '2026-11-08', 80.00),
(7, 'Jose', '10 de mayo', '4771234567', '2026-11-08', 200.00),
(8, 'Ricardo', '10 de Mayo', '4117894563', '2026-11-08', 300.00),
(9, 'Ricardo', '10 de Mayo', '4117894563', '2026-11-08', 570.00),
(10, 'Nayeli', '20 de Enero', '4725558899', '2026-11-08', 420.00),
(11, 'Nayeli', '20 de Enero', '4725558899', '2026-11-08', 40.00),
(12, 'Juan', 'Blvd. La Luz', '4794445533', '2026-11-07', 180.00),
(13, 'Esmeralda Juarez', 'Blvd. La Luz', '4792123669', '2026-11-08', 200.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_venta` (`id_venta`);

--
-- Indexes for table `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id_venta`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  MODIFY `id_detalle` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
