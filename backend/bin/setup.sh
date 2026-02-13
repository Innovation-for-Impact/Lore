#!/bin/bash

# Exit immediately if a command fails
set -e

BACKEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_ROOT="$(cd "$BACKEND_ROOT/.." && pwd)"

source $BACKEND_ROOT/env/bin/activate

echo "Installing Python requirements..."
pip3 install -r $BACKEND_ROOT/requirements.txt

echo "Making Django migrations..."
python3 $BACKEND_ROOT/manage.py makemigrations

echo "Applying Django migrations..."
python3 $BACKEND_ROOT/manage.py migrate

echo "Installing frontend dependencies..."
cd $PROJECT_ROOT/frontend
npm install
cd ..

echo "Setup complete!"
