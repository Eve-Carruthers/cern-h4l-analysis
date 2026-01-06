"""CLI for H4L Analysis - CMS H->4l Open Data Analysis Automation."""

import datetime
import json
import shutil
import subprocess
from enum import Enum
from pathlib import Path
from typing import Annotated, Optional

import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from h4l import __version__
from h4l.config import Config, load_config

app = typer.Typer(
    name="h4l",
    help="CMS H->4l Open Data Analysis Automation CLI",
    add_completion=False,
)
console = Console()


class AnalysisLevel(str, Enum):
    """Analysis levels available."""

    LEVEL2 = "level2"
    LEVEL3 = "level3"


def get_config() -> Config:
    """Load configuration with error handling."""
    try:
        return load_config()
    except FileNotFoundError as e:
        console.print(f"[red]Error:[/red] {e}")
        console.print("Run this command from the project root directory.")
        raise typer.Exit(1)
    except Exception as e:
        console.print(f"[red]Configuration error:[/red] {e}")
        raise typer.Exit(1)


def run_command(
    cmd: list[str],
    cwd: Path | None = None,
    capture: bool = False,
) -> subprocess.CompletedProcess[str]:
    """Run a shell command with proper error handling."""
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            check=True,
            capture_output=capture,
            text=True,
        )
        return result
    except subprocess.CalledProcessError as e:
        console.print(f"[red]Command failed:[/red] {' '.join(cmd)}")
        if e.stderr:
            console.print(f"[dim]{e.stderr}[/dim]")
        raise typer.Exit(e.returncode)
    except FileNotFoundError:
        console.print(f"[red]Command not found:[/red] {cmd[0]}")
        raise typer.Exit(1)


@app.callback(invoke_without_command=True)
def main(
    ctx: typer.Context,
    version: Annotated[
        bool,
        typer.Option("--version", "-v", help="Show version and exit."),
    ] = False,
) -> None:
    """CMS H->4l Open Data Analysis Automation CLI."""
    if version:
        console.print(f"h4l version {__version__}")
        raise typer.Exit()
    if ctx.invoked_subcommand is None:
        console.print(ctx.get_help())


@app.command()
def init(
    force: Annotated[
        bool,
        typer.Option("--force", "-f", help="Force re-clone even if directory exists."),
    ] = False,
) -> None:
    """Initialize the project by cloning the upstream CMS example repository."""
    config = get_config()
    upstream_path = config.get_upstream_path()

    console.print(Panel.fit(
        "[bold blue]H4L Analysis Initialization[/bold blue]",
        subtitle="Cloning upstream repository",
    ))

    # Check if already cloned
    if upstream_path.exists():
        if not force:
            console.print(f"[yellow]Upstream already exists at:[/yellow] {upstream_path}")
            console.print("Use --force to re-clone.")
            raise typer.Exit(0)
        console.print(f"[yellow]Removing existing directory:[/yellow] {upstream_path}")
        shutil.rmtree(upstream_path)

    # Create parent directory
    upstream_path.parent.mkdir(parents=True, exist_ok=True)

    # Clone repository
    console.print(f"[blue]Cloning:[/blue] {config.upstream.repo_url}")
    run_command(
        ["git", "clone", config.upstream.repo_url, str(upstream_path)],
        cwd=config.project_root,
    )

    # Checkout pinned commit if specified
    if config.upstream.pinned_commit:
        console.print(f"[blue]Checking out commit:[/blue] {config.upstream.pinned_commit}")
        run_command(
            ["git", "checkout", config.upstream.pinned_commit],
            cwd=upstream_path,
        )

    # Create output directories
    for level in ["level2", "level3"]:
        output_dir = config.get_output_path(level)
        output_dir.mkdir(parents=True, exist_ok=True)
        console.print(f"[green]Created:[/green] {output_dir}")

    # Create logs directory
    logs_dir = config.get_logs_path()
    logs_dir.mkdir(parents=True, exist_ok=True)
    console.print(f"[green]Created:[/green] {logs_dir}")

    console.print("\n[green]✓[/green] Initialization complete!")
    console.print("\nNext steps:")
    console.print("  1. Run [bold]h4l status[/bold] to verify setup")
    console.print("  2. Run [bold]h4l run level2[/bold] to run Level 2 analysis")


@app.command()
def status() -> None:
    """Show the current status of the project and analysis environment."""
    config = get_config()

    console.print(Panel.fit(
        "[bold blue]H4L Analysis Status[/bold blue]",
        subtitle=f"v{__version__}",
    ))

    # Project paths table
    table = Table(title="Project Paths", show_header=True)
    table.add_column("Component", style="cyan")
    table.add_column("Path", style="dim")
    table.add_column("Status", style="bold")

    # Check upstream
    upstream_path = config.get_upstream_path()
    upstream_status = "[green]✓ exists[/green]" if upstream_path.exists() else "[red]✗ missing[/red]"
    table.add_row("Upstream repo", str(upstream_path), upstream_status)

    # Check output directories
    for level in ["level2", "level3"]:
        output_path = config.get_output_path(level)
        output_status = "[green]✓ exists[/green]" if output_path.exists() else "[yellow]○ not created[/yellow]"
        table.add_row(f"Output ({level})", str(output_path), output_status)

    # Check logs
    logs_path = config.get_logs_path()
    logs_status = "[green]✓ exists[/green]" if logs_path.exists() else "[yellow]○ not created[/yellow]"
    table.add_row("Logs", str(logs_path), logs_status)

    console.print(table)

    # Tools availability table
    tools_table = Table(title="Required Tools", show_header=True)
    tools_table.add_column("Tool", style="cyan")
    tools_table.add_column("Status", style="bold")
    tools_table.add_column("Info", style="dim")

    # Check git
    git_available = shutil.which("git") is not None
    tools_table.add_row(
        "git",
        "[green]✓ available[/green]" if git_available else "[red]✗ not found[/red]",
        "Required for cloning",
    )

    # Check ROOT
    root_available = shutil.which("root") is not None
    tools_table.add_row(
        "ROOT",
        "[green]✓ available[/green]" if root_available else "[yellow]○ not found[/yellow]",
        "Required for Level 2",
    )

    # Check Docker
    docker_available = shutil.which("docker") is not None
    tools_table.add_row(
        "Docker",
        "[green]✓ available[/green]" if docker_available else "[yellow]○ not found[/yellow]",
        "Required for Level 3",
    )

    console.print(tools_table)

    # Configuration summary
    config_table = Table(title="Configuration", show_header=True)
    config_table.add_column("Setting", style="cyan")
    config_table.add_column("Value", style="dim")

    config_table.add_row("Upstream URL", config.upstream.repo_url)
    config_table.add_row("Pinned commit", config.upstream.pinned_commit or "(latest)")
    config_table.add_row("Level 2 macro", config.level2.macro_name)
    config_table.add_row("Level 3 Docker image", config.level3.docker_image)

    console.print(config_table)


@app.command()
def run(
    level: Annotated[
        AnalysisLevel,
        typer.Argument(help="Analysis level to run (level2 or level3)."),
    ],
    dry_run: Annotated[
        bool,
        typer.Option("--dry-run", "-n", help="Show what would be done without executing."),
    ] = False,
    save_metadata: Annotated[
        bool,
        typer.Option("--metadata/--no-metadata", help="Save run metadata to JSON."),
    ] = True,
) -> None:
    """Run the H->4l analysis at the specified level."""
    config = get_config()
    upstream_path = config.get_upstream_path()

    # Check if initialized
    if not upstream_path.exists():
        console.print("[red]Error:[/red] Project not initialized. Run [bold]h4l init[/bold] first.")
        raise typer.Exit(1)

    console.print(Panel.fit(
        f"[bold blue]Running {level.value.upper()} Analysis[/bold blue]",
    ))

    if level == AnalysisLevel.LEVEL2:
        _run_level2(config, dry_run, save_metadata)
    else:
        _run_level3(config, dry_run, save_metadata)


def _run_level2(config: Config, dry_run: bool, save_metadata: bool) -> None:
    """Run Level 2 analysis using ROOT macro."""
    upstream_path = config.get_upstream_path()
    level2_dir = upstream_path / "Level2"
    output_dir = config.get_output_path("level2")
    macro_path = level2_dir / config.level2.macro_name

    # Validate paths
    if not level2_dir.exists():
        console.print(f"[red]Error:[/red] Level2 directory not found: {level2_dir}")
        raise typer.Exit(1)

    if not macro_path.exists():
        console.print(f"[red]Error:[/red] ROOT macro not found: {macro_path}")
        raise typer.Exit(1)

    # Check ROOT is available
    if not shutil.which("root"):
        console.print("[red]Error:[/red] ROOT is not installed or not in PATH.")
        console.print("Install ROOT from: https://root.cern/install/")
        raise typer.Exit(1)

    console.print(f"[blue]Macro:[/blue] {macro_path}")
    console.print(f"[blue]Output:[/blue] {output_dir}")

    if dry_run:
        console.print("\n[yellow]Dry run - commands that would be executed:[/yellow]")
        console.print(f"  cd {level2_dir}")
        console.print(f"  root -l -b -q {config.level2.macro_name}")
        console.print(f"  cp {config.level2.output_plot} {output_dir / config.level2.final_plot_name}")
        return

    # Ensure output directory exists
    output_dir.mkdir(parents=True, exist_ok=True)

    # Run ROOT macro
    console.print("\n[blue]Running ROOT macro...[/blue]")
    start_time = datetime.datetime.now()

    run_command(
        ["root", "-l", "-b", "-q", config.level2.macro_name],
        cwd=level2_dir,
    )

    end_time = datetime.datetime.now()

    # Copy output plot
    src_plot = level2_dir / config.level2.output_plot
    dst_plot = output_dir / config.level2.final_plot_name

    if src_plot.exists():
        shutil.copy2(src_plot, dst_plot)
        console.print(f"[green]✓[/green] Output saved to: {dst_plot}")
    else:
        console.print(f"[yellow]Warning:[/yellow] Expected output not found: {src_plot}")

    # Save metadata
    if save_metadata:
        _save_metadata(config, "level2", start_time, end_time, output_dir)

    console.print("\n[green]✓[/green] Level 2 analysis complete!")


def _run_level3(config: Config, dry_run: bool, save_metadata: bool) -> None:
    """Run Level 3 analysis using Docker and CMSSW."""
    upstream_path = config.get_upstream_path()
    level3_dir = upstream_path / "Level3"
    output_dir = config.get_output_path("level3")

    # Validate paths
    if not level3_dir.exists():
        console.print(f"[red]Error:[/red] Level3 directory not found: {level3_dir}")
        raise typer.Exit(1)

    # Check Docker is available
    if not shutil.which("docker"):
        console.print("[red]Error:[/red] Docker is not installed or not in PATH.")
        console.print("Install Docker from: https://docs.docker.com/get-docker/")
        raise typer.Exit(1)

    console.print(f"[blue]Docker image:[/blue] {config.level3.docker_image}")
    console.print(f"[blue]CMSSW version:[/blue] {config.level3.cmssw_version}")
    console.print(f"[blue]Output:[/blue] {output_dir}")

    # Build docker command
    docker_cmd = [
        "docker", "run", "--rm",
        "-v", f"{level3_dir}:/work",
        "-w", "/work",
        config.level3.docker_image,
        "/bin/bash", "-c",
        f"source /opt/cms/cmsset_default.sh && cmsRun {config.level3.data_config}",
    ]

    if dry_run:
        console.print("\n[yellow]Dry run - commands that would be executed:[/yellow]")
        console.print(f"  {' '.join(docker_cmd)}")
        return

    # Ensure output directory exists
    output_dir.mkdir(parents=True, exist_ok=True)

    # Run Docker container
    console.print("\n[blue]Running CMSSW analysis in Docker...[/blue]")
    console.print("[dim]This may take a while on first run (downloading Docker image)...[/dim]")
    start_time = datetime.datetime.now()

    run_command(docker_cmd, cwd=config.project_root)

    end_time = datetime.datetime.now()

    # Copy output plot if it exists
    src_plot = level3_dir / config.level3.output_plot
    dst_plot = output_dir / config.level3.final_plot_name

    if src_plot.exists():
        shutil.copy2(src_plot, dst_plot)
        console.print(f"[green]✓[/green] Output saved to: {dst_plot}")
    else:
        console.print(f"[yellow]Warning:[/yellow] Expected output not found: {src_plot}")

    # Save metadata
    if save_metadata:
        _save_metadata(config, "level3", start_time, end_time, output_dir)

    console.print("\n[green]✓[/green] Level 3 analysis complete!")


def _save_metadata(
    config: Config,
    level: str,
    start_time: datetime.datetime,
    end_time: datetime.datetime,
    output_dir: Path,
) -> None:
    """Save run metadata to JSON file."""
    metadata: dict[str, object] = {
        "level": level,
        "h4l_version": __version__,
    }

    if config.metadata.include_timestamps:
        metadata["start_time"] = start_time.isoformat()
        metadata["end_time"] = end_time.isoformat()
        metadata["duration_seconds"] = (end_time - start_time).total_seconds()

    if config.metadata.include_host_info:
        import platform
        metadata["host"] = {
            "hostname": platform.node(),
            "platform": platform.system(),
            "platform_version": platform.version(),
            "python_version": platform.python_version(),
        }

    metadata_path = output_dir / "run_metadata.json"
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
    console.print(f"[dim]Metadata saved to: {metadata_path}[/dim]")


@app.command()
def clean(
    level: Annotated[
        Optional[AnalysisLevel],
        typer.Argument(help="Specific level to clean. If not specified, cleans all."),
    ] = None,
    all_outputs: Annotated[
        bool,
        typer.Option("--all", "-a", help="Also remove upstream repository."),
    ] = False,
    force: Annotated[
        bool,
        typer.Option("--force", "-f", help="Don't ask for confirmation."),
    ] = False,
) -> None:
    """Clean output files and optionally the upstream repository."""
    config = get_config()

    targets: list[tuple[str, Path]] = []

    if level is not None:
        # Clean specific level
        output_path = config.get_output_path(level.value)
        if output_path.exists():
            targets.append((f"{level.value} outputs", output_path))
    else:
        # Clean all output levels
        for lvl in ["level2", "level3"]:
            output_path = config.get_output_path(lvl)
            if output_path.exists():
                targets.append((f"{lvl} outputs", output_path))

    if all_outputs:
        upstream_path = config.get_upstream_path()
        if upstream_path.exists():
            targets.append(("upstream repository", upstream_path))

        logs_path = config.get_logs_path()
        if logs_path.exists():
            targets.append(("logs", logs_path))

    if not targets:
        console.print("[yellow]Nothing to clean.[/yellow]")
        return

    # Show what will be deleted
    console.print("[bold]The following will be deleted:[/bold]")
    for name, path in targets:
        console.print(f"  • {name}: [dim]{path}[/dim]")

    if not force:
        confirm = typer.confirm("Proceed?")
        if not confirm:
            console.print("[yellow]Aborted.[/yellow]")
            raise typer.Exit(0)

    # Delete targets
    for name, path in targets:
        if path.is_dir():
            shutil.rmtree(path)
        else:
            path.unlink()
        console.print(f"[green]✓[/green] Removed {name}")

    console.print("\n[green]✓[/green] Clean complete!")


@app.command(name="config")
def config_cmd() -> None:
    """Show current configuration."""
    cfg = get_config()

    console.print(Panel.fit(
        "[bold blue]H4L Configuration[/bold blue]",
        subtitle=str(cfg.project_root / "configs" / "config.yaml"),
    ))

    # Upstream section
    console.print("\n[bold cyan]Upstream Repository[/bold cyan]")
    console.print(f"  URL: {cfg.upstream.repo_url}")
    console.print(f"  Local path: {cfg.upstream.local_path}")
    console.print(f"  Pinned commit: {cfg.upstream.pinned_commit or '(latest)'}")

    # Paths section
    console.print("\n[bold cyan]Paths[/bold cyan]")
    for level, path in cfg.paths.outputs.items():
        console.print(f"  {level}: {path}")
    console.print(f"  logs: {cfg.paths.logs}")
    console.print(f"  third_party: {cfg.paths.third_party}")

    # Level 2 section
    console.print("\n[bold cyan]Level 2 Analysis[/bold cyan]")
    console.print(f"  Macro: {cfg.level2.macro_name}")
    console.print(f"  Output plot: {cfg.level2.output_plot}")
    console.print(f"  Final name: {cfg.level2.final_plot_name}")

    # Level 3 section
    console.print("\n[bold cyan]Level 3 Analysis[/bold cyan]")
    console.print(f"  Docker image: {cfg.level3.docker_image}")
    console.print(f"  CMSSW version: {cfg.level3.cmssw_version}")
    console.print(f"  Data config: {cfg.level3.data_config}")
    console.print(f"  MC config: {cfg.level3.mc_config}")
    console.print(f"  Macro: {cfg.level3.macro_name}")
    console.print(f"  Output plot: {cfg.level3.output_plot}")
    console.print(f"  Final name: {cfg.level3.final_plot_name}")


if __name__ == "__main__":
    app()
