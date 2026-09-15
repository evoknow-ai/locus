# Locus 1.1.0

Your projects. Your own pace.

A local Chrome extension for personal projects, checklists, notes, progress and time reports. Imagined by Mohammed Kabir. Developed by his agents.

## Install

1. Extract `Locus-1.1.0.zip` into a permanent folder. Keep this folder after installation.
2. Open `chrome://extensions` in Chrome (120 or newer).
3. Turn on **Developer mode** in the upper-right corner.
4. Choose **Load unpacked**, then select the extracted folder containing `manifest.json`.
5. Pin **Locus** from Chrome’s Extensions menu. Click the Locus icon to open it.

The toolbar opens a full-size workspace tab and reuses an existing Locus tab when available. No build, server, account or API key is required.

## Updating from 1.0

Export a JSON backup first. Replace the files in your **existing installed Locus folder**, then click **Reload** at `chrome://extensions`. Keep the folder path; do not remove the extension. This preserves the extension ID and local workspace. Chrome may ask you to enable the new downloads and alarms permissions.

Existing version-1 JSON backups remain supported. Theme style, backup frequency and onboarding preferences use additive defaults; no project data migration is needed.

## New in 1.1

- **Appearance:** Modern, Classic and Minimalist designs; each supports independent Light and Dark modes.
- **Automatic backups:** hourly, daily (default), weekly or off; a **Back up now** button; confirmed download status and failure reporting.
- **Guided onboarding:** a seven-step tour with safe practice controls appears on first use. Replay it from **User guide & tour**.
- **User guide:** an in-app, printable guide covering every workflow, also available in `USER-GUIDE.md`.

## Projects

Choose **New project**. Only the name is required. Add a short description, optional start/end dates, a color and optional progress from 0–100%. A dash means progress has not been set.

Choose alphabetical A–Z / Z–A, start date earliest/latest, end date earliest/latest, or **Custom order**. Undated projects sort last in date views. Custom order is preserved when you switch between sort options. Drag the ⋮⋮ handle to reorder; the up/down buttons provide a keyboard-friendly alternative. Search matches names and descriptions.

Click a project to change its progress, add a note or status update, manage tasks, or track time. Project progress is set manually, independently of task completion.

## Tasks and notes

Add a task using its name. Check it to complete it. Unchecking restores its previous progress. Use **Show completed** to hide or reveal checked tasks; completed items remain in the workspace until deleted.

Drag tasks using their handles or move them with arrow buttons. Click a task to edit its description, optional start/end dates and progress, and to add as many dated notes as needed. Project and task notes support editing and deletion. Notes are plain text, preserving line breaks and Unicode.

## Time tracking

- Start a timer on a project or a task. A visible timer stays at the bottom-right of the workspace.
- Only one timer runs at a time. Starting another stops and records the previous one.
- Timers keep running until stopped, including while the tab is closed, Chrome is closed or the computer is asleep. They measure elapsed clock time, not inferred attention.
- Use **Log time** for work already completed. Enter its start time and duration. **Edit** lets you correct or delete entries, including a timer you forgot to stop.
- Project totals include both direct project time and all its task time, each counted once.
- Manual entries may overlap; Locus treats them as intentional logged effort. Correct overlapping entries if they duplicate the same work.

## Reports

The Reports page includes project progress bars, a time-allocation donut, 14 days of activity, and a project/task table. Filter logged effort to all time or the last 7, 30 or 90 days. Average progress includes only projects with a progress value. Unset progress is excluded. Current progress and task totals are not historical snapshots.

Choose **Print / Save PDF**, then select **Save as PDF** in Chrome’s print dialog. Time totals are calculated when the report opens or its range changes. The floating timer updates every second.

## Appearance and onboarding

Open **Appearance** in the sidebar to choose a design. Modern uses rounded cards and violet accents. Classic uses warm paper colors and serif headings. Minimalist uses grayscale and simpler edges. Light and Dark are separate controls; preferences persist and are included in JSON exports. The sidebar brightness button is a shortcut.

The guided tour contains seven steps and highlights relevant controls. Its practice checkbox and slider do not change real data. Finish, Skip or Escape dismisses the tour and remembers that choice. **User guide & tour** includes a replay button and a printable guide.

## Automatic JSON backups

Open **Backup & restore** to choose hourly, daily, weekly or off. Daily is enabled by default; the first run is one full interval after setup. **Back up now** starts a download immediately, even when scheduled backups are off.

Scheduled and Back up now downloads use this convention:

`Downloads/Locus/Backups/2026-09/Locus_Auto_2026-09-15_10-00-00-123Z_4-projects_r23.json`

- `Auto` or `Manual` identifies how the backup started.
- The timestamp is UTC, includes milliseconds and is safe for Windows/macOS filenames.
- The project count and workspace revision make copies easy to distinguish.
- Existing files are never overwritten; Chrome uniquifies any collision. Backups are not automatically deleted.

The panel shows next run, an in-progress download, last successful filename/time and errors. Success is recorded only when Chrome reports download completion. Metadata survives service-worker restarts; pending downloads are reconciled against their own download IDs.

Chrome must be running for scheduled work. A missed run catches up once when Chrome resumes. Alarms are recreated when the worker starts. Device sleep may delay them. Browser download settings can still prompt for a destination. A failed download is shown in the panel; use Back up now after correcting it, or wait for the next scheduled interval.

Automatic backups contain the entire workspace and settings, including a running timer captured and paused in the exported copy. They do not stop the live timer. Internal recovery snapshots and download/scheduling metadata are not exported as project data.

Chrome API references: [Alarms](https://developer.chrome.com/docs/extensions/reference/api/alarms) and [Downloads](https://developer.chrome.com/docs/extensions/reference/api/downloads).

## Backup, restore and offload

**Backup & restore → Export JSON** downloads the entire workspace: projects, task order, descriptions, dates, progress history, notes, time entries and preferences. Export includes a running timer up to the export instant and pauses the exported copy. The live timer keeps running.

**Choose JSON file** validates a Locus version-1 backup before offering replacement. It shows project, task and note counts for review. Import replaces the workspace; it does not merge it. The previous workspace is saved in a local recovery snapshot. An imported active timer is stopped and recorded up to the time of import; normal Locus exports are already paused.

**Export & clear workspace** starts a download, then asks you to confirm the file was saved before clearing. A recovery snapshot is retained. **Restore recovery snapshot** swaps the current workspace and the most recent snapshot. Imports, clear operations and deletions replace this single snapshot; it is not a multi-version archive. Timers in recovery snapshots are paused at the time the snapshot was captured.

Chrome stores the data in this extension’s local storage in the current browser profile. It does not synchronize to other devices. There is no app-imposed project or note count limit; available storage and browser resources still apply. Export before uninstalling the extension or deleting its Chrome profile. Local backups are plain JSON, not encrypted.

## Credits and privacy

The footer includes Credits, version and MIT License. The credits page includes the requested attribution, EVOKNOW, Kabir’s X profile, the Locus GitHub repository and an in-app changelog. The GitHub link opens [evoknow-ai/locus](https://github.com/evoknow-ai/locus).

Permissions: `storage`, `unlimitedStorage`, `alarms` (scheduling) and `downloads` (saving JSON backup files). The download API is queried only for Locus backup download IDs. No host permissions, page content access, browsing-history access, analytics, external scripts, account or backend. Links on the Credits page open only when clicked.

Chrome API references: [Storage](https://developer.chrome.com/docs/extensions/reference/api/storage) and [Toolbar action](https://developer.chrome.com/docs/extensions/reference/api/action).

## Verification

Run `npm test` using a current Node.js release. No dependencies need to be installed.

28 automated tests passed for model behavior, JSON validation/round trips, time calculations, transaction isolation/failure handling, recovery, toolbar tab reuse, automatic scheduling/catch-up, interrupted downloads, worker restart recovery, UTC filenames and all six appearance preference combinations. Storage, backup service and toolbar tests use Chrome API mocks; they do not establish a live Chrome integration pass. JavaScript syntax and package references were checked.

The browser environment blocked local preview navigation, so actual unpacked installation, rendered layout and end-to-end Chrome interaction have **not** been verified. See `FEATURE-CHECKLIST.md` for the concrete Chrome smoke checks. This package is ready to load unpacked for that check; it has not been published to the Chrome Web Store.
