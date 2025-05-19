DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;

CREATE TABLE workspaces (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_available BOOLEAN DEFAULT true,
    location VARCHAR(255)
);

CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    workspace_id BIGINT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
);