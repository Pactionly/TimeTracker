FROM python
RUN mkdir /code
ADD . /code
RUN pip install --upgrade pip
RUN pip install -r /code/requirements.txt
