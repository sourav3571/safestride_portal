# Emergency Dashboard Implementation Plan

## Goal Description
Transform the "Activate Safe Mode" feature from a simple demo toggle into a **full-scale Emergency Dashboard**. When activated, the standard landing page view should disappear, replaced by a cohesive, high-alert dashboard that tracks location, audio, and contacts in real-time.

## User Review Required
> [!IMPORTANT]
> This significantly changes the user flow. Clicking "Safe Mode" will now swap the entire page view, hiding the feature marketing list until deactivated.

## Proposed Changes

### New Component
#### [NEW] [EmergencyDashboard.tsx](file:///C:/Users/SOURAV%20KUMAR/Downloads/safestride-portal-main/src/components/EmergencyDashboard.tsx)
-   **Layout**: Grid layout optimized for monitoring.
-   **Sections**:
    -   **Main Map**: Occupies prominent space (Trip Sharing).
    -   **Status Bar**: Shows "Voice Active", "Shake Detection On", "Battery Optimized".
    -   **Live Feed**: Merges "Community Reports" and "Smart Alerts".
    -   **Guardian Status**: Shows connections to Mom/Dad/etc.

### Modified Page
#### [MODIFY] [Features.tsx](file:///C:/Users/SOURAV%20KUMAR/Downloads/safestride-portal-main/src/pages/Features.tsx)
-   Refactor rendering logic:
    -   If `safeModeActive` is TRUE -> Render `<EmergencyDashboard />`
    -   If `safeModeActive` is FALSE -> Render standard marketing list (`features.map...`)
-   Update the initial "Activate" button to be the gateway to this dashboard.

## Verification
-   Click "Activate Safe Mode".
-   Confirm the page transitions to a dashboard view.
-   Verify all simulated monitors (Map, Voice, etc.) are active in this dashboard.
-   Click "Deactivate" to return to the standard features list.
