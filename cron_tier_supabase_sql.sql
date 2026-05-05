-- Configure per-client PCI cron tiers.
-- Run this in the Supabase SQL Editor after deploying the cron route.

-- Set Santa to Standard (nightly)
UPDATE clients
SET pci_config = COALESCE(pci_config, '{}'::jsonb) || jsonb_build_object('cronTier', 'standard')
WHERE client_id = 'santa';

-- Set opsbynoell to Real-Time (4x daily)
UPDATE clients
SET pci_config = COALESCE(pci_config, '{}'::jsonb) || jsonb_build_object('cronTier', 'realtime')
WHERE client_id = 'opsbynoell';

-- Verify
SELECT client_id, pci_config->>'cronTier' AS cron_tier
FROM clients
WHERE client_id IN ('santa', 'opsbynoell');
