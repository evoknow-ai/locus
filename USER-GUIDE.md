# Locus 1.1 User Guide

Open **User guide & tour** in Locus for the illustrated walkthrough and printable in-app guide.

## 1. Give an idea a home

Choose **New project**. Only its name is required. Add a short description, optional start and end dates, a color and progress whenever you are ready. Click the card to open it. Use **Edit project** to change the details.

## 2. Choose your view

Use Search to find names or descriptions. Sort A–Z, Z–A, or by start/end date in either direction; projects without dates come last. Choose **Custom order** and drag the ⋮⋮ handle to arrange projects. Arrow buttons offer the same control without dragging. Your custom order is remembered.

## 3. Turn projects into small steps

Open a project and add tasks in the Checklist. Check a task to complete it; uncheck to restore its earlier progress. **Show completed** hides or reveals checked tasks. Drag the handles or use arrow buttons to change task order. Click a task to edit its description, dates, progress, time entries and notes.

## 4. Record progress and updates

Drag a progress slider from 0–100%. A dash means unset; **Clear progress** restores it. Overall project progress is independent of its task checklist. Add dated notes for decisions, milestones and next steps. Project and task notes can be edited or deleted, with no app-imposed note count limit.

## 5. Track the work, not just the dates

Start a timer on a project or task. Starting another stops the previous timer, so only one runs at a time. Timers continue until stopped, including while Chrome is closed or your computer is asleep. For past work, choose **Log time** and enter the start and duration. Edit an entry to fix a forgotten timer. Manual overlaps are counted as entered.

## 6. Read the bigger picture

**Reports** shows project progress, time distribution, daily activity and task-level detail. Project time includes direct time and its tasks, each counted once. The time-range filter applies to recorded effort; progress and checklist totals show their current state. Average progress excludes unset projects. Choose **Print / Save PDF** to keep a report.

## 7. Make Locus feel like you

**Appearance** offers Modern (rounded, violet), Classic (warm paper and serif headings), and Minimalist (quiet grayscale). Light and Dark are separate choices, so every design works in both modes. The sidebar mode button is a shortcut. Preferences stay saved after restarting Chrome and travel in JSON backups.

## 8. Keep automatic backups

**Backup & restore** lets you choose hourly, daily, weekly or off. Daily is the default. The first scheduled backup is one full interval after setup. Use **Back up now** to test immediately. Files go under **Downloads/Locus/Backups/YYYY-MM**. Each filename includes Manual/Auto, a UTC timestamp, project count and revision. Existing backups are never overwritten or automatically deleted.

## 9. Know when a backup is safe

The backup panel shows the next scheduled run, a download in progress, the last successful backup and any error. Success means Chrome reported the file download complete. Schedules need Chrome running; missed runs catch up once when it resumes. Sleep can delay alarms. Chrome download settings may still ask where to save. If a download fails, correct the problem and choose **Back up now**; scheduled backups try again at the next interval.

## 10. Restore or offload your workspace

**Export JSON** saves every project, task, note, date, time entry and progress update. Exported timers are paused at export time; the original keeps running. **Choose JSON file** validates a backup, shows a summary and asks before replacing the workspace. Imports replace rather than merge. Older Locus 1.0 backups are supported. Backup frequency and appearance are restored too.

## 11. Use recovery and move safely

**Export & clear workspace** asks you to confirm that the download was saved before clearing. **Restore recovery snapshot** undoes the last import, clear or deletion by swapping workspaces. Only one recovery snapshot is retained. Always export before uninstalling or deleting a Chrome profile. JSON files are unencrypted; keep them somewhere appropriate.

## 12. Update without losing your projects

For an unpacked installation, replace the extension files in the **same installed folder**, then click Reload at **chrome://extensions**. Do not remove and reinstall the extension. Locus may ask Chrome to enable its new downloads and alarms permissions. Export a backup before upgrading. All project data stays in the current Chrome profile.

## Backup filename example

`Locus/Backups/2026-09/Locus_Auto_2026-09-15_10-00-00-123Z_4-projects_r23.json`

The folder is relative to Chrome’s Downloads directory. The UTC timestamp avoids ambiguous local time, and the revision identifies the exported workspace state.
