#!/usr/bin/env python3
"""Prefect orchestration entry point for local or Docker batch execution."""
import argparse
import asyncio
from pathlib import Path
from prefect import flow, task
from prefect.cache_policies import INPUTS, TASK_SOURCE

from preprocess import run as preprocess_run
from render import render as render_run
from validate import validate as validate_run


@task(cache_policy=INPUTS + TASK_SOURCE, persist_result=True, retries=1, retry_delay_seconds=3)
def preprocess_task(project: str, processed: str):
    preprocess_run(Path(project), Path(processed)); return processed


@task(cache_policy=INPUTS + TASK_SOURCE, persist_result=True, retries=1, retry_delay_seconds=5)
def render_task(project: str, processed: str):
    return str(asyncio.run(render_run(Path(project), Path(processed))))


@task(retries=1, retry_delay_seconds=3)
def validate_task(video: str, report: str):
    validate_run(Path(video), Path(report)); return report


@flow(name='visual-science-video', log_prints=True)
def video_flow(project: str, processed: str, report: str):
    data=preprocess_task(project,processed)
    video=render_task(project,data)
    return validate_task(video,report)


if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('project');ap.add_argument('processed');ap.add_argument('report');a=ap.parse_args();video_flow(a.project,a.processed,a.report)
