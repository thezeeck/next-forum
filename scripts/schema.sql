-- Eliminar tablas y tipos existentes (en orden inverso de dependencias)
DROP TABLE IF EXISTS moderation_actions;
DROP TABLE IF EXISTS private_messages;
DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS forum_config;
DROP TYPE IF EXISTS user_status;
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS moderation_action_type;

-- Crear tipos ENUM personalizados
CREATE TYPE user_status AS ENUM ('active', 'banned', 'suspended');
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE moderation_action_type AS ENUM ('delete_post', 'ban_user', 'close_topic', 'warning');

-- Tabla de Usuarios
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    avatar_url VARCHAR(255),
    bio TEXT,
    status user_status DEFAULT 'active',
    role user_role DEFAULT 'user'
);

-- Tabla de Categorías
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_category_id) 
        REFERENCES categories(category_id)
        ON DELETE SET NULL
);

-- Tabla de Temas/Hilos
CREATE TABLE topics (
    topic_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    views INT DEFAULT 0,
    is_sticky BOOLEAN DEFAULT FALSE,
    is_closed BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
        
    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

-- Tabla de Publicaciones
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INT NOT NULL,
    topic_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    is_first_post BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
        
    FOREIGN KEY (topic_id)
        REFERENCES topics(topic_id)
        ON DELETE CASCADE
);

-- Tabla de Likes/Me gusta
CREATE TABLE post_likes (
    like_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (user_id, post_id),
    
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
        
    FOREIGN KEY (post_id)
        REFERENCES posts(post_id)
        ON DELETE CASCADE
);

-- Tabla de Mensajes Privados
CREATE TABLE private_messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (sender_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
        
    FOREIGN KEY (receiver_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Tabla de Moderación
CREATE TABLE moderation_actions (
    action_id SERIAL PRIMARY KEY,
    moderator_id INT NOT NULL,
    target_user_id INT,
    target_post_id INT,
    action_type moderation_action_type NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (moderator_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
        
    FOREIGN KEY (target_user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL,
        
    FOREIGN KEY (target_post_id)
        REFERENCES posts(post_id)
        ON DELETE SET NULL
);

CREATE TABLE forum_config (
    forum_name VARCHAR(255) NOT NULL,
    forum_description TEXT NOT NULL,
    forum_admin_email VARCHAR(255) NOT NULL,
    forum_lang VARCHAR(255) NOT NULL,
    forum_theme VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_topics_category ON topics(category_id);
CREATE INDEX idx_posts_topic ON posts(topic_id);
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_messages_receiver ON private_messages(receiver_id);

-- Función y trigger para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers a las tablas
CREATE TRIGGER update_topics_modtime
BEFORE UPDATE ON topics
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_posts_modtime
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();