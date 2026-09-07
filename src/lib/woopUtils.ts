export interface ParsedIfThenPlan {
  condition: string;
  action: string;
}

/**
 * Parses any WOOP plan string and optional obstacle into a structured
 * If [trigger] / Then [action] pair for clear behavioral contrast.
 */
export function parseWoopPlan(plan: string, obstacle?: string): ParsedIfThenPlan {
  const cleanPlan = (plan || '').trim();
  const cleanObstacle = (obstacle || '').trim();

  if (!cleanPlan) {
    return {
      condition: cleanObstacle ? `If ${cleanObstacle.replace(/^if\s+/i, '')}` : 'If friction occurs',
      action: 'Then take the smallest immediate step',
    };
  }

  // 1. Check for standard "If [trigger], then [action]" or "If [trigger] then [action]"
  const ifThenMatch = cleanPlan.match(/^if\s+(.+?)(?:,\s*|\s+)then\s+(.+)$/i);
  if (ifThenMatch) {
    const rawCond = ifThenMatch[1].trim();
    const rawAction = ifThenMatch[2].trim();
    const actionClean = rawAction.replace(/^then\s*/i, '');
    return {
      condition: `If ${rawCond.replace(/^if\s+/i, '')}`,
      action: `Then ${actionClean}`,
    };
  }

  // 2. Check if plan starts with "Then [action]"
  if (/^then\s+/i.test(cleanPlan)) {
    const actionPart = cleanPlan.replace(/^then\s*(i will\s*)?:?\s*/i, '');
    const trigger = cleanObstacle
      ? cleanObstacle.replace(/^if\s+/i, '')
      : 'friction or fatigue occurs';
    return {
      condition: `If ${trigger}`,
      action: `Then ${actionPart}`,
    };
  }

  // 3. If plan starts with "If ..." without explicit "then"
  if (/^if\s+/i.test(cleanPlan)) {
    return {
      condition: cleanPlan,
      action: '',
    };
  }

  // 4. Default: obstacle is the trigger condition, plan is the action
  const trigger = cleanObstacle
    ? cleanObstacle.replace(/^if\s+/i, '')
    : 'friction or fatigue occurs';
  const cleanAction = cleanPlan.replace(/^i will\s*:?\s*/i, 'I will ');
  return {
    condition: `If ${trigger}`,
    action: `Then ${cleanAction}`,
  };
}

/**
 * Formats a timestamp into a clean date string e.g. "Sep 6, 2026"
 */
export function formatWoopDate(timestamp?: number): string {
  if (!timestamp) return 'Recent';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Recent';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
