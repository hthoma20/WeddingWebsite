create table Invitation (
	guest_id int AUTOINCREMENT,
    is_guest bool,
    first_name varchar(100),
    last_name varchar(100),
    group_id int,
    ceremony bool,
    reception bool,
    attending_ceremony bool default null,
    attending_reception bool default null,
    
    primary key(guest_id)
);

create table Songs (
	SongId int AUTOINCREMENT,
    Title varchar(100),
    Artist varchar(100),
    
    primary key(SongId)
);