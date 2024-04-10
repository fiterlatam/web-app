#!/bin/bash

FILE_NAME=""

if [ "$1" == "desarrollo" ] || [ "$1" == "dev" ] || [ "$1" == "development" ]; then
  FILE_NAME="docker-compose.dev.yaml"
elif [ "$1" == "main" ] || [ "$1" == "master" ]; then
  FILE_NAME="docker-compose.yaml"
elif [ "$1" == "qa" ] || [ "$1" == "pruebas" ] || [ "$1" == "QA" ]; then
  FILE_NAME="docker-compose.qa.yaml"
else
  echo "La rama $1 no está contemplada en el pipeline, por favor revisar a que rama se hace referencia"
  exit 1
fi

echo $FILE_NAME