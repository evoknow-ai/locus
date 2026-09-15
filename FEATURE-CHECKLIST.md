# Locus 1.1.0 — Feature and regression checklist

Keep this checklist with every release. Do not claim a Chrome interaction passed based only on a model test.

## Automated checks — passed (28 tests)

- [x] Check/uncheck restores partial task progress.
- [x] Check/uncheck restores unset task progress.
- [x] Switching timers records the prior session; task time contributes once to project totals.
- [x] Export snapshots a running timer without stopping the original.
- [x] JSON round trip preserves Unicode, plain-text markup, notes, history, sessions and order.
- [x] Invalid schema, duplicate IDs, invalid dates, out-of-range progress, inconsistent completion and orphan timers are rejected.
- [x] Alphabetical and date sorts work; missing dates remain last in either direction.
- [x] Moving first-to-last and back preserves all items.
- [x] Time range calculations clip sessions correctly.
- [x] Concurrent transactions retain both changes.
- [x] Storage write failure leaves the persisted workspace unchanged.
- [x] Recovery captures elapsed timer time, pauses it and restores the previous workspace.
- [x] A mutation error cannot partially write data.
- [x] Toolbar action reuses an existing workspace tab.
- [x] Rapid toolbar clicks create one tab.

## Added automated checks — passed

- [x] UTC filenames include kind, project count, revision and monthly folder.
- [x] First automatic backup schedules one interval after setup.
- [x] Scheduled snapshot preserves all data and pauses only the exported timer.
- [x] Success is recorded only after completed download confirmation.
- [x] Missed runs catch up once; the next deadline survives worker restart.
- [x] Frequency changes reschedule and Off clears the alarm; manual backup still works.
- [x] Concurrent requests share an in-progress download.
- [x] Interrupted backup preserves last success and reports an error.
- [x] Rejected downloads do not report success.
- [x] Worker restart reconciles a download completed while suspended.
- [x] Very fast downloads are detected even if their event arrives early.
- [x] Legacy backup preferences migrate without losing light/dark choice.
- [x] All six appearance combinations and schedule/onboarding choices round trip.

## Chrome smoke checks — pending actual browser execution

The available cloud browser blocked local preview URLs. The following are implemented but need an unpacked-extension run. No visual QA pass is claimed.

- [ ] Load unpacked: no manifest, missing asset or console errors.
- [ ] Click the toolbar twice; only one Locus workspace opens.
- [ ] Create a project using only its name. Reload Chrome and verify it remains.
- [ ] Edit description, dates, color and progress. Reject an end date before the start date.
- [ ] Create 3+ projects; test all seven sort modes and search.
- [ ] Drag first project to last, and back; reload to confirm saved order.
- [ ] Open a project by clicking its card and by keyboard on its title.
- [ ] Add 3+ tasks. Drag order; test arrow buttons.
- [ ] Complete and uncomplete a task; hide/show completed items.
- [ ] Click a task, edit its dates, description and progress, then close and reopen it.
- [ ] Add/edit/delete notes on both projects and tasks; preserve line breaks and non-English text.
- [ ] Start a project timer; switch to a task timer; stop and verify totals.
- [ ] Close and reopen the tab while timing; verify elapsed time continues.
- [ ] Log manual time; edit and delete it; verify report totals update.
- [ ] View empty and populated reports, all time filters and PDF print layout.
- [ ] Export JSON, import it, confirm restoration, and use recovery to undo import.
- [ ] Try malformed JSON; the existing workspace must remain intact.
- [ ] Export & clear; confirm download before clearing; recover the previous workspace.
- [ ] Delete a project and task; recover them and their notes/time.
- [ ] Open two workspace tabs, make distinct changes and verify neither is lost.
- [ ] Check light/dark themes, long text, keyboard focus, 1280px/1920px desktop and narrow windows.
- [ ] Verify Credits, MIT License and changelog.

## Additional 1.1 Chrome smoke checks — pending

- [ ] Upgrade by replacing files in the same installed folder; projects remain intact.
- [ ] Accept/enable downloads and alarms permissions if Chrome prompts.
- [ ] Check Modern, Classic and Minimalist in both Light and Dark modes; restart Chrome.
- [ ] First-run tour opens; Back/Next/Skip/Escape work; replay from the guide.
- [ ] Practice tour checkbox and slider do not change real project data.
- [ ] User guide is readable and printable in every design/mode.
- [ ] Back up now creates a JSON file at the documented path; Last success updates on completion.
- [ ] Cancel a download; the error appears while previous success stays visible.
- [ ] Hourly scheduling runs with the workspace tab closed while Chrome remains open.
- [ ] Restart Chrome after a missed deadline; exactly one catch-up file is created.
- [ ] Disable automatic backups; the alarm stops and Back up now remains available.
- [ ] Import a 1.0 backup and a 1.1 backup; projects and notes are preserved.

## Release rule

Retain all existing features and recheck affected workflows when changing code. Record the tested version, Chrome version, OS and outcomes. Do not silently remove controls or cap project/note counts.
