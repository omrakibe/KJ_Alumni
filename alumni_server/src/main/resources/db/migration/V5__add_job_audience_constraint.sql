ALTER TABLE job_postings
    ADD CONSTRAINT ck_job_postings_audience CHECK (
        (visibility = 'ALL' AND target_branch IS NULL)
        OR (visibility = 'BRANCH' AND target_branch IS NOT NULL)
    );
