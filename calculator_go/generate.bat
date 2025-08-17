:: generate.bat
@echo off
setlocal

set PROTO_PATH=proto
set GO_OUT=gen
set CONNECT_GO_OUT=gen

protoc ^
  --proto_path=%PROTO_PATH% ^
  --go_out=%GO_OUT% ^
  --go_opt=paths=source_relative ^
  --connect-go_out=%CONNECT_GO_OUT% ^
  --connect-go_opt=paths=source_relative ^
  %PROTO_PATH%/calculator.proto

endlocal