// ============================================================
// Real-Time Data Pipeline (Include 5)
// Simulated ingestion → cleaning → normalization → validation → features → scoring → dashboard
// ============================================================
import { PipelineStage, PipelineStatus, PipelineStageName } from './types';

const STAGE_ORDER: PipelineStageName[] = [
    'ingestion', 'cleaning', 'normalization', 'validation', 'featureEngineering', 'scoring', 'dashboard',
];

const STAGE_LABELS: Record<PipelineStageName, string> = {
    ingestion: 'Data Ingestion',
    cleaning: 'Data Cleaning',
    normalization: 'Normalization',
    validation: 'Validation',
    featureEngineering: 'Feature Engineering',
    scoring: 'AI Scoring',
    dashboard: 'Dashboard Sync',
};

const STAGE_RECORDS: Record<PipelineStageName, number> = {
    ingestion: 15000,
    cleaning: 14800,
    normalization: 14800,
    validation: 14750,
    featureEngineering: 14750,
    scoring: 14700,
    dashboard: 14700,
};

// ── Generate Pipeline Status ──
export function generatePipelineStatus(): PipelineStatus {
    const now = Date.now();
    const stages: PipelineStage[] = STAGE_ORDER.map((name, i) => {
        const elapsed = (now % 30000) / 30000; // 30-second cycle
        const stageStart = i / STAGE_ORDER.length;
        const stageDuration = 1 / STAGE_ORDER.length;
        let progress: number;
        let status: PipelineStage['status'];

        if (elapsed < stageStart) {
            status = 'idle';
            progress = 0;
        } else if (elapsed < stageStart + stageDuration) {
            status = 'running';
            progress = Math.round(((elapsed - stageStart) / stageDuration) * 100);
        } else {
            status = 'completed';
            progress = 100;
        }

        // Simulate occasional errors (rare)
        const hasError = Math.random() < 0.02;
        if (hasError && status === 'completed') {
            status = 'error';
        }

        return {
            name,
            status,
            progress,
            recordsProcessed: Math.round(STAGE_RECORDS[name] * (progress / 100)),
            lastUpdated: now - Math.round(Math.random() * 5000),
            errorCount: hasError ? 1 : 0,
        };
    });

    const errorStages = stages.filter(s => s.status === 'error').length;
    const overallHealth = errorStages > 1 ? 'critical' : errorStages > 0 ? 'degraded' : 'healthy';

    return {
        stages,
        overallHealth,
        throughput: Math.round(450 + Math.random() * 150),
        uptime: Math.round((99.5 + Math.random() * 0.4) * 100) / 100,
        lastFullSync: now - Math.round(Math.random() * 60000),
    };
}

// ── Stage Labels ──
export function getStageName(stage: PipelineStageName): string {
    return STAGE_LABELS[stage];
}

// ── Pipeline Health History ──
export function generateHealthHistory(hours: number = 24): Array<{ time: string; throughput: number; health: number }> {
    const history: Array<{ time: string; throughput: number; health: number }> = [];
    const now = Date.now();
    for (let i = hours; i >= 0; i--) {
        const time = new Date(now - i * 3600000);
        history.push({
            time: `${time.getHours().toString().padStart(2, '0')}:00`,
            throughput: Math.round(400 + Math.random() * 200),
            health: Math.round(95 + Math.random() * 5),
        });
    }
    return history;
}

// ── Pipeline Metrics ──
export function getPipelineMetrics(): {
    totalRecordsToday: number;
    avgLatency: number;
    errorRate: number;
    dataFreshness: string;
    sourceCount: number;
    featureCount: number;
} {
    return {
        totalRecordsToday: Math.round(350000 + Math.random() * 50000),
        avgLatency: Math.round((45 + Math.random() * 30) * 10) / 10,
        errorRate: Math.round(Math.random() * 0.5 * 100) / 100,
        dataFreshness: `${Math.round(2 + Math.random() * 5)} seconds ago`,
        sourceCount: 6,
        featureCount: 23,
    };
}
