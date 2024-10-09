USE tpifinal;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `user` (
                        `id` int NOT NULL,
                        `email` varchar(255) DEFAULT NULL,
                        `password` varchar(255) DEFAULT NULL,
                        `role` enum('ADMIN','USER') DEFAULT NULL,
                        `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user` (`id`, `email`, `password`, `role`, `username`) VALUES
    (1, 'alejandrocruz.laboratorio@gmail.com', '$2a$10$C.2jLETYrf0ZD9WBikAE0eNkPLbaSNYKdZdLYM2ZPmHPPp0YaMgeC', 'USER', 'alejandro');

ALTER TABLE `user`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKsb8bbouer5wak8vyiiy4pf2bx` (`username`);
COMMIT;