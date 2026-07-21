FROM mcr.microsoft.com/playwright/python:v1.58.0-noble

RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg fonts-inter \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .

ENTRYPOINT ["python", "pipeline/flow.py"]
