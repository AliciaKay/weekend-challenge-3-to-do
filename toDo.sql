CREATE TABLE todo (
	id SERIAL PRIMARY KEY,
	task VARCHAR(200),
    description VARCHAR(200),
	complete BOOLEAN
);