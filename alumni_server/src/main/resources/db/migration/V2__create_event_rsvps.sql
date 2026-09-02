CREATE TABLE event_rsvps (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES alumni_events(id) ON DELETE CASCADE,
    alumni_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT uk_event_rsvp_event_user UNIQUE (event_id, alumni_user_id)
);
CREATE INDEX idx_event_rsvps_event ON event_rsvps (event_id);
