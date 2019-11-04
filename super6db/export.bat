@echo off

SET DIR=%~dp0
cd %DIR%

rem Need to ensure this actually works on Windows.
pushd %DIR%/..
mongodump -d super6db -o %CD%
popd