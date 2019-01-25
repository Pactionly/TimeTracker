FROM python
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
RUN git clone https://github.com/TreasonableShorebirds/TimeTracker.git /code
RUN pip install --upgrade pip
RUN pip install -r /code/requirements.txt
