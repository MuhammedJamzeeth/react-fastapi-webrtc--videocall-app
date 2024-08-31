# Use an official Python runtime as a parent image
FROM python:3.11-slim

LABEL authors="muhammed jamzeeth"

# Set the working directory in the container
WORKDIR ./app

# Copy the current directory contents into the container
COPY . .

# Install any necessary dependencies
RUN python -m venv venv
RUN venv\Scripts\activate
RUN pip install pip-tools
RUN pip-compile --upgrade

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV PYTHONUNBUFFERED=1

# Run app.py when the container launches
CMD ["uvicorn", "app.main:app", "--reload"]
