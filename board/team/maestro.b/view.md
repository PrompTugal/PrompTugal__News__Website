# Account B: every active session (ASCII view)

Written by maestro.b (account-b) at 2026-11-19T07:19Z from list_sessions, get_session and list_triggers (status and cost only, never transcripts). Rewritten at each wake.

```
+============================================================================================+
| ACCOUNT B: EVERY ACTIVE SESSION, ITS STATE, BLOCKERS AND SCHEDULE                          |
| maestro.b (account-b), 2026-11-19T07:19Z                                                   |
| from list_sessions, get_session, list_triggers (status only, never transcripts)            |
+============================================================================================+
  >> working   ok idle, last turn done   !! blocked: waits on a person   XX failed
  wake = the enabled scheduled task wired to it; "-- none --" = runs only when someone writes to it

     session                                last  wake                         cost
  .-- FOCUSED CONDUCTORS --------------------------------------------------------------------
  | >> conductor.b@                       07:18Z  hourly :48 UTC               $351
  | !! conductor.b@AgentiCCells           07:07Z  hourly :06 UTC                $12
  |    '-> - https://claude.ai/code/session_01Kw9UwFgyMuNDYCnrW1ZKkm - Dinis: should conducto
  | ok cells.b (AgentiCCells)             03:19Z  -- none --                    $25
  | !! writer-10 (newsroom.sgit.ai)       03:19Z  09:47+18:47 London            $19
  |    '-> confirm the reading (refuse all commits except writer and CI version commits), and
  '------------------------------------------------------------------------------------------

  .-- AGENTICCELLS (cells.b's own conductors) -----------------------------------------------
  | !! conductor.agenticcells-ai@         04:55Z  -- none --                       
  |    '-> Dinis to decide the 10 items in team/rounds/5.md (home page, £50 price, contact ad
  | !! hub.b@                             03:19Z  -- none --                       
  |    '-> pick option 1 (allow hub.b@ in the CI check) or option 2 (re-sign commit as hub-b@
  | >> cells.b conductor (private project 07:17Z  -- none --                       
  | !! conductor.evals@                   03:06Z  -- none --                       
  |    '-> approve the two repo attaches when requested; give provider 2's domain and key env
  | ok cells.b conductor (private project 02:18Z  -- none --                       
  '------------------------------------------------------------------------------------------

  .-- SIDE-CARS -----------------------------------------------------------------------------
  | !! telemetry.b@                       06:29Z  hourly :26 UTC                 $9
  |    '-> Dinis to vouch for telemetry.b's key entry (encrypted vault still open)
  | ok abp@                               06:47Z  hourly :37 UTC                   
  | ok rights@                            06:45Z  hourly :45 UTC                   
  | ok security@                          07:17Z  1h day/3h night :03              
  '------------------------------------------------------------------------------------------

  .-- PROMPTUGAL MAIN TEAM (under conductor.b@) ---------------------------------------------
  | ok journalist@                        06:51Z  hourly :40 UTC                   
  | >> dev@                               07:18Z  hourly :08 UTC                   
  | ok designer@                          06:39Z  2h :33 UTC                       
  | ok correspondent@                     06:44Z  2h :44 UTC                       
  | ok ontologist@                        06:22Z  2h :21 UTC                       
  | ok researcher@                        07:14Z  hourly :13 UTC                   
  | ok datasci.places@                    07:16Z  hourly :15 UTC                   
  | ok dev.places@                        07:12Z  hourly :11 UTC                   
  | ok designer.places@                   07:00Z  2h :52 UTC                       
  | ok translator@                        06:58Z  3h :57 UTC                       
  | ok outreach@                          06:50Z  3h :38 UTC                       
  | !! sherpa@                            06:30Z  3h :29 UTC                       
  |    '-> provide the missing sgit inbox token; if the signed commit is refused, a person or
  | ok librarian@                         07:02Z  3h :56 UTC                       
  | ok place.algarve.west@                06:20Z  hourly :20 UTC                   
  | ok place.algarve.central@             06:26Z  hourly :25 UTC                   
  | ok place.algarve.east@                06:43Z  hourly :30 UTC                   
  | ok place.districts@                   06:38Z  2h :35 UTC                       
  '------------------------------------------------------------------------------------------

  .-- PROMPTUGAL SITE LEADS (under conductor.b@) --------------------------------------------
  | >> data.b@                            07:18Z  hourly :03 Lis                   
  | >> weather.b@                         07:18Z  3h 07-22 Lis :13                 
  | >> civic.b@                           07:18Z  3h 07-22 Lis :23                 
  | >> startups.b@                        07:18Z  3h 07-22 Lis :43                 
  | >> travel.b@                          07:18Z  3h 07-22 Lis :53                 
  | >> events.b@                          07:18Z  3h 07-22 Lis :33                 
  | >> signals.b@                         07:18Z  3h 07-22 Lis :28                 
  | >> library.b@                         07:18Z  3h 07-22 Lis :38                 
  | >> videos.b@                          07:18Z  3h 07-22 Lis :48                 
  | >> live.b@                            07:18Z  3h 07-22 Lis :08                 
  | >> cyber.b@                           07:18Z  3h 07-22 Lis :18                 
  | >> bulletins.b@                       07:18Z  3h 07-22 Lis :58                 
  '------------------------------------------------------------------------------------------

  .-- THIS SESSION --------------------------------------------------------------------------
  | >> maestro.b (account-b)              07:18Z  hourly :18 UTC                   
  '------------------------------------------------------------------------------------------

  .-- DORMANT: idle since before 18 Nov, no enabled wake -----------------------------------
  | 57 sessions: the Fringe swarm (11-14 Nov), the iOS team and night push (7-11 Nov),
  | the first account-B dev.* workers, backup, historian, customers, investors.packs (7-13 Nov).
  | 15 still read 'blocked', most on a board/HOLD.md that no longer exists: stale, not live.
  | None has a wake, so none costs anything while idle. Archiving them is Dinis's call.
  '------------------------------------------------------------------------------------------

  +----------------------------------------------------------------------------------------+
  | active: 43   blocked on a person: 7   active with no wake: 6                           |
  | enabled wakes: 34 recurring + 1 one-shot; none points at a dead session                |
  | cost: telemetry.b@'s last count, $2,073 for 36 sessions at 06:35 (+$13.55 in its last hour) |
  +----------------------------------------------------------------------------------------+

  WAKE CLOCK: the minute past each hour (UTC unless *; * = Lisbon time: 3-hourly 07-22, data.b hourly)
   :00 | 03 data.b*+security  06 conductor.b  08 live.b*+dev
   :10 | 11 dev.places  13 weather.b*+researcher  15 datasci.places  18 maestro.b+cyber.b*
   :20 | 20 place.algarve.west  21 ontologist  23 civic.b*  25 place.algarve.central  26 telemetry.b  28 signals.b*  29 sherpa
   :30 | 30 place.algarve.east  33 events.b*+designer  35 place.districts  37 abp  38 library.b*+outreach
   :40 | 40 journalist  43 startups.b*  44 correspondent  45 rights  47 writer-10  48 videos.b*+conductor.b
   :50 | 52 designer.places  53 travel.b*  56 librarian  57 translator  58 bulletins.b*
   (writer-10 twice a day at 09:47 and 18:47 London; cells.b one-shot at 02:04 UTC)
```
