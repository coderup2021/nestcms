#!/bin/bash

user='root'
password='root'
databaseName='nest_cms'

#sqlcmd="mysql -u${user} -p${password}"
sqlcmd="mysql -u$user -p$password"

$sqlcmd -e "create database if not exists nest_cms default character set utf8mb4 collate utf8mb4_unicode_ci;"
