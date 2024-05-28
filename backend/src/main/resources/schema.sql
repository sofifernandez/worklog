CREATE TABLE IF NOT EXISTS PERSONA
(
    id               bigint auto_increment
        primary key,
    ci               varchar(26) not null,
    apellido         varchar(50) not null,
    nombre           varchar(50) not null,
    fecha_nacimiento date        null,
    fecha_alta       datetime(6) not null,
    fecha_modif      datetime(6) not null,
    numero_telefono  varchar(15) null,
    activo           bit         not null,
    constraint UNIQUE_PERSONA_CI
        unique (ci)
);

CREATE TABLE IF NOT EXISTS ROL
(
    id  bigint auto_increment
    primary key,
    rol varchar(15) null
    );

CREATE TABLE IF NOT EXISTS PERSONA_ROL
(
    id          bigint auto_increment
        primary key,
    persona_id  bigint      null,
    rol_id      bigint      null,
    activo      bit         not null,
    fecha_alta  datetime(6) not null,
    fecha_modif datetime(6) not null,
    constraint FK_PERSONAROL_PERSONA
        foreign key (persona_id) references persona (id),
    constraint FK_PERSONAROL_ROL
        foreign key (rol_id) references rol (id),
    CONSTRAINT UNIQUE_PERSONA_ROL UNIQUE (persona_id, rol_id)
);

CREATE TABLE IF NOT EXISTS OBRA
(
    id          bigint auto_increment
    primary key,
    nombre           varchar(50) not null,
    bps           varchar(50) not null,
    activo      bit         not null,
    fecha_alta  datetime(6) not null,
    fecha_modif datetime(6) not null,
    CONSTRAINT UNIQUE_OBRA UNIQUE (bps)
    );

CREATE TABLE IF NOT EXISTS USUARIO
(
    id          bigint auto_increment
    primary key,
    persona_id  bigint      not null,
    username           varchar(50) not null,
    password           varchar(50) not null,
    CONSTRAINT UNIQUE_USUARIO_USRNAME UNIQUE (username),
    CONSTRAINT UNIQUE_USUARIO_PERSONA UNIQUE (persona_id),
    constraint FK_USUARIO_PERSONA
    foreign key (persona_id) references persona (id)
    );


CREATE TABLE IF NOT EXISTS JEFE_OBRA
(
    id          bigint auto_increment
    primary key,
    persona_id  bigint      not null,
    obra_id  bigint      not null,
    fecha_alta  datetime(6) not null,
    fecha_modif datetime(6) not null,
    activo      bit         not null,
    CONSTRAINT UNIQUE_USUARIO_PERSONA UNIQUE (persona_id),
    CONSTRAINT FK_JO_PERSONA
    foreign key (persona_id) references persona (id),
    CONSTRAINT FK_JO_OBRA
    foreign key (obra_id) references obra (id)
    );