ALTER TABLE profiles ADD CONSTRAINT credits_non_negative CHECK (ai_credits >= 0);
