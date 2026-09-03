CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  shop_domain TEXT UNIQUE NOT NULL,
  review_url TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'starter',
  done_for_you INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  external_id TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS review_requests (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  order_id TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  scheduled_at TEXT NOT NULL,
  sent_at TEXT,
  clicked_at TEXT,
  reminder_sent_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS idx_rr_due ON review_requests(status,scheduled_at);
CREATE INDEX IF NOT EXISTS idx_rr_reminder ON review_requests(status,sent_at,reminder_sent_at);