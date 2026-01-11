.PHONY: all venv install run test

VENV=.venv
PY=${VENV}/bin/python
PIP=${VENV}/bin/pip

all: venv install run

venv:
	python3 -m venv ${VENV}
	${VENV}/bin/pip install --upgrade pip

install: venv
	${PIP} install -e .[dev]

run: install
	${PY} 0verflow.py --serve-api

test: install
	${VENV}/bin/pytest -q
