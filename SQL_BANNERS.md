-- ============================================================================
-- BANNERS TABLE - SQL for Backend Integration
-- ============================================================================

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    target_url TEXT,
    placement VARCHAR(50) NOT NULL,  -- 'homepage', 'category', 'checkout', 'popup'
    status VARCHAR(50) NOT NULL DEFAULT 'draft',  -- 'draft', 'scheduled', 'active', 'inactive', 'expired'
    priority INTEGER DEFAULT 1,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversion_rate NUMERIC(5,4) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    CHECK (start_date <= end_date)
);

-- Create indexes for performance
CREATE INDEX idx_banners_store_id ON banners(store_id);
CREATE INDEX idx_banners_status ON banners(status);
CREATE INDEX idx_banners_placement ON banners(placement);
CREATE INDEX idx_banners_valid_dates ON banners(start_date, end_date);

-- ============================================================================
-- QUERIES FOR API ENDPOINTS
-- ============================================================================

-- GET: All banners for a store
SELECT * FROM banners 
WHERE store_id = ${store_id}
ORDER BY priority DESC, created_at DESC;

-- GET: Active banners by placement
SELECT * FROM banners
WHERE store_id = ${store_id}
  AND status = 'active'
  AND placement = ${placement}
  AND start_date <= CURRENT_DATE
  AND end_date >= CURRENT_DATE
ORDER BY priority DESC;

-- GET: Banners with statistics
SELECT 
    id,
    title,
    description,
    image_url,
    target_url,
    placement,
    status,
    priority,
    start_date,
    end_date,
    impressions,
    clicks,
    CASE 
        WHEN impressions > 0 THEN (clicks::NUMERIC / impressions)
        ELSE 0 
    END as click_rate,
    conversion_rate,
    created_at,
    updated_at
FROM banners
WHERE store_id = ${store_id}
ORDER BY created_at DESC;

-- POST: Create new banner
INSERT INTO banners (
    store_id,
    title,
    description,
    image_url,
    target_url,
    placement,
    status,
    priority,
    start_date,
    end_date,
    created_by
) VALUES (
    ${store_id},
    ${title},
    ${description},
    ${image_url},
    ${target_url},
    ${placement},
    ${status},
    ${priority},
    ${start_date},
    ${end_date},
    ${created_by}
) RETURNING *;

-- PUT: Update banner
UPDATE banners SET
    title = ${title},
    description = ${description},
    image_url = ${image_url},
    target_url = ${target_url},
    placement = ${placement},
    status = ${status},
    priority = ${priority},
    start_date = ${start_date},
    end_date = ${end_date},
    updated_at = CURRENT_TIMESTAMP
WHERE id = ${id} AND store_id = ${store_id}
RETURNING *;

-- DELETE: Remove banner
DELETE FROM banners
WHERE id = ${id} AND store_id = ${store_id};

-- Update impressions (when banner is shown)
UPDATE banners SET impressions = impressions + 1
WHERE id = ${id};

-- Update clicks (when user clicks banner)
UPDATE banners SET clicks = clicks + 1
WHERE id = ${id};

-- Get banner statistics
SELECT 
    COUNT(*) as total_banners,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_banners,
    SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled_banners,
    SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired_banners,
    SUM(impressions) as total_impressions,
    SUM(clicks) as total_clicks,
    ROUND(AVG(CASE WHEN impressions > 0 THEN (clicks::NUMERIC / impressions) ELSE 0 END)::NUMERIC, 4) as avg_click_rate
FROM banners
WHERE store_id = ${store_id};

-- ============================================================================
-- OPTIONAL: Relationship between banners and promotions
-- ============================================================================

-- If you want to link banners to specific promotions:
ALTER TABLE banners ADD COLUMN promotion_id BIGINT REFERENCES promotions(id) ON DELETE SET NULL;

-- Query banners with associated promotion
SELECT 
    b.*,
    p.title as promotion_title,
    p.discount_percent,
    p.discount_text
FROM banners b
LEFT JOIN promotions p ON b.promotion_id = p.id
WHERE b.store_id = ${store_id}
ORDER BY b.priority DESC;
