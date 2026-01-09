import Link from "next/link";
import {
  BarChart3,
  Calculator,
  GitBranch,
  FileText,
  Atom,
  ExternalLink,
  Github,
  LucideIcon
} from "lucide-react";
import { getTotalStats } from "@/lib/data";

const features = [
  {
    href: "/mass-plot",
    icon: BarChart3,
    title: "Interactive Mass Plot",
    description: "Explore the 4-lepton invariant mass distribution with zoom, hover, and filtering",
    color: "from-blue-500 to-cyan-500",
  },
  {
    href: "/statistics",
    icon: Calculator,
    title: "Significance Calculator",
    description: "Calculate p-values and significance of the observed Higgs excess",
    color: "from-purple-500 to-pink-500",
  },
  {
    href: "/channels",
    icon: GitBranch,
    title: "Channel Comparison",
    description: "Compare 4e, 4μ, and 2e2μ decay channels side by side",
    color: "from-green-500 to-emerald-500",
  },
  {
    href: "/report",
    icon: FileText,
    title: "Reproducibility Report",
    description: "Generate comprehensive analysis documentation for publication",
    color: "from-orange-500 to-amber-500",
  },
  {
    href: "/event-display",
    icon: Atom,
    title: "Event Display",
    description: "3D visualization of selected Higgs candidate events",
    color: "from-red-500 to-rose-500",
  },
];

export default function Home() {
  const { totalObserved, totalBackground, totalSignal } = getTotalStats();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          CMS Open Data Analysis
        </div>

        <h1 className="text-5xl md:text-6xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            H → ZZ* → 4ℓ
          </span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Interactive visualization of the Higgs boson discovery analysis
          using CMS Open Data from the 2011-2012 LHC runs
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/mass-plot"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            Explore Analysis
          </Link>
          <a
            href="https://github.com/cms-opendata-analyses/HiggsExample20112012"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            View Source
          </a>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Observed Events"
          value={totalObserved.toString()}
          sublabel="Signal region (120-130 GeV)"
          color="blue"
        />
        <StatCard
          label="Expected Background"
          value={totalBackground.toFixed(1)}
          sublabel="ZZ + reducible"
          color="slate"
        />
        <StatCard
          label="Expected Signal"
          value={totalSignal.toFixed(1)}
          sublabel="m_H = 125 GeV"
          color="red"
        />
        <StatCard
          label="Local Significance"
          value="~5σ"
          sublabel="Discovery threshold!"
          color="green"
        />
      </section>

      {/* Feature Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Analysis Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.href} {...feature} />
          ))}
        </div>
      </section>

      {/* Physics Context */}
      <section className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
        <h2 className="text-2xl font-bold mb-4">About This Analysis</h2>
        <div className="grid md:grid-cols-2 gap-8 text-slate-300">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">The Discovery</h3>
            <p>
              On July 4, 2012, the CMS and ATLAS experiments at CERN announced
              the discovery of a new particle consistent with the Higgs boson.
              The H→ZZ*→4ℓ channel was one of the two &quot;golden channels&quot; that
              provided the clearest evidence.
            </p>
            <p>
              This analysis reproduces that historic discovery using publicly
              available CMS Open Data from the 2011-2012 LHC runs.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">The Physics</h3>
            <p>
              The Higgs boson decays to two Z bosons, which each decay to a
              pair of leptons (electrons or muons). The four-lepton invariant
              mass shows a clear peak at ~125 GeV above the smooth background.
            </p>
            <div className="font-mono bg-slate-800 p-4 rounded-lg text-center">
              H → ZZ* → ℓ⁺ℓ⁻ℓ⁺ℓ⁻
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  sublabel,
  color
}: {
  label: string;
  value: string;
  sublabel: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
    slate: "from-slate-500/20 to-slate-500/5 border-slate-500/30",
    red: "from-red-500/20 to-red-500/5 border-red-500/30",
    green: "from-green-500/20 to-green-500/5 border-green-500/30",
  };

  return (
    <div className={`
      bg-gradient-to-br ${colorClasses[color]}
      rounded-xl p-6 border
    `}>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-slate-500 text-xs mt-1">{sublabel}</p>
    </div>
  );
}

function FeatureCard({
  href,
  icon: Icon,
  title,
  description,
  color
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group block p-6 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1"
    >
      <div className={`
        w-12 h-12 rounded-lg bg-gradient-to-br ${color}
        flex items-center justify-center mb-4
        group-hover:scale-110 transition-transform duration-300
      `}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        {title}
        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </Link>
  );
}
