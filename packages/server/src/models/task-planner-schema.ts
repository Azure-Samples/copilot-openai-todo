// The following is a schema definition for splitting a target
// goal into tasks needed to achieve the goal.
// For example, the goal "Plan a trip to Paris" could be split
// into the following list of tasks:
// - Decide on a budget for the trip to Paris
// - Choose a hotel to stay at Paris
// - Choose a flight to Paris
// - Choose activities to do in Paris

export interface TaskPlanner {
  // Tasks needed to be done to achieve the goal
  tasks: string[];
}
