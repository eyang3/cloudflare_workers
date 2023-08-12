create table if not exists usertable (
    userid varchar(32) primary key,
    userimg varchar(128),
    username varchar(32)
);

create table if not exists locs (
    ipaddress cidr,
    userid varchar(32),
    ban boolean,
    unique(ipaddress, userid)
);


create index on locs(ipaddress);



