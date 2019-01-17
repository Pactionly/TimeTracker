FROM python
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
ADD . /code
RUN pip install --upgrade pip
RUN pip install -r /code/requirements.txt
