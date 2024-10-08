CREATE TABLE IF NOT EXISTS persona
(
    id               bigint auto_increment
        primary key,
    ci               varchar(26) not null,
    apellido         varchar(50) not null,
    nombre           varchar(50) not null,
    fecha_nacimiento date        null,
    fecha_alta       datetime(6) not null,
    fecha_modif      datetime(6) null,
    numero_telefono  varchar(15) null,
    activo           bit         not null,
    constraint UNIQUE_PERSONA_CI
        unique (ci)
);

CREATE TABLE IF NOT EXISTS rol
(
    id  bigint auto_increment
    primary key,
    rol varchar(15) null
    );

CREATE TABLE IF NOT EXISTS persona_rol
(
    id          bigint auto_increment
        primary key,
    persona_id  bigint      null,
    rol_id      bigint      null,
    activo      bit         not null,
    fecha_alta  datetime(6) not null,
    fecha_modif datetime(6) null,
    constraint FK_PERSONAROL_PERSONA
        foreign key (persona_id) references persona (id),
    constraint FK_PERSONAROL_ROL
        foreign key (rol_id) references rol (id),
    CONSTRAINT UNIQUE_PERSONA_ROL UNIQUE (persona_id, rol_id)
);

CREATE TABLE IF NOT EXISTS obra
(
    id          bigint auto_increment
    primary key,
    nombre           varchar(50) not null,
    bps           varchar(50) not null,
    activo      bit         not null,
    fecha_alta  datetime(6) not null,
    fecha_modif datetime(6) null,
    codigo_qr   longblob null,
    CONSTRAINT UNIQUE_OBRA UNIQUE (bps)
    );

CREATE TABLE IF NOT EXISTS usuario
(
    id          bigint auto_increment
    primary key,
    persona_id  bigint      not null,
    username           varchar(50) not null,
    password           varchar(50) not null,
    password_reset_required      bit not null,
    CONSTRAINT UNIQUE_USUARIO_USRNAME UNIQUE (username),
    CONSTRAINT UNIQUE_USUARIO_PERSONA UNIQUE (persona_id),
    constraint FK_USUARIO_PERSONA
    foreign key (persona_id) references persona (id)
    );


CREATE TABLE IF NOT EXISTS jefe_obra
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

CREATE TABLE IF NOT EXISTS tipo_jornal
(
    id  bigint auto_increment
    primary key,
    tipo_jornal varchar(6) null
    );

# INSERT INTO TIPO_JORNAL VALUES(DEFAULT, 'COMUN'), (DEFAULT, 'LLUVIA'), (DEFAULT, 'EXTRA');
# INSERT INTO Rol VALUES(DEFAULT, 'ADMINISTRADOR'), (DEFAULT, 'JEFE_OBRA'), (DEFAULT, 'TRABAJADOR');

CREATE TABLE IF NOT EXISTS jornal
(
    id          bigint auto_increment
    primary key,
    persona_id  bigint      not null,
    obra_id  bigint      not null,
    fecha_jornal  date   not null,
    hora_comienzo datetime(6)   not null,
    hora_fin datetime(6)    null,
    modificado      bit         not null,
    tipo_jornal      bigint      not null,
    confirmado bit not null,
    CONSTRAINT FK_JORNAL_PERSONA
    foreign key (persona_id) references persona (id),
    CONSTRAINT FK_JORNAL_OBRA
    foreign key (obra_id) references obra (id),
    CONSTRAINT FK_JORNAL_TIPO_JORNAL
    foreign key (tipo_jornal) references tipo_jornal (id)
    );

CREATE TABLE IF NOT EXISTS modificacion(
    id          bigint auto_increment primary key,
    responsable_id bigint      not null,
    jornal_id bigint      not null,
    fecha_modificacion datetime(6) not null,
    campo_modificado varchar(50) not null,
    valor_anterior varchar(50) not null,
    valor_actual varchar(50) not null,
    motivo varchar(200) not null,
    CONSTRAINT FK_MODIFICACION_JO FOREIGN KEY (responsable_id) references persona (id),
    CONSTRAINT FK_MODIFICACION_JORNAL FOREIGN KEY (jornal_id) references jornal (id)
    );

CREATE TABLE IF NOT EXISTS jornal_eliminado
(
    id          bigint     primary key,
    persona_id  bigint      not null,
    obra_id  bigint      not null,
    fecha_jornal  date   not null,
    hora_comienzo datetime(6)   not null,
    hora_fin datetime(6)    null,
    modificado      bit         not null,
    tipo_jornal      bigint      not null,
    confirmado bit not null,
    responsable_id  bigint      not null,
    fecha_eliminado datetime(6)   not null,
    CONSTRAINT FK_JORNALELIMINADO_PERSONA
    foreign key (persona_id) references persona (id),
    CONSTRAINT FK_JORNALELIMINADO_OBRA
    foreign key (obra_id) references obra (id),
    CONSTRAINT FK_JORNALELIMINADO_TIPO_JORNAL
    foreign key (tipo_jornal) references tipo_jornal (id),
    CONSTRAINT FK_JORNALELIMINADO_RESPONSABLE
    foreign key (responsable_id) references persona (id)
    );