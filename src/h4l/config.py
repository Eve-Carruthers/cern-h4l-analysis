"""Configuration loading and management for H4L analysis."""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml


@dataclass
class UpstreamConfig:
    """Configuration for upstream repository."""

    repo_url: str
    local_path: str
    pinned_commit: str | None = None


@dataclass
class PathsConfig:
    """Configuration for output paths."""

    outputs: dict[str, str] = field(default_factory=dict)
    logs: str = "logs"
    third_party: str = "third_party"


@dataclass
class Level2Config:
    """Configuration for Level 2 analysis."""

    macro_name: str
    output_plot: str
    final_plot_name: str


@dataclass
class Level3Config:
    """Configuration for Level 3 analysis."""

    docker_image: str
    cmssw_version: str
    data_config: str
    mc_config: str
    macro_name: str
    output_plot: str
    final_plot_name: str


@dataclass
class MetadataConfig:
    """Configuration for run metadata."""

    include_host_info: bool = True
    include_timestamps: bool = True
    include_commands: bool = True


@dataclass
class Config:
    """Main configuration container."""

    upstream: UpstreamConfig
    paths: PathsConfig
    level2: Level2Config
    level3: Level3Config
    metadata: MetadataConfig
    project_root: Path = field(default_factory=Path.cwd)

    def get_upstream_path(self) -> Path:
        """Get absolute path to upstream repository."""
        return self.project_root / self.upstream.local_path

    def get_output_path(self, level: str) -> Path:
        """Get absolute path to output directory for a level."""
        return self.project_root / self.paths.outputs.get(level, f"outputs/{level}")

    def get_logs_path(self) -> Path:
        """Get absolute path to logs directory."""
        return self.project_root / self.paths.logs

    def get_third_party_path(self) -> Path:
        """Get absolute path to third-party directory."""
        return self.project_root / self.paths.third_party


def find_project_root(start_path: Path | None = None) -> Path:
    """Find project root by looking for pyproject.toml or configs directory."""
    if start_path is None:
        start_path = Path.cwd()

    current = start_path.resolve()
    while current != current.parent:
        if (current / "pyproject.toml").exists() or (current / "configs").exists():
            return current
        current = current.parent

    return start_path.resolve()


def load_config(config_path: Path | None = None, project_root: Path | None = None) -> Config:
    """Load configuration from YAML file.

    Args:
        config_path: Path to config file. If None, searches in project root.
        project_root: Project root directory. If None, auto-detected.

    Returns:
        Loaded configuration object.

    Raises:
        FileNotFoundError: If config file doesn't exist.
        ValueError: If config file is invalid.
    """
    if project_root is None:
        project_root = find_project_root()

    if config_path is None:
        config_path = project_root / "configs" / "config.yaml"

    if not config_path.exists():
        raise FileNotFoundError(f"Configuration file not found: {config_path}")

    with open(config_path) as f:
        data: dict[str, Any] = yaml.safe_load(f)

    if data is None:
        raise ValueError(f"Empty configuration file: {config_path}")

    upstream = UpstreamConfig(
        repo_url=data["upstream"]["repo_url"],
        local_path=data["upstream"]["local_path"],
        pinned_commit=data["upstream"].get("pinned_commit"),
    )

    paths_data = data.get("paths", {})
    paths = PathsConfig(
        outputs=paths_data.get("outputs", {}),
        logs=paths_data.get("logs", "logs"),
        third_party=paths_data.get("third_party", "third_party"),
    )

    level2_data = data["level2"]
    level2 = Level2Config(
        macro_name=level2_data["macro_name"],
        output_plot=level2_data["output_plot"],
        final_plot_name=level2_data["final_plot_name"],
    )

    level3_data = data["level3"]
    level3 = Level3Config(
        docker_image=level3_data["docker_image"],
        cmssw_version=level3_data["cmssw_version"],
        data_config=level3_data["data_config"],
        mc_config=level3_data["mc_config"],
        macro_name=level3_data["macro_name"],
        output_plot=level3_data["output_plot"],
        final_plot_name=level3_data["final_plot_name"],
    )

    metadata_data = data.get("metadata", {})
    metadata = MetadataConfig(
        include_host_info=metadata_data.get("include_host_info", True),
        include_timestamps=metadata_data.get("include_timestamps", True),
        include_commands=metadata_data.get("include_commands", True),
    )

    return Config(
        upstream=upstream,
        paths=paths,
        level2=level2,
        level3=level3,
        metadata=metadata,
        project_root=project_root,
    )
