-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : lun. 03 mars 2025 à 16:14
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
-- Structure de la table `appointment`
--

CREATE TABLE `appointment` (
  `appointment_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `client_name` varchar(100) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `symptoms` text NOT NULL,
  `praticien_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `appointment`
--

INSERT INTO `appointment` (`appointment_id`, `client_id`, `client_name`, `appointment_date`, `appointment_time`, `symptoms`, `praticien_id`) VALUES
(6, 11, 'ZacFlutter', '2025-03-11', '15:00:00', '[\"Douleur\"]', 4);

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
(6, 4, '[]');

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
(2, 'admin2', 'admin2.admin@admin.com', '$2b$10$V9PE1lbW1sySGXtmtPJq1eMHFq6KSSs3EseESbLYZEVTkZSiYUjOC', 'user'),
(3, 'test', 'test@gmail.com', '$2b$10$lOKBv6J2Ec0Olk7kYC7AXu8K.osi.XgBcmH54pyZOc9gm6Tu79pIq', 'user'),
(4, 'Zaclebg', 'zacdevouche@gmail.com', '$2b$10$9VNqKexDTI/FTj4wYKZvnezCJqOTzCf8O/bbO.aHO1kffabiIlivm', 'user'),
(5, 'flufffylool', 'fluffy@gmail.com', '$2b$10$brSZl1pgFnfRc77WmBxCbeocMgJWqxojvx3NBVH5427SEVTNYUf9K', 'user'),
(6, 'gabrieladmin', 'gabrieladmin@gmail.com', '$2b$10$lGRRz6ipUQKOdi2SAFwsNe5n1mpTpclwvXGlpy8uFRIf5.jqdQuyi', 'admin'),
(7, 'paniertest', 'paniertest@gmail.com', '$2b$10$ENJ7b6yfvT6KLsBn7FX65O877Bpy6ei1iPkn2HAhF1gsTfcrfMf6.', 'user'),
(8, 'testregister1', 'testregister1@gmail.com', '$2b$10$E5cFvpMgri4AhqWwJwcrweM3N08n036Jm5YW/y8cUcoAOkjH7/Vb.', 'user'),
(9, 'testregister2', 'testregister2@gmail.com', '$2b$10$ijbi7yOE1jpQehD6fUXNne22J7XnNFuCMbknQXq2u1wUaJ7W.vufu', 'user'),
(10, 'GabrielFlutter', 'gabrielflutter@gmail.com', '$2b$10$axvo2JaFAAdISqQDYBDeh.iaMzefZv6KBXQBIPboo546R8zLaHNNK', 'user'),
(11, 'ZacFlutter', 'zacflutter@gmail.com', '$2b$10$aTIpbXXkdI9bYcF7NKq0Mehqz9hELsCPppNFWaqCVi3T/o36hHFwC', 'user'),
(15, 'admin', 'admin@gmail.com', 'admin', 'user'),
(16, 'test test', 'gabrielflutter1@gmail.com', '$2b$10$KXHOB1t8qn5SMcUaLAgX.e654yZzzP0.zzSbZ7Qs/sEGEM5n8TXga', 'user'),
(17, 'zacdevouche', 'zacdevouche11@gmail.com', '$2b$10$qdUKU2WzGVa6olI/djQYgON5B1VmDUnoZLJBGEa/zY1k5vkLi7Cgu', 'user'),
(18, 'ZacFlutterrrr', 'zacflutterrrr@gmail.com', '$2b$10$tsg9SHu4hKTjOAOy5O9xGOUtdjyaWSSGf08gJyCN6VJOiFn.Re9YC', 'user'),
(19, 'ZacFlutterrrrr', 'zacflutterrrrr@gmail.com', '$2b$10$NqkRxbWwjQ0ZxPSvUQLGreu9RV0Q8xYGrSfNkPU8uHvwCyOMdugSa', 'user');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`order_id`, `cart_id`, `client_id`, `date`) VALUES
(1, 2, 6, '2024-12-18 14:56:10'),
(2, 2, 6, '2024-12-18 14:59:54'),
(3, 6, 4, '2025-03-03 10:02:10');

-- --------------------------------------------------------

--
-- Structure de la table `praticien`
--

CREATE TABLE `praticien` (
  `praticien_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `specialties` text NOT NULL,
  `avatarPath` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `praticien`
--

INSERT INTO `praticien` (`praticien_id`, `first_name`, `last_name`, `specialties`, `avatarPath`) VALUES
(1, 'Jean', 'Dupont', 'Cardiologue', 'assets/doctor.png'),
(2, 'Marie', 'Martin', 'Dermatologue', 'assets/avatar.png'),
(3, 'Pierre', 'Chabrier', 'Généraliste', 'assets/doctor.png'),
(4, 'Sylvain', 'Lyve', 'Podologue', 'assets/doctor.png');

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
(1, 'Doliprane', 'Contre les maux de tête', 2.00, 'assets/doliprane.png', 8),
(2, 'Spasfon', 'Contre les douleurs digestives et menstruelles', 5.00, 'assets/spasfon.png', 7),
(4, 'Gaviscon', 'Protège l\'estomac des brûlures et reflux gastriques', 10.00, 'assets/gaviscon.png', 14);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `praticien_id` (`praticien_id`),
  ADD KEY `fk_appointment_client` (`client_id`);

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
-- Index pour la table `praticien`
--
ALTER TABLE `praticien`
  ADD PRIMARY KEY (`praticien_id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id_product`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `clients`
--
ALTER TABLE `clients`
  MODIFY `client_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `praticien`
--
ALTER TABLE `praticien`
  MODIFY `praticien_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`praticien_id`) REFERENCES `praticien` (`praticien_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_appointment_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE CASCADE;

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
