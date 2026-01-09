"""Basic tests for configuration loading."""

import pytest
from pathlib import Path

from h4l.config import load_config, find_project_root


def test_find_project_root():
    """Test that project root can be found."""
    root = find_project_root()
    assert root is not None
    assert (root / "pyproject.toml").exists()


def test_load_config():
    """Test that config.yaml can be loaded."""
    root = find_project_root()
    config = load_config(root / "configs" / "config.yaml")
    assert config is not None
    assert config.upstream.repo_url is not None
    assert config.level2.macro_name is not None
    assert config.level3.docker_image is not None
