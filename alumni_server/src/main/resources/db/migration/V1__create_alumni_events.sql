CREATE TABLE alumni_events (
    id UUID PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    event_date_time TIMESTAMP NOT NULL,
    venue VARCHAR(255) NOT NULL,
    branch VARCHAR(20),
    visibility VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
CREATE INDEX idx_alumni_events_visibility_branch ON alumni_events (visibility, branch);
CREATE INDEX idx_alumni_events_event_date_time ON alumni_events (event_date_time);
