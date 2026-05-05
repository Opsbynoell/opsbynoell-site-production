-- Set per-client PCI cron tier.
--
-- Run this in the Supabase SQL Editor for project clipzfkbzupjctherijz.
-- The cron route /api/cron/pci-generate?tier=<tier> reads
-- clients.pci_config.cronTier for every client and only processes the
-- ones whose tier matches the run's tier.
--
-- Tiers:
--   "standard". nightly at 1am Pacific
--   "realtime". every 6 hours at 1am, 7am, 1pm, 7pm Pacific
--   "disabled" or missing. skipped by both crons (default)

-- Set Santa to Standard (nightly).
UPDATE clients
SET pci_config = COALESCE(pci_config, '{}'::jsonb) || jsonb_build_object('cronTier', 'standard')
WHERE id = 'santa';

-- Set opsbynoell to Real-Time (4x daily).
UPDATE clients
SET pci_config = COALESCE(pci_config, '{}'::jsonb) || jsonb_build_object('cronTier', 'realtime')
WHERE id = 'opsbynoell';

-- Verify.
SELECT id, pci_config->>'cronTier' AS cron_tier
FROM clients
WHERE id IN ('santa', 'opsbynoell');
