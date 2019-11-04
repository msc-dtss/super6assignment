@echo off

SET DIR=%~dp0
cd %DIR%

mongorestore -d super6db %DIR%