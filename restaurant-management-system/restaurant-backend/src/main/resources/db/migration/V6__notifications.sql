CREATE TABLE notifications (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title_key       VARCHAR(120) NOT NULL,
    body_key        VARCHAR(120) NOT NULL,
    vars_json       TEXT,
    read_flag       BOOLEAN NOT NULL DEFAULT FALSE,
    reference_type  VARCHAR(60),
    reference_id    BIGINT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);

INSERT INTO notifications (user_id, title_key, body_key, read_flag, reference_type, reference_id) VALUES
(NULL, 'NOTIFICATIONS.WELCOME_TITLE', 'NOTIFICATIONS.WELCOME_BODY', FALSE, NULL, NULL),
(NULL, 'NOTIFICATIONS.KITCHEN_TITLE', 'NOTIFICATIONS.KITCHEN_BODY', TRUE, 'Order', 1);
