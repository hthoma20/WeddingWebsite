create table Invitation (
	guest_id integer primary key AUTOINCREMENT,
    is_guest bool,
    first_name varchar(100),
    last_name varchar(100),
    group_id int,
    ceremony bool,
    reception bool,
    attending_ceremony bool default null,
    attending_reception bool default null
);

create table Songs (
	SongId integer primary key AUTOINCREMENT,
    Title varchar(100),
    Artist varchar(100)
);