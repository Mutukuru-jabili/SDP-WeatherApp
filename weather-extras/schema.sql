-- MySQL schema for Weather App
CREATE DATABASE IF NOT EXISTS weatherdb;
USE weatherdb;
CREATE TABLE IF NOT EXISTS favorite_location (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  city VARCHAR(150)
);
