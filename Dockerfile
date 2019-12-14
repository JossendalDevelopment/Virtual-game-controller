FROM python:3.8

LABEL Author="Kevin Jossendal"
LABEL version="0.0.1a"

ENV PYTHONDONTWRITEBYTECODE 1
ENV FLASK_APP "server/main.py"
ENV FLASK_ENV "development"
ENV FLASK_DEBUG True

RUN mkdir /app
WORKDIR /app

COPY Pip* /app/

RUN pip install --upgrade pip && \
    pip install pipenv && \
    pipenv install --dev --system --deploy --ignore-pipfile

ADD . /app

EXPOSE 8080

CMD flask run --host=0.0.0.0