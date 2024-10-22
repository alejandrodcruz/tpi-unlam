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

CREATE TABLE `device` (
                          `device_id` varchar(17) NOT NULL,
                          `assigned` tinyint(1) NOT NULL DEFAULT '0',
                          `estimated_consume` int NOT NULL DEFAULT '0',
                          `name` varchar(255) NOT NULL,
                          `pairing_code` varchar(255) DEFAULT NULL,
                          `user_id` int DEFAULT NULL,
                          PRIMARY KEY (`device_id`),
                          CONSTRAINT `fk_user_device` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insertar datos en la tabla device
INSERT INTO `device` (`device_id`, `assigned`, `estimated_consume`, `name`, `pairing_code`, `user_id`) VALUES
('08:A6:F7:24:71:98', 1, 0, 'Heladera', NULL, 1),
('08:A6:F7:24:71:99', 1, 0, 'Aire Acondicionado', NULL, 1),
('08:A6:F7:24:71:9A', 1, 0, 'Microondas', NULL, 1),
('08:A6:F7:24:71:9B', 1, 0, 'Lavarropas', NULL, 1),
('08:A6:F7:24:71:9C', 1, 0, 'Televisor', NULL, 1),
('08:A6:F7:24:71:9D', 1, 0, 'Computadora', NULL, 1),
('08:A6:F7:24:71:9E', 1, 0, 'Lámpara LED', NULL, 1),
('08:A6:F7:24:71:9F', 1, 0, 'Ventilador', NULL, 1),
('08:A6:F7:24:71:A0', 1, 0, 'Cargador de Celular', NULL, 1),
('08:A6:F7:24:71:A1', 1, 0, 'Router WiFi', NULL, 1),
('08:A6:F7:24:71:A2', 1, 0, 'Lavavajillas', NULL, 1),
('08:A6:F7:24:71:A3', 1, 0, 'Secador de Pelo', NULL, 1),
('08:A6:F7:24:71:A4', 1, 0, 'Calefactor Eléctrico', NULL, 1),
('08:A6:F7:24:71:A5', 1, 0, 'Plancha', NULL, 1),
('08:A6:F7:24:71:A6', 1, 0, 'Cafetera', NULL, 1),
('08:A6:F7:24:71:A7', 1, 0, 'Extractor de Aire', NULL, 1),
('08:A6:F7:24:71:A8', 1, 0, 'Horno Eléctrico', NULL, 1),
('08:A6:F7:24:71:A9', 1, 0, 'Bomba de Agua', NULL, 1),
('08:A6:F7:24:71:AA', 1, 0, 'Radiador Eléctrico', NULL, 1),
('08:A6:F7:24:71:AB', 1, 0, 'Impresora Láser', NULL, 1);

COMMIT;

-- INSERT INTO `device` (`device_id`, `assigned`, `estimated_consume`, `name`, `pairing_code`, `user_id`) VALUES
-- ('08:A6:F7:24:71:98', b'1', 0, 'Heladera', NULL, 1),
-- ('08:A6:F7:24:71:99', b'1', 0, 'Aire Acondicionado', NULL, 1),
-- ('08:A6:F7:24:71:9A', b'1', 0, 'Microondas', NULL, 1),
-- ('08:A6:F7:24:71:9B', b'1', 0, 'Lavarropas', NULL, 1),
-- ('08:A6:F7:24:71:9C', b'1', 0, 'Televisor', NULL, 1),
-- ('08:A6:F7:24:71:9D', b'1', 0, 'Computadora', NULL, 1),
-- ('08:A6:F7:24:71:9E', b'1', 0, 'Lámpara LED', NULL, 1),
-- ('08:A6:F7:24:71:9F', b'1', 0, 'Ventilador', NULL, 1),
-- ('08:A6:F7:24:71:A0', b'1', 0, 'Cargador de Celular', NULL, 1),
-- ('08:A6:F7:24:71:A1', b'1', 0, 'Router WiFi', NULL, 1),
-- ('08:A6:F7:24:71:A2', b'1', 0, 'Lavavajillas', NULL, 1),
-- ('08:A6:F7:24:71:A3', b'1', 0, 'Secador de Pelo', NULL, 1),
-- ('08:A6:F7:24:71:A4', b'1', 0, 'Calefactor Eléctrico', NULL, 1),
-- ('08:A6:F7:24:71:A5', b'1', 0, 'Plancha', NULL, 1),
-- ('08:A6:F7:24:71:A6', b'1', 0, 'Cafetera', NULL, 1),
-- ('08:A6:F7:24:71:A7', b'1', 0, 'Extractor de Aire', NULL, 1),
-- ('08:A6:F7:24:71:A8', b'1', 0, 'Horno Eléctrico', NULL, 1),
-- ('08:A6:F7:24:71:A9', b'1', 0, 'Bomba de Agua', NULL, 1),
-- ('08:A6:F7:24:71:AA', b'1', 0, 'Radiador Eléctrico', NULL, 1),
-- ('08:A6:F7:24:71:AB', b'1', 0, 'Impresora Láser', NULL, 1);