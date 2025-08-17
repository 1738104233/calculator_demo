@echo off
setlocal

set PROTO_PATH=D:\work\code\project\go\calculator_project\calculator_go\proto
set OUT_DIR=D:\work\code\project\go\calculator_project\calculator_nextJS\public\src\gen

npx protoc ^
  --proto_path=%PROTO_PATH% ^
  --connect-web_out=%OUT_DIR% ^
  --connect-web_opt=target=ts ^
  --es_out=%OUT_DIR% ^
  --es_opt=target=ts ^
  %PROTO_PATH%\calculator.proto

endlocal