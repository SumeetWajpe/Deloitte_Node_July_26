CREATE DATABASE IF NOT EXISTS deldemyDB;
USE deldemyDB;

DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  likes INT NOT NULL DEFAULT 0,
  rating DECIMAL(2, 1) NOT NULL DEFAULT 0,
  trainer VARCHAR(255) NOT NULL,
  imageUrl TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

USE deldemyDB;
INSERT INTO courses (title, price, likes, rating, trainer, imageUrl, description) VALUES
('React', 5000, 400, 5, 'Jack Well',
 'https://framerusercontent.com/images/N0xefN2fE6CCF4G2YhAg5exTHX8.png?width=1200&height=800',
 'React is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta and a community of individual developers and companies.'),

('Redux', 4000, 600, 5, 'John Jacob',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSm0kX9ueuge4cLawcTFWfSZ8yNIRlZCLI5M0v-07Zwu3NcPsZHUtS6bKr&s=10',
 'Redux is an open-source JavaScript library for managing and centralizing application state. It is most commonly used with libraries such as React or Angular for building user interfaces.'),

('Node', 6000, 900, 4, 'Bishop Renny',
 'https://blog.logrocket.com/wp-content/uploads/2022/10/Building-simple-login-form-node-js.png',
 'Node.js is a cross-platform, open-source server environment that can run on Windows, Linux, Unix, macOS, and more. Node.js is a back-end JavaScript runtime environment, runs on the V8 JavaScript Engine.'),

('Angular', 5000, 200, 3, 'Matthew Bell',
 'https://img-c.udemycdn.com/course/480x270/756150_c033_4.jpg',
 'Angular is a TypeScript-based, free and open-source web application framework led by the Angular Team at Google and by a community of individuals and corporations.'),

('Flutter', 7000, 700, 4, 'Jenny Alter',
 'https://miro.medium.com/max/2000/1*PCKC8Ufml-wvb9Vjj3aaWw.jpeg',
 'Flutter is an open-source UI software development kit created by Google. It is used to develop cross-platform applications for Android, iOS, Linux, macOS, Windows, Google Fuchsia, and the web from a single codebase.');
