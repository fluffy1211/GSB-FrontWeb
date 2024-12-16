-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mer. 04 déc. 2024 à 15:16
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

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
(2, 6, '[]'),
(3, 7, '[{\"id_product\":\"1\",\"quantity\":2,\"price\":\"2.00\"},{\"id_product\":\"2\",\"quantity\":1,\"price\":\"10.00\"}]'),
(4, 9, '[]');

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `clients`
--

INSERT INTO `clients` (`client_id`, `name`, `email`, `password`) VALUES
(1, 'admin', 'admin.admin@admin.com', '$2b$10$Aq6bkG7jNK9cLEDqK0gvzuaNHdXxb.zchsGvZLZ79xdkxz955.x/W'),
(2, 'admin2', 'admin2.admin@admin.com', '$2b$10$V9PE1lbW1sySGXtmtPJq1eMHFq6KSSs3EseESbLYZEVTkZSiYUjOC'),
(3, 'test', 'test@gmail.com', '$2b$10$lOKBv6J2Ec0Olk7kYC7AXu8K.osi.XgBcmH54pyZOc9gm6Tu79pIq'),
(4, 'Zaclebg', 'zacdevouche@gmail.com', '$2b$10$9VNqKexDTI/FTj4wYKZvnezCJqOTzCf8O/bbO.aHO1kffabiIlivm'),
(5, 'flufffylool', 'fluffy@gmail.com', '$2b$10$brSZl1pgFnfRc77WmBxCbeocMgJWqxojvx3NBVH5427SEVTNYUf9K'),
(6, 'gabrieladmin', 'gabrieladmin@gmail.com', '$2b$10$lGRRz6ipUQKOdi2SAFwsNe5n1mpTpclwvXGlpy8uFRIf5.jqdQuyi'),
(7, 'paniertest', 'paniertest@gmail.com', '$2b$10$ENJ7b6yfvT6KLsBn7FX65O877Bpy6ei1iPkn2HAhF1gsTfcrfMf6.'),
(8, 'testregister1', 'testregister1@gmail.com', '$2b$10$E5cFvpMgri4AhqWwJwcrweM3N08n036Jm5YW/y8cUcoAOkjH7/Vb.'),
(9, 'testregister2', 'testregister2@gmail.com', '$2b$10$ijbi7yOE1jpQehD6fUXNne22J7XnNFuCMbknQXq2u1wUaJ7W.vufu');

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
  MODIFY `client_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
