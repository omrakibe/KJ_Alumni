CREATE TABLE announcements (id UUID PRIMARY KEY,title VARCHAR(180) NOT NULL,message TEXT NOT NULL,visibility VARCHAR(20) NOT NULL,branch VARCHAR(20),priority VARCHAR(20) NOT NULL,status VARCHAR(20) NOT NULL,created_by UUID NOT NULL REFERENCES users(id),created_at TIMESTAMP,updated_at TIMESTAMP);
CREATE INDEX idx_announcements_audience ON announcements (status, visibility, branch);
