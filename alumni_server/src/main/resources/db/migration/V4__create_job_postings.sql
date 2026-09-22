CREATE TABLE job_postings (
    id UUID PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    company_name VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(180) NOT NULL,
    job_type VARCHAR(30) NOT NULL,
    experience_required VARCHAR(120) NOT NULL,
    application_details VARCHAR(1000) NOT NULL,
    deadline DATE NOT NULL,
    visibility VARCHAR(20) NOT NULL,
    target_branch VARCHAR(20),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    posted_by_name VARCHAR(240) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_job_postings_visibility_branch_deadline
    ON job_postings (visibility, target_branch, deadline);

CREATE INDEX idx_job_postings_created_by_deadline
    ON job_postings (created_by, deadline);
