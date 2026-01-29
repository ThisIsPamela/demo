from typing import Any

from pamela import PamelaClient

from .config import PAMELA_API_KEY, PAMELA_BASE_URL


class PamelaService:
    def __init__(self) -> None:
        self.client = PamelaClient(api_key=PAMELA_API_KEY, base_url=PAMELA_BASE_URL)

    def create_call(self, to: str, task: str, locale: str) -> dict[str, Any]:
        return self.client.create_call(to=to, task=task, locale=locale)

    def get_call(self, call_id: str) -> dict[str, Any]:
        return self.client.get_call(call_id)
