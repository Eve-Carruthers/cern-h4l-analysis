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


def _get_required_key(data: dict[str, Any], *keys: str, config_path: Path) -> Any:
    """Get a required key from nested dict, raising ValueError with clear message if missing."""
    current = data
    path_parts: list[str] = []
    for key in keys:
        path_parts.append(key)
        if not isinstance(current, dict):
            raise ValueError(
                f"Configuration error in {config_path}: "
                f"Expected '{'.'.join(path_parts)}' to be a section, got {type(current).__name__}"
            )
        if key not in current:
            raise ValueError(
                f"Configuration error in {config_path}: "
                f"Missing required key '{'.'.join(path_parts)}'"
            )
        current = current[key]
    return current


def _validate_type(value: Any, expected_type: type, field_name: str, config_path: Path) -> None:
    """Validate that a configuration value has the expected type."""
    if not isinstance(value, expected_type):
        raise ValueError(
            f"Configuration error in {config_path}: "
            f"Expected '{field_name}' to be {expected_type.__name__}, "
            f"got {type(value).__name__}"
        )


def _validate_string_dict(value: Any, field_name: str, config_path: Path) -> None:
    """Validate that a value is a dict with string values."""
    if not isinstance(value, dict):
        raise ValueError(
            f"Configuration error in {config_path}: "
            f"Expected '{field_name}' to be a mapping, got {type(value).__name__}"
        )
    for k, v in value.items():
        if not isinstance(v, str):
            raise ValueError(
                f"Configuration error in {config_path}: "
                f"Expected '{field_name}.{k}' to be a string, got {type(v).__name__}"
            )


def load_config(config_path: Path | None = None, project_root: Path | None = None) -> Config:
    """Load configuration from YAML file.

    Args:
        config_path: Path to config file. If None, searches in project root.
        project_root: Project root directory. If None, auto-detected.

    Returns:
        Loaded configuration object.

    Raises:
        FileNotFoundError: If config file doesn't exist.
        ValueError: If config file is invalid or missing required keys.
    """
    if project_root is None:
        project_root = find_project_root()

    if config_path is None:
        config_path = project_root / "configs" / "config.yaml"

    if not config_path.exists():
        raise FileNotFoundError(f"Configuration file not found: {config_path}")

    try:
        with open(config_path, encoding='utf-8') as f:
            data = yaml.safe_load(f)
    except yaml.YAMLError as e:
        raise ValueError(f"Invalid YAML syntax in {config_path}: {e}") from e

    if data is None:
        raise ValueError(f"Configuration file is empty: {config_path}")

    if not isinstance(data, dict):
        raise ValueError(
            f"Configuration error in {config_path}: "
            f"Expected a YAML mapping at root level, got {type(data).__name__}"
        )

    # Validate required sections exist
    for section in ["upstream", "level2", "level3"]:
        if section not in data:
            raise ValueError(
                f"Configuration error in {config_path}: Missing required section '{section}'"
            )

    upstream = UpstreamConfig(
        repo_url=_get_required_key(data, "upstream", "repo_url", config_path=config_path),
        local_path=_get_required_key(data, "upstream", "local_path", config_path=config_path),
        pinned_commit=data["upstream"].get("pinned_commit"),
    )

    paths_data = data.get("paths", {})
    _validate_type(paths_data, dict, "paths", config_path)
    outputs_data = paths_data.get("outputs", {})
    _validate_string_dict(outputs_data, "paths.outputs", config_path)
    _validate_type(paths_data.get("logs", "logs"), str, "paths.logs", config_path)
    _validate_type(paths_data.get("third_party", "third_party"), str, "paths.third_party", config_path)
    paths = PathsConfig(
        outputs=outputs_data,
        logs=paths_data.get("logs", "logs"),
        third_party=paths_data.get("third_party", "third_party"),
    )

    level2 = Level2Config(
        macro_name=_get_required_key(data, "level2", "macro_name", config_path=config_path),
        output_plot=_get_required_key(data, "level2", "output_plot", config_path=config_path),
        final_plot_name=_get_required_key(data, "level2", "final_plot_name", config_path=config_path),
    )

    level3 = Level3Config(
        docker_image=_get_required_key(data, "level3", "docker_image", config_path=config_path),
        cmssw_version=_get_required_key(data, "level3", "cmssw_version", config_path=config_path),
        data_config=_get_required_key(data, "level3", "data_config", config_path=config_path),
        mc_config=_get_required_key(data, "level3", "mc_config", config_path=config_path),
        macro_name=_get_required_key(data, "level3", "macro_name", config_path=config_path),
        output_plot=_get_required_key(data, "level3", "output_plot", config_path=config_path),
        final_plot_name=_get_required_key(data, "level3", "final_plot_name", config_path=config_path),
    )

    metadata_data = data.get("metadata", {})
    _validate_type(metadata_data, dict, "metadata", config_path)
    _validate_type(metadata_data.get("include_host_info", True), bool, "metadata.include_host_info", config_path)
    _validate_type(metadata_data.get("include_timestamps", True), bool, "metadata.include_timestamps", config_path)
    _validate_type(metadata_data.get("include_commands", True), bool, "metadata.include_commands", config_path)
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
