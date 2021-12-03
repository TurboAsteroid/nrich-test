CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS trackers (
    id bigserial PRIMARY KEY,
    uuid uuid DEFAULT uuid_generate_v4(),
    value character varying(32) NOT NULL
);

INSERT INTO trackers VALUES (DEFAULT, '2e00b2bf-f3f6-4c39-a14f-069d848be487', 'value-1');
INSERT INTO trackers VALUES (DEFAULT, '8b1e65fc-9a04-449c-9601-c170298f22aa', 'value-2');
INSERT INTO trackers VALUES (DEFAULT, '0800cef3-ee30-4413-9b60-a9f47a59f32c', 'value-3');
INSERT INTO trackers VALUES (DEFAULT, 'cd1a6097-37e8-49b9-b4fa-2816f7444ee5', 'value-4');
INSERT INTO trackers VALUES (DEFAULT, '0a9d0c63-05bf-4d84-ac60-03051dbdb66b', 'value-5');
