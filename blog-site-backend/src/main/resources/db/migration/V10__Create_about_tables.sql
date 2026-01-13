-- Education Table
CREATE TABLE education (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMP,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    faculty VARCHAR(255),
    department VARCHAR(255),
    period VARCHAR(255) NOT NULL,
    status VARCHAR(255),
    thesis TEXT,
    gpa VARCHAR(50)
);

-- Experience Table
CREATE TABLE experience (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMP,
    company VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    period VARCHAR(255) NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    leave_reason TEXT,
    display_order INT
);

-- Experience Technologies Table
CREATE TABLE experience_technologies (
    experience_id UUID NOT NULL,
    technology VARCHAR(255) NOT NULL,
    PRIMARY KEY (experience_id, technology),
    FOREIGN KEY (experience_id) REFERENCES experience(id) ON DELETE CASCADE
);

-- References Table
CREATE TABLE references_job (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    current_company VARCHAR(255),
    current_title VARCHAR(255),
    worked_together VARCHAR(255),
    role_when_worked VARCHAR(255)
);

-- Seed Education
INSERT INTO education (id, version, created_at, updated_at, institution, degree, faculty, department, period, status, thesis, gpa) 
VALUES 
('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b71', 0, NOW(), NOW(), 'Konya Teknik Üniversitesi', 'Yüksek Lisans', 'Mühendislik Fakültesi', 'Yazılım Mühendisliği Bölümü', '2024 - Devam', 'Devam', 'Hexagonal Mimari ile Microservice''ler arasındaki Metrik Farkları', NULL),
('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b72', 0, NOW(), NOW(), 'Konya Selçuk Üniversitesi', 'Lisans', 'Mühendislik Fakültesi', 'Bilgisayar Mühendisliği', '2014 - 2019', 'Mezun', NULL, '2.76');

-- Seed Experience
INSERT INTO experience (id, version, created_at, updated_at, company, title, period, is_current, description, display_order) 
VALUES ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b81', 0, NOW(), NOW(), 'Codexist', 'Software Developer', '09.2024 - Devam', TRUE, 'Çalışanların paralelde birden fazla projede değerlendirildiği bu firmada, Python ile geliştirilen bir gateway''e PostgreSQL''deki Materialized View''ların refresh edilmesi üzerine ve superset''te grafikler çizdirilmesi üzerine endpointler geliştirdim. Ayrıca firmanın ARGE projesi için sistem seviyesinden gelen bilgilerin redis''ten okunması ve queue''ya yazılması üzerine bir geliştirme yaptım. Drools ile kural tabanlı bir uygulama geliştirdim.', 1);

INSERT INTO experience_technologies (experience_id, technology) VALUES 
('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b81', 'Python'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b81', 'Java'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b81', 'Spring Boot'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b81', 'Node.js'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b81', 'PostgreSQL'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b81', 'Redis'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b81', 'RabbitMQ'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b81', 'Docker'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b81', 'Apache Superset'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b81', 'Apache Drools'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b81', 'Bash Script');

INSERT INTO experience (id, version, created_at, updated_at, company, title, period, is_current, description, leave_reason, display_order) 
VALUES ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b82', 0, NOW(), NOW(), 'CMIT', 'Back End Developer', '02.2024 - 09.2024', FALSE, '.NET ile geliştirilen projelerin Blazor tarafındaki front end tasklarında rol oynadım. Ayrıca "Diyanet İşleri Başkanlığı"nın işe alım süreçlerini yönettiği platformun geliştirmesini yaptım.', 'Evlilikten dolayı şehir değişikliği', 2);

INSERT INTO experience_technologies (experience_id, technology) VALUES 
('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b82', 'Spring Boot'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b82', 'Spring Data JPA'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b82', 'Spring Security'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b82', 'Blazor'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b82', '.NET'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b82', 'Multi-Module'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b82', 'Redis'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b82', 'RabbitMQ'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b82', 'Azure Blob Storage'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b82', 'Azure Active Directory'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b82', 'PostgreSQL');

INSERT INTO experience (id, version, created_at, updated_at, company, title, period, is_current, description, leave_reason, display_order) 
VALUES ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b83', 0, NOW(), NOW(), 'BeeMe', 'Full Stack Developer', '15.09.2023 - 10.02.2024', FALSE, 'BeeMe bir sosyal medya start-up’ı. İnsanların post paylaşıp para kazanabildiği bir uygulama. Bu uygulamada, yeni geliştirmelerin yapılmasından ve yeni microservice’lerin yazılması ve admin panelinin bug fix’lerinin yapılması görevlerinde yer aldım. Kod refactoring tasklarında bulundum.', 'Start-Up’ın faliyetlerini durdurması', 3);

INSERT INTO experience_technologies (experience_id, technology) VALUES 
('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b83', 'Microservice Mimarisi'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b83', 'Spring Boot'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b83', 'Java 21'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b83', 'MongoDB'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b83', 'GraalVM');

INSERT INTO experience (id, version, created_at, updated_at, company, title, period, is_current, description, leave_reason, display_order) 
VALUES ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b84', 0, NOW(), NOW(), 'Etiya', 'Java Back End Developer', '12.09.2022 - 12.09.2023', FALSE, 'Telekomünikasyon sektöründe faaliyet gösteren firmada production ortamından gelen bugların çözülmesi, kod optimizasyonu gibi taskların çözümünde görev aldım.', 'Beraber çalışığım yöneticilerimin ve ekip arkadaşlarımın işten ayrılması ve Start-Up deneyimleme isteği', 4);

INSERT INTO experience_technologies (experience_id, technology) VALUES 
('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b84', 'Monolithic Mimari'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b84', 'Java 17'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b84', 'Spring Boot'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b84', 'Spring Data JPA'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b84', 'PostgreSQL');

INSERT INTO experience (id, version, created_at, updated_at, company, title, period, is_current, description, leave_reason, display_order) 
VALUES ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b85', 0, NOW(), NOW(), 'VBT Bilgi Teknolojileri', 'Arge Yazılım Mühendisi', '17.05.2021 - 31.05.2022', FALSE, 'Firmanın kendi ürünü olan bir görüntülü konuşma sistemi projesinde yer aldım. Windows sunucularda docker imajlarının ayağa kaldırılması, mail sistemleri, mesajlaşma sistemleri, mesajların loglanması, akıllı tahta entegrasyonu, ilgili projenin masaüstü uygulamasının geliştirilmesi tasklarında yer aldım.', 'Takımdaki senior eksikliğinden kaynaklı oluşan boşluklar', 5);

INSERT INTO experience_technologies (experience_id, technology) VALUES 
('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b85', 'Monolithic Mimari'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b85', 'Node.JS'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b85', 'Vue.JS'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b85', 'Electron.JS'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b85', 'MongoDB'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b85', 'Docker'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b85', 'RabbitMQ');

INSERT INTO experience (id, version, created_at, updated_at, company, title, period, is_current, description, leave_reason, display_order) 
VALUES ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b86', 0, NOW(), NOW(), 'Keydata Bilgi İşlem Teknolojileri', 'Junior Full Stack Developer', '01.11.2019 - 30.11.2020', FALSE, 'Hastane ve sağlık sektöründe faliyet gösteren firmada HBYS (Hastane Bilgi Yönetim Sistemi) ürününü kullanan hastane personellerinin istekleri doğrultusunda ilgili üründe geliştirmeler ve güncellemeler yaptım. Projeye yeni bir modül ekledim.', 'Ürünün geliştirilmesinde kullanılan teknolojilerin güncel olmaması ve Node.JS ile sektör tecrübesi kazanma isteği', 6);

INSERT INTO experience_technologies (experience_id, technology) VALUES 
('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b86', 'Monolithic Mimari'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b86', 'Java EJB'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b86', 'Javascript Ext.js'), ('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b86', 'Oracle');

-- Seed References
INSERT INTO references_job (id, version, created_at, updated_at, name, current_company, current_title, worked_together, role_when_worked) 
VALUES 
('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b91', 0, NOW(), NOW(), 'Serkan BİNGÖL', 'CMIT', 'Yazılım Direktörü', 'CMIT', 'Yazılım Direktörü'),
('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b92', 0, NOW(), NOW(), 'Muhammet Ali KAYA', 'Bilge Adam', 'Senior Lecturer', 'BeeMe', 'CTO'),
('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b93', 0, NOW(), NOW(), 'Evren TAN', 'Pointr', 'VP of DevOps', 'Etiya', 'Yazılım Direktörü'),
('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b94', 0, NOW(), NOW(), 'Özgür Doğuş SÖNMEZ', 'INDISOL Bilişim ve Teknoloji', 'Solution Architect', 'Etiya', 'Solution Development Manager'),
('f000b957-3f3f-4e0e-9e7b-7b7b7b7b7b95', 0, NOW(), NOW(), 'Cihad ALAN', 'Xerini', 'Senior FullStack Developer', 'KeyData', 'Senior FullStack Developer');


