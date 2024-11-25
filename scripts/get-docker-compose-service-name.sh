#!/bin/bash

SERVICE_NAME=""

if [ "$1" == "desarrollo" ] || [ "$1" == "dev" ] || [ "$1" == "development" ]; then
  SERVICE_NAME="sm_loadbalancer_dev"
elif [ "$1" == "main" ] || [ "$1" == "master" ]; then
  SERVICE_NAME="sm_loadbalancer"
elif [ "$1" == "qa" ] || [ "$1" == "pruebas" ] || [ "$1" == "QA" ]; then
  SERVICE_NAME="sm_loadbalancer_qa"
else
  echo "La rama $1 no está contemplada en el pipeline, por favor revisar a que rama se hace referencia"
  exit 1
fi

echo $SERVICE_NAME