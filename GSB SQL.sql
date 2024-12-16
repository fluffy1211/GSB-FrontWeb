-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 04 déc. 2024 à 14:56
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gsb`
--

-- --------------------------------------------------------

--
-- Structure de la table `carts`
--

CREATE TABLE `carts` (
  `cart_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `cart_content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`cart_content`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `carts`
--

INSERT INTO `carts` (`cart_id`, `client_id`, `cart_content`) VALUES
(1, 1, '[{\"id_product\":1,\"quantity\":1,\"price\":\"2.00\"}]'),
(2, 6, '[{\"id_product\":\"2\",\"quantity\":1,\"price\":\"10.00\"}]'),
(3, 7, '[{\"id_product\":\"2\",\"quantity\":2,\"price\":\"10.00\"},{\"id_product\":\"1\",\"quantity\":1,\"price\":\"2.00\"},{\"id_product\":\"4\",\"quantity\":1,\"price\":\"14.00\"}]'),
(4, 8, '[{\"id_product\":\"2\",\"quantity\":1,\"price\":\"10.00\"}]');

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `clients`
--

INSERT INTO `clients` (`client_id`, `name`, `email`, `password`, `role`) VALUES
(1, 'admin', 'admin.admin@admin.com', '$2b$10$Aq6bkG7jNK9cLEDqK0gvzuaNHdXxb.zchsGvZLZ79xdkxz955.x/W', 'user'),
(3, 'test', 'test@gmail.com', '$2b$10$lOKBv6J2Ec0Olk7kYC7AXu8K.osi.XgBcmH54pyZOc9gm6Tu79pIq', 'user'),
(4, 'Zaclebg', 'zacdevouche@gmail.com', '$2b$10$9VNqKexDTI/FTj4wYKZvnezCJqOTzCf8O/bbO.aHO1kffabiIlivm', 'user'),
(5, 'flufffylool', 'fluffy@gmail.com', '$2b$10$brSZl1pgFnfRc77WmBxCbeocMgJWqxojvx3NBVH5427SEVTNYUf9K', 'user'),
(6, 'gabrieladmin', 'gabrieladmin@gmail.com', '$2b$10$lGRRz6ipUQKOdi2SAFwsNe5n1mpTpclwvXGlpy8uFRIf5.jqdQuyi', 'user'),
(7, 'Adminn', 'admin@gmail.com', '$2b$10$MH.Tq2T7BMmxUu9F.z/Ij.gevNSxRmNieRte5W8iTH2TxotDe5gde', 'admin'),
(8, 'zacc', 'zac@mail.com', '$2b$10$VnVXwM/ConLjJFlMBJHKkO9vPdUVnaPWirJ3tFOlJF0iRJ8GEsTC6', 'user');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id_product` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `imagePath` varchar(500) NOT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id_product`, `name`, `description`, `price`, `imagePath`, `quantity`) VALUES
(1, 'Doliprane', 'Contre les maux de tête', 2.00, 'assets/doliprane.png', 1),
(2, 'Pilules', 'Pilules de ouf', 10.00, 'assets/pilules.png', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Index pour la table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`client_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id_product`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `clients`
--
ALTER TABLE `clients`
  MODIFY `client_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`);

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
