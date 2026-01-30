from __future__ import annotations

import os
from typing import Optional

from dotenv import load_dotenv

load_dotenv()


def get_env(name: str, default: Optional[str] = None) -> str:
    value = os.getenv(name, default)
    if value is None or value == "":
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


PAMELA_API_KEY = get_env("PAMELA_API_KEY")
PAMELA_BASE_URL = os.getenv("PAMELA_BASE_URL", "https://api.thisispamela.com")
