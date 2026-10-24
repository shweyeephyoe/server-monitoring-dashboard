/**
 * A permanent, always-visible notice that the data is fake.
 * This matters for a portfolio: reviewers should never mistake the demo for a
 * real monitoring system.
 */
export function DemoBanner() {
  return (
    <div className="demo-banner" role="note">
      <strong>DEMO</strong> — Simulated monitoring data. Not connected to real infrastructure.
    </div>
  );
}
