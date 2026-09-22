ALTER TABLE job_postings
    ADD COLUMN posted_by_alumni_id VARCHAR(50);

UPDATE job_postings job
SET posted_by_alumni_id = alumni.alumni_id
FROM alumni
WHERE alumni.user_id = job.created_by;

ALTER TABLE job_postings
    ALTER COLUMN posted_by_alumni_id SET NOT NULL;
