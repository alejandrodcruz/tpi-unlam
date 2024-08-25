USE tpifinal;

CREATE TABLE users (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          email VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO users (name, email) VALUES ('Juan', 'juan@example.com');
